import { Platform } from 'react-native';
import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Todo } from '../types';

const DB_NAME = 'todoapp.db';
const TABLE_NAME = 'tasks';
const STORAGE_KEY = '@todoapp:tasks';
const isWeb = Platform.OS === 'web';
let dbPromise: Promise<SQLiteDatabase> | null = null;

async function getDbAsync(): Promise<SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = openDatabaseAsync(DB_NAME);
  }
  return dbPromise;
}

async function runSql(sql: string, params: any[] = []) {
  const db = await getDbAsync();
  const statement = await db.prepareAsync(sql);

  try {
    return params.length > 0 ? await statement.executeAsync(params) : await statement.executeAsync();
  } finally {
    await statement.finalizeAsync();
  }
}

async function querySql<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const db = await getDbAsync();
  const statement = await db.prepareAsync(sql);

  try {
    const result = params.length > 0 ? await statement.executeAsync(params) : await statement.executeAsync();
    const rows = await result.getAllAsync();
    return rows as T[];
  } finally {
    await statement.finalizeAsync();
  }
}

export async function initTaskRepository() {
  if (isWeb) {
    return;
  }

  await runSql(
    `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
      id TEXT PRIMARY KEY,
      title TEXT,
      description TEXT,
      responsible TEXT,
      priority TEXT,
      deadline TEXT,
      status TEXT,
      category TEXT,
      completed INTEGER,
      createdAt TEXT,
      updatedAt TEXT,
      userId TEXT,
      remoteId TEXT,
      synced INTEGER,
      attachmentUri TEXT
    );`
  );
}

function rowToTask(row: any): Todo {
  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    responsible: row.responsible || '',
    priority: (row.priority as Todo['priority']) || 'Media',
    deadline: row.deadline || '',
    status: (row.status as Todo['status']) || 'pendiente',
    category: row.category || 'General',
    completed: row.completed === 1,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    userId: row.userId,
    remoteId: row.remoteId || undefined,
    synced: row.synced === 1,
    attachmentUri: row.attachmentUri || undefined,
  };
}

export async function getTasksByUser(userId: string): Promise<Todo[]> {
  if (isWeb) {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const tasks: Todo[] = stored ? JSON.parse(stored) : [];
    return tasks.filter(task => task.userId === userId);
  }

  await initTaskRepository();
  const rows = await querySql<any>(`SELECT * FROM ${TABLE_NAME} WHERE userId = ? ORDER BY updatedAt DESC;`, [userId]);
  return rows.map(rowToTask);
}

export async function getTaskById(id: string): Promise<Todo | null> {
  if (isWeb) {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const tasks: Todo[] = stored ? JSON.parse(stored) : [];
    return tasks.find(task => task.id === id) ?? null;
  }

  await initTaskRepository();
  const rows = await querySql<any>(`SELECT * FROM ${TABLE_NAME} WHERE id = ? LIMIT 1;`, [id]);
  return rows.length === 0 ? null : rowToTask(rows[0]);
}

export async function saveTask(task: Todo): Promise<void> {
  if (isWeb) {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const tasks: Todo[] = stored ? JSON.parse(stored) : [];
    const updatedTasks = tasks.filter(item => item.id !== task.id);
    updatedTasks.unshift(task);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    return;
  }

  await initTaskRepository();
  await runSql(
    `INSERT OR REPLACE INTO ${TABLE_NAME} (id, title, description, responsible, priority, deadline, status, category, completed, createdAt, updatedAt, userId, remoteId, synced, attachmentUri)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      task.id,
      task.title,
      task.description,
      task.responsible,
      task.priority,
      task.deadline,
      task.status,
      task.category,
      task.completed ? 1 : 0,
      task.createdAt,
      task.updatedAt,
      task.userId,
      task.remoteId ?? null,
      task.synced ? 1 : 0,
      task.attachmentUri ?? null,
    ]
  );
}

export async function deleteTask(id: string): Promise<void> {
  if (isWeb) {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const tasks: Todo[] = stored ? JSON.parse(stored) : [];
    const updatedTasks = tasks.filter(task => task.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    return;
  }

  await initTaskRepository();
  await runSql(`DELETE FROM ${TABLE_NAME} WHERE id = ?;`, [id]);
}

export async function getUnsyncedTasks(userId: string): Promise<Todo[]> {
  if (isWeb) {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const tasks: Todo[] = stored ? JSON.parse(stored) : [];
    return tasks.filter(task => task.userId === userId && !task.synced);
  }

  await initTaskRepository();
  const rows = await querySql<any>(`SELECT * FROM ${TABLE_NAME} WHERE userId = ? AND synced = 0 ORDER BY updatedAt ASC;`, [userId]);
  return rows.map(rowToTask);
}

export async function markTaskSynced(id: string, remoteId: string): Promise<void> {
  if (isWeb) {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const tasks: Todo[] = stored ? JSON.parse(stored) : [];
    const updatedTasks = tasks.map(task =>
      task.id === id
        ? { ...task, synced: true, remoteId }
        : task
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    return;
  }

  await initTaskRepository();
  await runSql(`UPDATE ${TABLE_NAME} SET synced = 1, remoteId = ? WHERE id = ?;`, [remoteId, id]);
}
