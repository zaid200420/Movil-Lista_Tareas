import { Camion } from '../types';

export interface ValidacionAsignacion {
  valido: boolean;
  advertencia?: string;
  bloquea: boolean;
}

export function validarAsignacion(
  pesoTotal: number,
  bultosTotal: number,
  camion: Camion
): ValidacionAsignacion {
  const porcentajePeso = (pesoTotal / camion.capacidad_maxima_kg) * 100;
  const porcentajeBultos = (bultosTotal / camion.capacidad_maxima_bultos) * 100;

  const maxPorcentaje = Math.max(porcentajePeso, porcentajeBultos);

  if (maxPorcentaje > 100) {
    return {
      valido: false,
      bloquea: true,
      advertencia: `Capacidad excedida (${maxPorcentaje.toFixed(1)}%)`,
    };
  }

  if (maxPorcentaje > 90) {
    return {
      valido: true,
      bloquea: false,
      advertencia: `Carga próxima al límite (${maxPorcentaje.toFixed(1)}%)`,
    };
  }

  return { valido: true, bloquea: false };
}
