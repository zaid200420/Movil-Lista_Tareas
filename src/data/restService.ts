export interface Collaborator {
  id: string;
  name: string;
  email: string;
}

export const fetchCategories = async (): Promise<string[]> => {
  return ['General', 'Urgente', 'Soporte', 'Mantenimiento'];
};

export const fetchCollaborators = async (): Promise<Collaborator[]> => {
  return [
    { id: '1', name: 'Fernando Rodríguez', email: 'fernando@idat.edu.pe' },
    { id: '2', name: 'Zaid Cárdenas', email: 'zaid@idat.edu.pe' },
    { id: '3', name: 'Gustavo Ávila', email: 'gustavo@idat.edu.pe' },
  ];
};