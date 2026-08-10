import { Stack } from 'expo-router';

export default function DespachoLayout() {
  return (
    <Stack screenOptions={{ 
      headerStyle: { backgroundColor: '#1E3A8A' },
      headerTintColor: '#FFF',
      headerTitleStyle: { fontWeight: 'bold' },
    }}>
      <Stack.Screen name="index" options={{ title: 'Bandeja de Pedidos' }} />
      <Stack.Screen name="cargar-pedido" options={{ title: 'Nuevo Pedido' }} />
      <Stack.Screen name="asignar-rutas" options={{ title: 'Asignación de Rutas' }} />
      <Stack.Screen name="etiquetas" options={{ title: 'Etiquetas Digitales' }} />
      <Stack.Screen name="etiqueta/[id]" options={{ title: 'Detalle Etiqueta' }} />
      <Stack.Screen name="guia/[id]" options={{ title: 'Guía de Remisión' }} />
    </Stack>
  );
}
