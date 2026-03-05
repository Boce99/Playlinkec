
import { Stack } from 'expo-router';
import React from 'react';

export default function ClubLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="courts" options={{ title: 'Gestión de Canchas' }} />
      <Stack.Screen name="bookings" options={{ title: 'Reservas' }} />
      <Stack.Screen name="tournaments" options={{ title: 'Torneos' }} />
      <Stack.Screen name="players" options={{ title: 'Jugadores' }} />
      <Stack.Screen name="staff" options={{ title: 'Staff' }} />
    </Stack>
  );
}
