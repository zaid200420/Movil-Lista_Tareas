import { Platform } from 'react-native';
import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IStorageAdapter } from '../domain/contracts';

const DB_NAME = 'interandina.db';
const STORAGE_TABLE = 'storage';
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

export async function initStorageSQLite() {
  if (isWeb) {
    return;
  }

  await runSql(
    `CREATE TABLE IF NOT EXISTS ${STORAGE_TABLE} (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT
    );`
  );
}

async function getStoredValueSQLite<T>(key: string): Promise<T | null> {
  if (isWeb) return null;

  const rows = await querySql<{ value: string }>(
    `SELECT value FROM ${STORAGE_TABLE} WHERE key = ?;`,
    [key]
  );

  if (rows.length === 0) {
    return null;
  }

  const row = rows[0];
  return row.value ? (JSON.parse(row.value) as T) : null;
}

async function setStoredValueSQLite(key: string, value: any) {
  if (isWeb) return;

  await runSql(
    `INSERT INTO ${STORAGE_TABLE} (key, value)
      VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value;`,
    [key, JSON.stringify(value)]
  );
}

async function removeStoredValueSQLite(key: string) {
  if (isWeb) return;
  await runSql(`DELETE FROM ${STORAGE_TABLE} WHERE key = ?;`, [key]);
}

export const sqliteStorageAdapter: IStorageAdapter = {
  init: initStorageSQLite,
  getItem: async key => getStoredValueSQLite(key),
  setItem: async (key, value) => setStoredValueSQLite(key, value),
  removeItem: async key => removeStoredValueSQLite(key),
};

export const asyncStorageAdapter: IStorageAdapter = {
  init: async () => undefined,
  getItem: async key => {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },
  setItem: async (key, value) => {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },
  removeItem: async key => {
    await AsyncStorage.removeItem(key);
  },
};

export const storageAdapter: IStorageAdapter = isWeb ? asyncStorageAdapter : sqliteStorageAdapter;
