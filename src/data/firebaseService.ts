import { Todo } from '../types';

export const isFirebaseReady = (): boolean => {
  return false; // Retorna false para evitar llamadas a Firebase no configurado
};

export const syncTaskToFirebase = async (task: Todo): Promise<string> => {
  return `remote_${task.id}`;
};