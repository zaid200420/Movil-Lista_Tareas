import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getNetworkStateAsync } from 'expo-network';
import { Todo } from '../types';
import { useAuth } from './AuthContext';
import { initTaskRepository, getTasksByUser, saveTask, deleteTask as deleteTaskFromRepo, getUnsyncedTasks, markTaskSynced } from '../data/taskRepository';
import { fetchCategories, fetchCollaborators, Collaborator } from '../data/restService';
import { syncTaskToFirebase, isFirebaseReady } from '../data/firebaseService';

interface TodoContextType {
  todos: Todo[];
  categories: string[];
  collaborators: Collaborator[];
  isLoading: boolean;
  isSyncing: boolean;
  loadTodos: () => Promise<void>;
  refreshMetadata: () => Promise<void>;
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'completed' | 'synced' | 'remoteId' | 'userId'>) => Promise<void>;
  updateTodo: (id: string, todoUpdate: Partial<Omit<Todo, 'id' | 'createdAt' | 'userId'>>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<string[]>(['General', 'Urgente', 'Soporte']);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const syncPendingTasks = useCallback(async () => {
    if (!currentUser) {
      return;
    }

    try {
      const network = await getNetworkStateAsync();
      if (!network.isConnected || !isFirebaseReady()) {
        return;
      }

      setIsSyncing(true);
      const pendingTasks = await getUnsyncedTasks(currentUser.id);
      for (const pendingTask of pendingTasks) {
        try {
          const remoteId = await syncTaskToFirebase(pendingTask);
          await markTaskSynced(pendingTask.id, remoteId);
        } catch (error) {
          console.error('Error syncing task to Firebase:', error);
        }
      }
    } catch (error) {
      console.error('Error checking network or syncing tasks:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [currentUser]);

  const loadTodos = async () => {
    setIsLoading(true);
    if (!currentUser) {
      setTodos([]);
      setIsLoading(false);
      return;
    }

    try {
      await initTaskRepository();
      const loadedTodos = await getTasksByUser(currentUser.id);
      setTodos(loadedTodos);
      await syncPendingTasks();
    } catch (error) {
      console.error('Error loading todos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshMetadata = async () => {
    try {
      const [categoriesList, collaboratorList] = await Promise.all([
        fetchCategories(),
        fetchCollaborators(),
      ]);
      setCategories(categoriesList);
      setCollaborators(collaboratorList);
    } catch (error) {
      console.error('Error loading metadata:', error);
    }
  };

  const addTodo = async (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'completed' | 'synced' | 'remoteId' | 'userId'>) => {
    if (!currentUser) {
      throw new Error('Usuario no autenticado');
    }

    const timestamp = new Date().toISOString();
    const newTodo: Todo = {
      ...todo,
      id: Date.now().toString(),
      completed: false,
      createdAt: timestamp,
      updatedAt: timestamp,
      userId: currentUser.id,
      synced: false,
    };

    await saveTask(newTodo);
    setTodos(prev => [newTodo, ...prev]);
    await syncPendingTasks();
  };

  const updateTodo = async (id: string, todoUpdate: Partial<Omit<Todo, 'id' | 'createdAt' | 'userId'>>) => {
    const task = todos.find(item => item.id === id);
    if (!task) {
      return;
    }

    const updatedTask: Todo = {
      ...task,
      ...todoUpdate,
      updatedAt: new Date().toISOString(),
      synced: false,
    };

    await saveTask(updatedTask);
    setTodos(prev => prev.map(item => (item.id === id ? updatedTask : item)));
    await syncPendingTasks();
  };

  const deleteTodo = async (id: string) => {
    await deleteTaskFromRepo(id);
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const toggleTodo = async (id: string) => {
    const task = todos.find(item => item.id === id);
    if (!task) {
      return;
    }

    const updatedTask: Todo = {
      ...task,
      completed: !task.completed,
      status: task.completed ? 'pendiente' : 'completada',
      updatedAt: new Date().toISOString(),
      synced: false,
    };

    await saveTask(updatedTask);
    setTodos(prev => prev.map(item => (item.id === id ? updatedTask : item)));
    await syncPendingTasks();
  };

  useEffect(() => {
    loadTodos();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const syncInterval = setInterval(() => {
      syncPendingTasks();
    }, 15000);

    return () => clearInterval(syncInterval);
  }, [currentUser, syncPendingTasks]);

  useEffect(() => {
    refreshMetadata();
  }, []);

  return (
    <TodoContext.Provider value={{
      todos,
      categories,
      collaborators,
      isLoading,
      isSyncing,
      loadTodos,
      refreshMetadata,
      addTodo,
      updateTodo,
      deleteTodo,
      toggleTodo,
    }}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodo() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
}
