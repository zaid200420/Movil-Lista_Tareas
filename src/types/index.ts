export type ZonaLima = 'Lima Norte'|'Lima Sur'|'Lima Centro'|'Lima Este'|'Lima Oeste'|'Callao'|'Provincia'|'Sin clasificar';
export type EstadoPedido = 'pendiente'|'asignado'|'en_ruta'|'entregado'|'no_entregado'|'incidencia';
export type MotivoNoEntrega = 'cliente_ausente'|'direccion_incorrecta'|'rechazado_por_cliente'|'fuera_de_ventana_horaria'|'producto_danado'|'otro';
export type EstadoTurno = 'en_consolidacion'|'asignado'|'autorizado'|'en_ruta'|'cerrado';
export type RolUsuario = 'supervisor'|'despacho'|'conductor';

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

export interface VentanaHoraria { inicio: string; fin: string; } // "HH:MM"
export interface ItemPedido { id:string; sku:string; descripcion:string; cantidad:number; peso_unitario_kg:number; peso_total_kg:number; }
export interface PedidoEvento { id:string; timestamp:string; actor:string; rol:RolUsuario|'sistema'; accion:string; detalle?:string; }
export interface Pedido {
  id: string; numero_orden: string; numero_guia_remision: string;
  cliente: string; contacto_receptor?:string; telefono_cliente?:string;
  direccion_entrega: string; distrito: string; zona: ZonaLima;
  items: ItemPedido[]; total_bultos: number; peso_total_kg: number;
  ventana_horaria?: VentanaHoraria; requiere_conformidad: boolean;
  observaciones_cliente?: string; estado: EstadoPedido;
  conductor_id?:string; camion_id?:string; orden_entrega?:number;
  motivo_no_entrega?:MotivoNoEntrega; nota_incidencia?:string;
  timestamp_entrega?:string; eventos: PedidoEvento[];
  fecha_despacho: string; timestamp_creacion: string; timestamp_actualizacion: string;
}
export interface Camion { id:string; placa:string; marca?:string; capacidad_maxima_kg:number; capacidad_maxima_bultos:number; activo:boolean; }
export interface Conductor { id:string; nombre:string; camion_id:string; pin_hash:string; activo:boolean; }
export interface Usuario { id: string; username: string; password_hash: string; nombre: string; rol: RolUsuario; }
export interface AsignacionCamion { camion_id:string; conductor_id:string; pedidos_ids:string[]; peso_total_asignado_kg:number; bultos_total_asignados:number; porcentaje_carga_peso:number; porcentaje_carga_bultos:number; }
export interface Turno {
  id:string; fecha:string; estado:EstadoTurno; asignaciones:AsignacionCamion[];
  pedidos_ids:string[];
  metricas:{ total_pedidos:number; entregados:number; no_entregados:number; con_incidencia:number; tiempo_consolidacion_minutos?:number; };
  timestamp_inicio:string; timestamp_autorizacion?:string; timestamp_cierre?:string;
}
export interface AppState {
  usuarios: Usuario[];
  conductores:Conductor[]; camiones:Camion[]; pedidos:Pedido[];
  turnoActivo:Turno|null; historialTurnos:Turno[];
  rolActivo:RolUsuario|null; 
  usuarioActivo: Usuario | null;
  conductorActivo:Conductor|null;
  isLoading:boolean; errorCarga:string|null; correlativoGuia:number;
}
