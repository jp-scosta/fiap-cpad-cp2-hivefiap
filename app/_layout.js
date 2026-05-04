import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';

export default function Layout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#080a0b' },
          headerTintColor: '#ED145B',
          headerTitleStyle: { fontWeight: 'bold', letterSpacing: 0 },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: '#050606' },
        }}
      >
        <Stack.Screen
          name="login"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="(auth)/cadastro"
          options={{ title: 'Criar conta' }}
        />

        <Stack.Screen
          name="index"
          options={{ title: 'Espaços FIAP' }}
        />

        <Stack.Screen
          name="salas-default"
          options={{ title: 'Reserva de Sala' }}
        />

        <Stack.Screen
          name="lab-maker"
          options={{ title: 'Estoque Maker Lab' }}
        />

        <Stack.Screen
          name="minhas-reservas"
          options={{ title: 'Minhas Reservas' }}
        />
      </Stack>
    </AuthProvider>
  );
}
