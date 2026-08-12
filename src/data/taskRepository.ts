import AsyncStorage from '@react-native-async-storage/async-storage';
import { Todo } from '../types';

const TASKS_KEY = '@tasks_database_v3';

export const initTaskRepository = async (): Promise<void> => {
  // Inicialización de persistencia local
};

export const getTasksByUser = async (userId: string): Promise<Todo[]> => {
  try {
    const data = await AsyncStorage.getItem(TASKS_KEY);
    const allTasks: Todo[] = data ? JSON.parse(data) : [];
    return allTasks.filter(task => task.userId === userId);
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    return [];
  }
};

export const saveTask = async (task: Todo): Promise<void> => {
  try {
    const data = await AsyncStorage.getItem(TASKS_KEY);
    let allTasks: Todo[] = data ? JSON.parse(data) : [];
    const index = allTasks.findIndex(t => t.id === task.id);

    if (index >= 0) {
      allTasks[index] = task;
    } else {
      allTasks.unshift(task);
    }

    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(allTasks));
  } catch (error) {
    console.error('Error al guardar tarea:', error);
  }
};

export const deleteTask = async (id: string): Promise<void> => {
  try {
    const data = await AsyncStorage.getItem(TASKS_KEY);
    let allTasks: Todo[] = data ? JSON.parse(data) : [];
    allTasks = allTasks.filter(t => t.id !== id);
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(allTasks));
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
  }
};

export const getUnsyncedTasks = async (userId: string): Promise<Todo[]> => {
  const tasks = await getTasksByUser(userId);
  return tasks.filter(t => !t.synced);
};

export const markTaskSynced = async (id: string, remoteId: string): Promise<void> => {
  try {
    const data = await AsyncStorage.getItem(TASKS_KEY);
    let allTasks: Todo[] = data ? JSON.parse(data) : [];
    const index = allTasks.findIndex(t => t.id === id);
    if (index >= 0) {
      allTasks[index].synced = true;
      allTasks[index].remoteId = remoteId;
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(allTasks));
    }
  } catch (error) {
    console.error('Error al marcar sincronizado:', error);
  }
};