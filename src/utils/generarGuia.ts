import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  CORRELATIVO_GUIA: '@interandina/correlativo_guia',
  ULTIMA_FECHA_GUIA: '@interandina/ultima_fecha_guia',
};

export async function generarNumeroGuia(correlativo: number): Promise<string> {
  const hoy = new Date();
  const fechaStr = hoy.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
  
  // El correlativo ya viene manejado desde el contexto, pero aseguramos el formato
  const nnn = correlativo.toString().padStart(3, '0');
  
  return `GR-${fechaStr}-${nnn}`;
}
