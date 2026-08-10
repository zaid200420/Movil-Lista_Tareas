import { Stack } from 'expo-router';

export default function SupervisorLayout() {
  return (
    <Stack screenOptions={{ 
      headerStyle: { backgroundColor: '#1E3A8A' },
      headerTintColor: '#FFF',
      headerTitleStyle: { fontWeight: 'bold' },
    }}>
      <Stack.Screen name="index" options={{ title: 'Dashboard Supervisor' }} />
      <Stack.Screen name="historial" options={{ title: 'Historial de Turnos' }} />
    </Stack>
  );
}
