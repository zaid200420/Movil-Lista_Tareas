import { Camion, Conductor, Pedido, Usuario } from '../types';
import { clasificarZona } from '../utils/clasificarZona';

export const USUARIOS_SEED: Usuario[] = [
  { id: 'u1', username: 'felipe', password_hash: 'YWRtaW4xMjM=', nombre: 'Felipe Supervisor', rol: 'supervisor' }, // admin123
  { id: 'u2', username: 'vicente', password_hash: 'ZGVzcGFjaG8xMjM=', nombre: 'Vicente Despacho', rol: 'despacho' }, // despacho123
  { id: 'u3', username: 'carlos', password_hash: 'MTIzNA==', nombre: 'Carlos Conductor', rol: 'conductor' }, // 1234
];

export const CAMIONES_SEED: Camion[] = [
  { id: 'cam1', placa: 'ABC-123', marca: 'Hyundai', capacidad_maxima_kg: 3000, capacidad_maxima_bultos: 120, activo: true },
  { id: 'cam2', placa: 'DEF-456', marca: 'Volkswagen', capacidad_maxima_kg: 2000, capacidad_maxima_bultos: 80, activo: true },
  { id: 'cam3', placa: 'GHI-789', marca: 'Mercedes', capacidad_maxima_kg: 4000, capacidad_maxima_bultos: 160, activo: true },
];

export const CONDUCTORES_SEED: Conductor[] = [
  { id: 'con1', nombre: 'Carlos Quispe Huanca', camion_id: 'cam1', pin_hash: 'MTIzNA==', activo: true }, // 1234
  { id: 'con2', nombre: 'Luis Mamani Ccori', camion_id: 'cam2', pin_hash: 'NTY3OA==', activo: true }, // 5678
  { id: 'con3', nombre: 'Pedro Flores Condori', camion_id: 'cam3', pin_hash: 'OTAxMg==', activo: true }, // 9012
];

const generarItems = (id: string) => [
  { id: `${id}-1`, sku: 'PRD-001', descripcion: 'Cajas de abarrotes', cantidad: 10, peso_unitario_kg: 5, peso_total_kg: 50 },
  { id: `${id}-2`, sku: 'PRD-002', descripcion: 'Sacos de arroz', cantidad: 5, peso_unitario_kg: 20, peso_total_kg: 100 },
];

const basePedido = (id: string, orden: string, cliente: string, distrito: string, direccion: string): Pedido => {
  const items = generarItems(id);
  const peso_total_kg = items.reduce((acc, item) => acc + item.peso_total_kg, 0);
  const total_bultos = items.reduce((acc, item) => acc + item.cantidad, 0);
  const ahora = new Date().toISOString();
  
  return {
    id,
    numero_orden: orden,
    numero_guia_remision: '',
    cliente,
    direccion_entrega: direccion,
    distrito,
    zona: clasificarZona(distrito),
    items,
    total_bultos,
    peso_total_kg,
    requiere_conformidad: cliente.includes('Plaza Vea') || cliente.includes('Metro') || cliente.includes('Tottus'),
    estado: 'pendiente',
    eventos: [{
      id: `${id}-ev1`,
      timestamp: ahora,
      actor: 'Vicente',
      rol: 'despacho',
      accion: 'pedido_creado',
      detalle: 'Pedido inicializado desde seed'
    }],
    fecha_despacho: ahora.slice(0, 10),
    timestamp_creacion: ahora,
    timestamp_actualizacion: ahora
  };
};

export const PEDIDOS_SEED: Pedido[] = [
  // Lima Norte
  basePedido('p1', 'ORD-001', 'Plaza Vea - Los Olivos', 'Los Olivos', 'Av. Carlos Izaguirre 123'),
  basePedido('p2', 'ORD-002', 'Metro - Independencia', 'Independencia', 'Av. Alfredo Mendiola 456'),
  basePedido('p3', 'ORD-003', 'Sodimac - SMP', 'SMP', 'Av. Tomas Valle 789'),
  
  // Lima Sur
  basePedido('p4', 'ORD-004', 'Tottus - Chorrillos', 'Chorrillos', 'Av. Huaylas 101'),
  basePedido('p5', 'ORD-005', 'Wong - Surco', 'Santiago de Surco', 'Av. Benavides 202'),
  basePedido('p6', 'ORD-006', 'Promart - VES', 'VES', 'Av. Pachacutec 303'),

  // Lima Centro
  basePedido('p7', 'ORD-007', 'Plaza Vea - Miraflores', 'Miraflores', 'Av. Arequipa 404'),
  basePedido('p8', 'ORD-008', 'Metro - San Isidro', 'San Isidro', 'Av. Rivera Navarrete 505'),
  basePedido('p9', 'ORD-009', 'Tottus - Lince', 'Lince', 'Av. Petit Thouars 606'),

  // Lima Este
  basePedido('p10', 'ORD-010', 'Wong - Ate', 'Ate', 'Av. Carretera Central 707'),
  basePedido('p11', 'ORD-011', 'Plaza Vea - SJL', 'SJL', 'Av. Proceres de la Independencia 808'),
  basePedido('p12', 'ORD-012', 'Sodimac - Santa Anita', 'Santa Anita', 'Av. Nicolas Ayllon 909'),

  // Callao
  basePedido('p13', 'ORD-013', 'Maestro - Callao', 'Callao', 'Av. Saenz Peña 111'),
  basePedido('p14', 'ORD-014', 'Metro - Ventanilla', 'Ventanilla', 'Av. La Playa 222'),
  basePedido('p15', 'ORD-015', 'Tottus - Bellavista', 'Bellavista', 'Av. Colonial 333'),
];
