import { Stack } from 'expo-router';

export default function ConductorLayout() {
  return (
    <Stack screenOptions={{ 
      headerStyle: { backgroundColor: '#1E3A8A' },
      headerTintColor: '#FFF',
      headerTitleStyle: { fontWeight: 'bold' },
      headerShown: false
    }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="ruta" options={{ headerShown: true, title: 'Mi Ruta' }} />
      <Stack.Screen name="entrega/[id]" options={{ headerShown: true, title: 'Detalle de Entrega' }} />
    </Stack>
  );
}
