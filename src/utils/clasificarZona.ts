import { ZonaLima } from '../types';

export const DISTRITOS_ZONAS: Record<string, ZonaLima> = {
  // Lima Norte
  'independencia': 'Lima Norte',
  'los olivos': 'Lima Norte',
  'san martin de porres': 'Lima Norte',
  'smp': 'Lima Norte',
  'comas': 'Lima Norte',
  'carabayllo': 'Lima Norte',
  'puente piedra': 'Lima Norte',
  'ancon': 'Lima Norte',
  'rimac': 'Lima Norte',

  // Lima Sur
  'villa el salvador': 'Lima Sur',
  'ves': 'Lima Sur',
  'villa maria del triunfo': 'Lima Sur',
  'vmt': 'Lima Sur',
  'san juan de miraflores': 'Lima Sur',
  'sjm': 'Lima Sur',
  'chorrillos': 'Lima Sur',
  'barranco': 'Lima Sur',
  'santiago de surco': 'Lima Sur',
  'surco': 'Lima Sur',
  'lurin': 'Lima Sur',
  'pachacamac': 'Lima Sur',

  // Lima Centro
  'cercado de lima': 'Lima Centro',
  'lima': 'Lima Centro',
  'brena': 'Lima Centro',
  'la victoria': 'Lima Centro',
  'lince': 'Lima Centro',
  'jesus maria': 'Lima Centro',
  'magdalena del mar': 'Lima Centro',
  'pueblo libre': 'Lima Centro',
  'miraflores': 'Lima Centro',
  'san isidro': 'Lima Centro',
  'surquillo': 'Lima Centro',
  'san borja': 'Lima Centro',
  'san luis': 'Lima Centro',
  'la molina': 'Lima Centro',

  // Lima Este
  'san juan de lurigancho': 'Lima Este',
  'sjl': 'Lima Este',
  'ate': 'Lima Este',
  'santa anita': 'Lima Este',
  'el agustino': 'Lima Este',
  'lurigancho': 'Lima Este',
  'chosica': 'Lima Este',
  'chaclacayo': 'Lima Este',
  'cieneguilla': 'Lima Este',

  // Lima Oeste
  'san miguel': 'Lima Oeste',
  'magdalena': 'Lima Oeste',

  // Callao
  'callao': 'Callao',
  'bellavista': 'Callao',
  'carmen de la legua': 'Callao',
  'la perla': 'Callao',
  'la punta': 'Callao',
  'mi peru': 'Callao',
  'ventanilla': 'Callao',
};

export function clasificarZona(distrito: string): ZonaLima {
  if (!distrito) return 'Sin clasificar';

  const normalizado = distrito
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  return DISTRITOS_ZONAS[normalizado] || 'Sin clasificar';
}

// Tests de consola para casos borde
console.assert(clasificarZona('ves') === 'Lima Sur', 'Error: ves debería ser Lima Sur');
console.assert(clasificarZona('SJL') === 'Lima Este', 'Error: SJL debería ser Lima Este');
console.assert(clasificarZona('San Martín de Porres') === 'Lima Norte', 'Error: San Martín de Porres debería ser Lima Norte');
console.assert(clasificarZona('Callao') === 'Callao', 'Error: Callao debería ser Callao');
console.assert(clasificarZona('Desconocido') === 'Sin clasificar', 'Error: Desconocido debería ser Sin clasificar');
