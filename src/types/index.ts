export type TaskPriority = 'Alta' | 'Media' | 'Baja';
export type TaskStatus = 'pendiente' | 'en_progreso' | 'completada';

export interface Todo {
  id: string;
  title: string;
  description: string;
  responsible: string;
  priority: TaskPriority;
  deadline: string;
  status: TaskStatus;
  category: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  synced: boolean;
  remoteId?: string;
  attachmentUri?: string;
}
