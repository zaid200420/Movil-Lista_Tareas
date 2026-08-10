export interface Collaborator {
  id: string;
  name: string;
  email: string;
}

export async function fetchCollaborators(): Promise<Collaborator[]> {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    if (!response.ok) {
      throw new Error('Error al obtener colaboradores');
    }

    const users = await response.json();
    return users.map((user: any) => ({
      id: String(user.id),
      name: user.name,
      email: user.email,
    }));
  } catch (error) {
    console.error('fetchCollaborators error:', error);
    return [
      { id: '1', name: 'Carlos Pérez', email: 'carlos@empresa.com' },
      { id: '2', name: 'María Gómez', email: 'maria@empresa.com' },
    ];
  }
}

export async function fetchCategories(): Promise<string[]> {
  try {
    const response = await fetch('https://fakestoreapi.com/products/categories');
    if (!response.ok) {
      throw new Error('Error al obtener categorías');
    }

    const categories = await response.json();
    return Array.isArray(categories) ? categories.slice(0, 5) : ['General', 'Soporte', 'Urgente'];
  } catch (error) {
    console.error('fetchCategories error:', error);
    return ['General', 'Soporte', 'Urgente'];
  }
}
