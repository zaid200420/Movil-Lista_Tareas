import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { 
  AppState, Pedido, Turno, RolUsuario, Conductor, Camion, 
  EstadoPedido, MotivoNoEntrega, PedidoEvento, Usuario 
} from '../types';
import { PEDIDOS_SEED, CONDUCTORES_SEED, CAMIONES_SEED, USUARIOS_SEED } from '../constants/seedData';
import { clasificarZona } from '../utils/clasificarZona';
import { generarNumeroGuia } from '../utils/generarGuia';
import { validarAsignacion } from '../utils/validarAsignacion';
import { ordenarRutaConductor } from '../utils/ordenarRuta';
import { appRepository } from '../data/appRepository';

interface AppContextProps extends AppState {
  seleccionarRol: (rol: RolUsuario | null) => void;
  login: (username: string, password: string) => Promise<{ ok: boolean; rol?: RolUsuario }>;
  loginConductor: (pin: string) => Promise<boolean>;
  cerrarSesion: () => void;
  crearPedido: (pedido: Partial<Pedido>) => Promise<void>;
  actualizarPedido: (id: string, cambios: Partial<Pedido>, actor: string, rol: RolUsuario | 'sistema') => Promise<void>;
  asignarPedidosACamion: (pedidos_ids: string[], camion_id: string, conductor_id: string) => Promise<{ ok: boolean; error?: string }>;
  generarTurno: () => Promise<void>;
  autorizarSalida: () => Promise<void>;
  cerrarTurno: () => Promise<void>;
  confirmarEntrega: (pedido_id: string, conductor: Conductor) => Promise<void>;
  reportarNoEntrega: (pedido_id: string, motivo: MotivoNoEntrega, nota: string, conductor: Conductor) => Promise<void>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

const KEYS = {
  PEDIDOS: '@interandina/pedidos',
  TURNO_ACTIVO: '@interandina/turno_activo',
  HISTORIAL_TURNOS: '@interandina/historial_turnos',
  CONDUCTORES: '@interandina/conductores',
  CAMIONES: '@interandina/camiones',
  USUARIOS: '@interandina/usuarios',
  CORRELATIVO_GUIA: '@interandina/correlativo_guia',
  ROL_ACTIVO: '@interandina/rol_activo',
  USUARIO_ACTIVO: '@interandina/usuario_activo',
  CONDUCTOR_ACTIVO: '@interandina/conductor_activo',
} as const;

type AppStateKey = typeof KEYS[keyof typeof KEYS];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    usuarios: [],
    conductores: [],
    camiones: [],
    pedidos: [],
    turnoActivo: null,
    historialTurnos: [],
    rolActivo: null,
    usuarioActivo: null,
    conductorActivo: null,
    isLoading: true,
    errorCarga: null,
    correlativoGuia: 1,
  });

  const hasCargado = useRef(false);

  useEffect(() => {
    if (hasCargado.current) return;
    hasCargado.current = true;
    inicializarRepositorio();
  }, []);

  const inicializarRepositorio = async () => {
    try {
      await appRepository.init();
    } catch (error) {
      console.error('Error inicializando repositorio:', error);
    } finally {
      cargarEstadoDesdeStorage();
    }
  };

  const cargarEstadoDesdeStorage = async () => {
    try {
      const {
        pedidos,
        turnoActivo: loadedTurno,
        historialTurnos: loadedHistorial,
        conductores: loadedConductores,
        camiones: loadedCamiones,
        usuarios: loadedUsuarios,
        correlativoGuia: loadedCorrelativo,
        rolActivo: loadedRol,
        usuarioActivo: loadedUsuario,
        conductorActivo: loadedConductor,
      } = await appRepository.loadState();

      const hoy = new Date().toISOString().slice(0, 10);
      let turnoActivo: Turno | null = loadedTurno ?? null;
      let historialTurnos: Turno[] = loadedHistorial ?? [];
      let correlativoGuia = loadedCorrelativo ?? 1;

      // Verificar si el turno activo es de un día anterior
      if (turnoActivo && turnoActivo.fecha !== hoy) {
        historialTurnos = [turnoActivo, ...historialTurnos].slice(0, 7);
        turnoActivo = null;
        correlativoGuia = 1;
        await appRepository.saveState({ turnoActivo, historialTurnos, correlativoGuia });
      }

      setState(prev => ({
        ...prev,
        pedidos: pedidos ?? PEDIDOS_SEED,
        turnoActivo,
        historialTurnos,
        conductores: loadedConductores ?? CONDUCTORES_SEED,
        camiones: loadedCamiones ?? CAMIONES_SEED,
        usuarios: loadedUsuarios ?? USUARIOS_SEED,
        correlativoGuia,
        rolActivo: loadedRol as RolUsuario | null,
        usuarioActivo: loadedUsuario ?? null,
        conductorActivo: loadedConductor ?? null,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error cargando estado:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        errorCarga: 'Error al cargar datos' 
      }));
    } finally {
      await SplashScreen.hideAsync();
    }
  };

  const persistState = async (stateToSave: Partial<AppState>) => {
    try {
      await appRepository.saveState(stateToSave);
    } catch (error) {
      console.error('Error persistiendo estado:', error);
    }
  };

  const persistir = async (key: AppStateKey, value: any) => {
    try {
      switch (key) {
        case KEYS.PEDIDOS:
          await appRepository.saveState({ pedidos: value });
          break;
        case KEYS.TURNO_ACTIVO:
          await appRepository.saveState({ turnoActivo: value });
          break;
        case KEYS.HISTORIAL_TURNOS:
          await appRepository.saveState({ historialTurnos: value });
          break;
        case KEYS.CONDUCTORES:
          await appRepository.saveState({ conductores: value });
          break;
        case KEYS.CAMIONES:
          await appRepository.saveState({ camiones: value });
          break;
        case KEYS.USUARIOS:
          await appRepository.saveState({ usuarios: value });
          break;
        case KEYS.CORRELATIVO_GUIA:
          await appRepository.saveState({ correlativoGuia: value });
          break;
        case KEYS.ROL_ACTIVO:
          await appRepository.saveState({ rolActivo: value as RolUsuario | null });
          break;
        case KEYS.USUARIO_ACTIVO:
          await appRepository.saveState({ usuarioActivo: value as Usuario | null });
          break;
        case KEYS.CONDUCTOR_ACTIVO:
          await appRepository.saveState({ conductorActivo: value as Conductor | null });
          break;
        default:
          console.warn('Clave de persistencia no reconocida:', key);
      }
    } catch (error) {
      console.error('Error persistiendo estado:', error);
    }
  };

  const seleccionarRol = (rol: RolUsuario | null) => {
    setState(prev => ({ ...prev, rolActivo: rol }));
    persistir(KEYS.ROL_ACTIVO, rol);
  };

  const login = async (username: string, password: string): Promise<{ ok: boolean; rol?: RolUsuario }> => {
    const passwordHash = btoa(password);
    const usuario = state.usuarios.find(u => u.username === username && u.password_hash === passwordHash);
    
    if (usuario) {
      let conductorActivo = state.conductorActivo;
      if (usuario.rol === 'conductor') {
        conductorActivo = state.conductores.find(c => c.nombre === usuario.nombre) || state.conductores[0];
      }
      
      setState(prev => ({ 
        ...prev, 
        usuarioActivo: usuario, 
        rolActivo: usuario.rol,
        conductorActivo: usuario.rol === 'conductor' ? conductorActivo : prev.conductorActivo
      }));
      
      await persistir(KEYS.USUARIO_ACTIVO, usuario);
      await persistir(KEYS.ROL_ACTIVO, usuario.rol);
      if (usuario.rol === 'conductor' && conductorActivo) {
        await persistir(KEYS.CONDUCTOR_ACTIVO, conductorActivo);
      }
      
      return { ok: true, rol: usuario.rol };
    }
    return { ok: false };
  };

  const loginConductor = async (pin: string): Promise<boolean> => {
    const pinHash = btoa(pin);
    const conductor = state.conductores.find(c => c.pin_hash === pinHash);
    if (conductor) {
      // Para el conductor, también buscamos si hay un usuario asociado o creamos una sesión
      const usuarioConductor = state.usuarios.find(u => u.rol === 'conductor' && u.password_hash === pinHash);
      
      setState(prev => ({ 
        ...prev, 
        conductorActivo: conductor, 
        rolActivo: 'conductor',
        usuarioActivo: usuarioConductor || null 
      }));
      
      await persistir(KEYS.CONDUCTOR_ACTIVO, conductor);
      await persistir(KEYS.ROL_ACTIVO, 'conductor');
      if (usuarioConductor) await persistir(KEYS.USUARIO_ACTIVO, usuarioConductor);
      
      return true;
    }
    return false;
  };

  const cerrarSesion = () => {
    setState(prev => ({ ...prev, rolActivo: null, conductorActivo: null, usuarioActivo: null }));
    persistir(KEYS.ROL_ACTIVO, null);
    persistir(KEYS.CONDUCTOR_ACTIVO, null);
    persistir(KEYS.USUARIO_ACTIVO, null);
  };

  const crearPedido = async (nuevoPedido: Partial<Pedido>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const ahora = new Date().toISOString();
    const correlativo = state.correlativoGuia;
    const guia = await generarNumeroGuia(correlativo);

    const pedidoCompleto: Pedido = {
      ...nuevoPedido as Pedido,
      id,
      numero_guia_remision: guia,
      zona: clasificarZona(nuevoPedido.distrito || ''),
      estado: 'pendiente',
      eventos: [{
        id: Math.random().toString(36).substr(2, 9),
        timestamp: ahora,
        actor: 'Vicente',
        rol: 'despacho',
        accion: 'pedido_creado'
      }],
      timestamp_creacion: ahora,
      timestamp_actualizacion: ahora,
    };

    const nuevosPedidos = [...state.pedidos, pedidoCompleto];
    setState(prev => ({ 
      ...prev, 
      pedidos: nuevosPedidos,
      correlativoGuia: prev.correlativoGuia + 1
    }));
    await persistir(KEYS.PEDIDOS, nuevosPedidos);
    await persistir(KEYS.CORRELATIVO_GUIA, state.correlativoGuia + 1);
  };

  const actualizarPedido = async (id: string, cambios: Partial<Pedido>, actor: string, rol: RolUsuario | 'sistema') => {
    const ahora = new Date().toISOString();
    const nuevosPedidos = state.pedidos.map(p => {
      if (p.id === id) {
        const evento: PedidoEvento = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: ahora,
          actor,
          rol,
          accion: 'pedido_actualizado',
          detalle: JSON.stringify(cambios)
        };
        return { ...p, ...cambios, eventos: [...p.eventos, evento], timestamp_actualizacion: ahora };
      }
      return p;
    });

    setState(prev => ({ ...prev, pedidos: nuevosPedidos }));
    await persistir(KEYS.PEDIDOS, nuevosPedidos);
  };

  const asignarPedidosACamion = async (pedidos_ids: string[], camion_id: string, conductor_id: string) => {
    const camion = state.camiones.find(c => c.id === camion_id);
    if (!camion) return { ok: false, error: 'Camión no encontrado' };

    const pedidosParaAsignar = state.pedidos.filter(p => pedidos_ids.includes(p.id));
    const pesoTotal = pedidosParaAsignar.reduce((acc, p) => acc + p.peso_total_kg, 0);
    const bultosTotal = pedidosParaAsignar.reduce((acc, p) => acc + p.total_bultos, 0);

    const validacion = validarAsignacion(pesoTotal, bultosTotal, camion);
    if (validacion.bloquea) return { ok: false, error: validacion.advertencia };

    const nuevosPedidos = state.pedidos.map(p => {
      if (pedidos_ids.includes(p.id)) {
        return { ...p, conductor_id, camion_id, estado: 'asignado' as EstadoPedido };
      }
      return p;
    });

    setState(prev => ({ ...prev, pedidos: nuevosPedidos }));
    await persistir(KEYS.PEDIDOS, nuevosPedidos);
    return { ok: true, advertencia: validacion.advertencia };
  };

  const generarTurno = async () => {
    const hoy = new Date().toISOString().slice(0, 10);
    const pedidosHoy = state.pedidos.filter(p => p.fecha_despacho === hoy);
    
    // Agrupar pedidos por conductor para ordenar rutas
    const conductoresIds = Array.from(new Set(pedidosHoy.map(p => p.conductor_id).filter(Boolean)));
    
    const asignaciones = conductoresIds.map(cId => {
      const pConductor = pedidosHoy.filter(p => p.conductor_id === cId);
      const ordenados = ordenarRutaConductor(pConductor);
      
      // Actualizar orden en estado principal
      ordenados.forEach(o => {
        const idx = state.pedidos.findIndex(p => p.id === o.id);
        if (idx !== -1) state.pedidos[idx] = o;
      });

      const peso = ordenados.reduce((acc, p) => acc + p.peso_total_kg, 0);
      const bultos = ordenados.reduce((acc, p) => acc + p.total_bultos, 0);
      const camion = state.camiones.find(cam => cam.id === ordenados[0].camion_id)!;

      return {
        conductor_id: cId!,
        camion_id: ordenados[0].camion_id!,
        pedidos_ids: ordenados.map(o => o.id),
        peso_total_asignado_kg: peso,
        bultos_total_asignados: bultos,
        porcentaje_carga_peso: (peso / camion.capacidad_maxima_kg) * 100,
        porcentaje_carga_bultos: (bultos / camion.capacidad_maxima_bultos) * 100,
      };
    });

    const nuevoTurno: Turno = {
      id: Math.random().toString(36).substr(2, 9),
      fecha: hoy,
      estado: 'asignado',
      asignaciones,
      pedidos_ids: pedidosHoy.map(p => p.id),
      metricas: {
        total_pedidos: pedidosHoy.length,
        entregados: 0,
        no_entregados: 0,
        con_incidencia: 0,
      },
      timestamp_inicio: new Date().toISOString(),
    };

    setState(prev => ({ ...prev, turnoActivo: nuevoTurno, pedidos: [...prev.pedidos] }));
    await persistir(KEYS.TURNO_ACTIVO, nuevoTurno);
    await persistir(KEYS.PEDIDOS, state.pedidos);
  };

  const autorizarSalida = async () => {
    if (!state.turnoActivo) return;
    const ahora = new Date().toISOString();
    const turnoAutorizado: Turno = {
      ...state.turnoActivo,
      estado: 'autorizado',
      timestamp_autorizacion: ahora
    };
    
    const nuevosPedidos = state.pedidos.map(p => {
      if (state.turnoActivo!.pedidos_ids.includes(p.id)) {
        return { ...p, estado: 'en_ruta' as EstadoPedido };
      }
      return p;
    });

    setState(prev => ({ ...prev, turnoActivo: turnoAutorizado, pedidos: nuevosPedidos }));
    await persistir(KEYS.TURNO_ACTIVO, turnoAutorizado);
    await persistir(KEYS.PEDIDOS, nuevosPedidos);
  };

  const cerrarTurno = async () => {
    if (!state.turnoActivo) return;
    const ahora = new Date().toISOString();
    const turnoCerrado: Turno = {
      ...state.turnoActivo,
      estado: 'cerrado',
      timestamp_cierre: ahora
    };

    const nuevoHistorial = [turnoCerrado, ...state.historialTurnos].slice(0, 7);
    setState(prev => ({ ...prev, turnoActivo: null, historialTurnos: nuevoHistorial }));
    await persistir(KEYS.TURNO_ACTIVO, null);
    await persistir(KEYS.HISTORIAL_TURNOS, nuevoHistorial);
    await persistir(KEYS.CORRELATIVO_GUIA, 1);
  };

  const confirmarEntrega = async (pedido_id: string, conductor: Conductor) => {
    const ahora = new Date().toISOString();
    await actualizarPedido(pedido_id, {
      estado: 'entregado',
      timestamp_entrega: ahora
    }, conductor.nombre, 'conductor');

    if (state.turnoActivo) {
      const nTurno = {
        ...state.turnoActivo,
        metricas: {
          ...state.turnoActivo.metricas,
          entregados: state.turnoActivo.metricas.entregados + 1
        }
      };
      setState(prev => ({ ...prev, turnoActivo: nTurno }));
      await persistir(KEYS.TURNO_ACTIVO, nTurno);
    }
  };

  const reportarNoEntrega = async (pedido_id: string, motivo: MotivoNoEntrega, nota: string, conductor: Conductor) => {
    await actualizarPedido(pedido_id, {
      estado: 'no_entregado',
      motivo_no_entrega: motivo,
      nota_incidencia: nota
    }, conductor.nombre, 'conductor');

    if (state.turnoActivo) {
      const nTurno = {
        ...state.turnoActivo,
        metricas: {
          ...state.turnoActivo.metricas,
          no_entregados: state.turnoActivo.metricas.no_entregados + 1
        }
      };
      setState(prev => ({ ...prev, turnoActivo: nTurno }));
      await persistir(KEYS.TURNO_ACTIVO, nTurno);
    }
  };

  return (
    <AppContext.Provider value={{
      ...state,
      seleccionarRol,
      login,
      loginConductor,
      cerrarSesion,
      crearPedido,
      actualizarPedido,
      asignarPedidosACamion,
      generarTurno,
      autorizarSalida,
      cerrarTurno,
      confirmarEntrega,
      reportarNoEntrega,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
