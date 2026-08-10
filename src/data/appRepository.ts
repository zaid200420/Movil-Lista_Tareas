import { AppState, Pedido, Turno, Usuario, Conductor, Camion, RolUsuario } from '../types';
import { STORAGE_KEYS } from './keys';
import { storageAdapter } from './storage';

export const appRepository = {
  init: async () => {
    await storageAdapter.init();
  },

  loadState: async (): Promise<Partial<AppState>> => {
    const [pedidos, turnoActivo, historialTurnos, conductores, camiones, usuarios, correlativoGuia, rolActivo, usuarioActivo, conductorActivo] = await Promise.all([
      storageAdapter.getItem<Pedido[]>(STORAGE_KEYS.PEDIDOS),
      storageAdapter.getItem<Turno | null>(STORAGE_KEYS.TURNO_ACTIVO),
      storageAdapter.getItem<Turno[]>(STORAGE_KEYS.HISTORIAL_TURNOS),
      storageAdapter.getItem<Conductor[]>(STORAGE_KEYS.CONDUCTORES),
      storageAdapter.getItem<Camion[]>(STORAGE_KEYS.CAMIONES),
      storageAdapter.getItem<Usuario[]>(STORAGE_KEYS.USUARIOS),
      storageAdapter.getItem<number>(STORAGE_KEYS.CORRELATIVO_GUIA),
      storageAdapter.getItem<string | null>(STORAGE_KEYS.ROL_ACTIVO),
      storageAdapter.getItem<Usuario | null>(STORAGE_KEYS.USUARIO_ACTIVO),
      storageAdapter.getItem<Conductor | null>(STORAGE_KEYS.CONDUCTOR_ACTIVO),
    ]);

    return {
      pedidos: pedidos ?? undefined,
      turnoActivo: turnoActivo ?? undefined,
      historialTurnos: historialTurnos ?? undefined,
      conductores: conductores ?? undefined,
      camiones: camiones ?? undefined,
      usuarios: usuarios ?? undefined,
      correlativoGuia: correlativoGuia ?? undefined,
      rolActivo: (rolActivo as string | null | undefined) ?? undefined,
      usuarioActivo: usuarioActivo ?? undefined,
      conductorActivo: conductorActivo ?? undefined,
    };
  },

  saveState: async (state: Partial<AppState>): Promise<void> => {
    await Promise.all([
      state.pedidos !== undefined ? storageAdapter.setItem(STORAGE_KEYS.PEDIDOS, state.pedidos) : Promise.resolve(),
      state.turnoActivo !== undefined ? storageAdapter.setItem(STORAGE_KEYS.TURNO_ACTIVO, state.turnoActivo) : Promise.resolve(),
      state.historialTurnos !== undefined ? storageAdapter.setItem(STORAGE_KEYS.HISTORIAL_TURNOS, state.historialTurnos) : Promise.resolve(),
      state.conductores !== undefined ? storageAdapter.setItem(STORAGE_KEYS.CONDUCTORES, state.conductores) : Promise.resolve(),
      state.camiones !== undefined ? storageAdapter.setItem(STORAGE_KEYS.CAMIONES, state.camiones) : Promise.resolve(),
      state.usuarios !== undefined ? storageAdapter.setItem(STORAGE_KEYS.USUARIOS, state.usuarios) : Promise.resolve(),
      state.correlativoGuia !== undefined ? storageAdapter.setItem(STORAGE_KEYS.CORRELATIVO_GUIA, state.correlativoGuia) : Promise.resolve(),
      state.rolActivo !== undefined ? storageAdapter.setItem(STORAGE_KEYS.ROL_ACTIVO, state.rolActivo) : Promise.resolve(),
      state.usuarioActivo !== undefined ? storageAdapter.setItem(STORAGE_KEYS.USUARIO_ACTIVO, state.usuarioActivo) : Promise.resolve(),
      state.conductorActivo !== undefined ? storageAdapter.setItem(STORAGE_KEYS.CONDUCTOR_ACTIVO, state.conductorActivo) : Promise.resolve(),
    ]);
  },

  getPedidos: async () => (await storageAdapter.getItem<Pedido[]>(STORAGE_KEYS.PEDIDOS)) ?? [],
  savePedidos: async (pedidos: Pedido[]) => await storageAdapter.setItem(STORAGE_KEYS.PEDIDOS, pedidos),

  getUsuarios: async () => (await storageAdapter.getItem<Usuario[]>(STORAGE_KEYS.USUARIOS)) ?? [],
  saveUsuarios: async (usuarios: Usuario[]) => await storageAdapter.setItem(STORAGE_KEYS.USUARIOS, usuarios),

  getConductores: async () => (await storageAdapter.getItem<Conductor[]>(STORAGE_KEYS.CONDUCTORES)) ?? [],
  saveConductores: async (conductores: Conductor[]) => await storageAdapter.setItem(STORAGE_KEYS.CONDUCTORES, conductores),

  getCamiones: async () => (await storageAdapter.getItem<Camion[]>(STORAGE_KEYS.CAMIONES)) ?? [],
  saveCamiones: async (camiones: Camion[]) => await storageAdapter.setItem(STORAGE_KEYS.CAMIONES, camiones),

  getTurnoActivo: async () => await storageAdapter.getItem<Turno | null>(STORAGE_KEYS.TURNO_ACTIVO),
  saveTurnoActivo: async (turno: Turno | null) => await storageAdapter.setItem(STORAGE_KEYS.TURNO_ACTIVO, turno),

  getHistorialTurnos: async () => (await storageAdapter.getItem<Turno[]>(STORAGE_KEYS.HISTORIAL_TURNOS)) ?? [],
  saveHistorialTurnos: async (turnos: Turno[]) => await storageAdapter.setItem(STORAGE_KEYS.HISTORIAL_TURNOS, turnos),

  getCorrelativoGuia: async () => (await storageAdapter.getItem<number>(STORAGE_KEYS.CORRELATIVO_GUIA)) ?? 1,
  saveCorrelativoGuia: async (correlativo: number) => await storageAdapter.setItem(STORAGE_KEYS.CORRELATIVO_GUIA, correlativo),

  saveSession: async (rolActivo: string | null, usuarioActivo: Usuario | null, conductorActivo: Conductor | null) => {
    await Promise.all([
      storageAdapter.setItem(STORAGE_KEYS.ROL_ACTIVO, rolActivo),
      storageAdapter.setItem(STORAGE_KEYS.USUARIO_ACTIVO, usuarioActivo),
      storageAdapter.setItem(STORAGE_KEYS.CONDUCTOR_ACTIVO, conductorActivo),
    ]);
  },
};
