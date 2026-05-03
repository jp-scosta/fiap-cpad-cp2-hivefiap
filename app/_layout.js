import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#1E1E1E' },
        headerTintColor: '#ED145B',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
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
        name="sala-detalhe" 
        options={{ title: 'Detalhes da Sala' }} 
      />
    </Stack>
  );
}