import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Todo } from '../types';
import { useAuth } from './AuthContext';

interface TodoContextType {
  todos: Todo[];
  categories: string[];
  isLoading: boolean;
  loadTodos: () => Promise<void>;
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'completed' | 'userId'>) => Promise<void>;
  updateTodo: (id: string, todoUpdate: Partial<Omit<Todo, 'id' | 'createdAt' | 'userId'>>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);
const STORAGE_KEY = '@todos_app_storage';

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories] = useState<string[]>(['General', 'Urgente', 'Soporte']);
  const [isLoading, setIsLoading] = useState(true);

  const loadTodos = async () => {
    setIsLoading(true);
    if (!currentUser) {
      setTodos([]);
      setIsLoading(false);
      return;
    }

    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const allTodos: Todo[] = JSON.parse(data);
        setTodos(allTodos.filter(item => item.userId === currentUser.id));
      } else {
        setTodos([]);
      }
    } catch (error) {
      console.error('Error cargando tareas de AsyncStorage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTodosToStorage = async (newTodos: Todo[]) => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      let allTodos: Todo[] = data ? JSON.parse(data) : [];
      // Reemplazar tareas del usuario actual
      allTodos = allTodos.filter(item => item.userId !== currentUser?.id).concat(newTodos);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(allTodos));
    } catch (error) {
      console.error('Error guardando en AsyncStorage:', error);
    }
  };

  const addTodo = async (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'completed' | 'userId'>) => {
    if (!currentUser) return;

    const timestamp = new Date().toISOString();
    const newTodo: Todo = {
      ...todo,
      id: Date.now().toString(),
      completed: false,
      createdAt: timestamp,
      updatedAt: timestamp,
      userId: currentUser.id,
    };

    const updated = [newTodo, ...todos];
    setTodos(updated);
    await saveTodosToStorage(updated);
  };

  const updateTodo = async (id: string, todoUpdate: Partial<Omit<Todo, 'id' | 'createdAt' | 'userId'>>) => {
    const updated = todos.map(item =>
      item.id === id ? { ...item, ...todoUpdate, updatedAt: new Date().toISOString() } : item
    );
    setTodos(updated);
    await saveTodosToStorage(updated);
  };

  const deleteTodo = async (id: string) => {
    const updated = todos.filter(item => item.id !== id);
    setTodos(updated);
    await saveTodosToStorage(updated);
  };

  const toggleTodo = async (id: string) => {
    const updated = todos.map(item =>
      item.id === id ? { ...item, completed: !item.completed, updatedAt: new Date().toISOString() } : item
    );
    setTodos(updated);
    await saveTodosToStorage(updated);
  };

  useEffect(() => {
    loadTodos();
  }, [currentUser]);

  return (
    <TodoContext.Provider value={{
      todos,
      categories,
      isLoading,
      loadTodos,
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
    throw new Error('useTodo debe usarse dentro de un TodoProvider');
  }
  return context;
}