import { AppState, Pedido, Turno, Usuario, Conductor, Camion } from '../types';

export type DataSourceType = 'sqlite' | 'asyncstorage' | 'rest' | 'firebase';

export interface IStorageAdapter {
  init(): Promise<void>;
  getItem<T>(key: string): Promise<T | null>;
  setItem<T>(key: string, value: T): Promise<void>;
  removeItem(key: string): Promise<void>;
}

export interface IAppRepository {
  init(): Promise<void>;
  loadState(): Promise<Partial<AppState>>;
  saveState(state: Partial<AppState>): Promise<void>;

  getPedidos(): Promise<Pedido[]>;
  savePedidos(pedidos: Pedido[]): Promise<void>;
  getUsuarios(): Promise<Usuario[]>;
  saveUsuarios(usuarios: Usuario[]): Promise<void>;
  getConductores(): Promise<Conductor[]>;
  saveConductores(conductores: Conductor[]): Promise<void>;
  getCamiones(): Promise<Camion[]>;
  saveCamiones(camiones: Camion[]): Promise<void>;
  getTurnoActivo(): Promise<Turno | null>;
  saveTurnoActivo(turno: Turno | null): Promise<void>;
  getHistorialTurnos(): Promise<Turno[]>;
  saveHistorialTurnos(turnos: Turno[]): Promise<void>;
  getCorrelativoGuia(): Promise<number>;
  saveCorrelativoGuia(correlativo: number): Promise<void>;

  saveSession(rolActivo: string | null, usuarioActivo: Usuario | null, conductorActivo: Conductor | null): Promise<void>;
}
