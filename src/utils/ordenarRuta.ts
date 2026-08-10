import { Pedido } from '../types';

export function ordenarRutaConductor(pedidos: Pedido[]): Pedido[] {
  return [...pedidos].sort((a, b) => {
    // Criterio 1: Agrupar por zona (ya vienen filtrados por conductor, pero por si acaso)
    if (a.zona !== b.zona) {
      return a.zona.localeCompare(b.zona);
    }

    // Criterio 2: Requiere conformidad primero
    if (a.requiere_conformidad !== b.requiere_conformidad) {
      return a.requiere_conformidad ? -1 : 1;
    }

    // Criterio 3: Ventana horaria más temprana
    if (a.ventana_horaria && b.ventana_horaria) {
      return a.ventana_horaria.inicio.localeCompare(b.ventana_horaria.inicio);
    }
    if (a.ventana_horaria) return -1;
    if (b.ventana_horaria) return 1;

    return 0;
  }).map((pedido, index) => ({
    ...pedido,
    orden_entrega: index + 1
  }));
}
