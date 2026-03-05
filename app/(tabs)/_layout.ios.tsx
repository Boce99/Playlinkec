
import React from 'react';
import FloatingTabBar from '@/components/FloatingTabBar';
import { Href } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === 'dark' ? colors.dark : colors.light;

  const tabs = [
    {
      name: 'Reservas',
      route: '/(tabs)/(home)' as Href,
      ios_icon_name: 'calendar',
      android_material_icon_name: 'calendar-today' as const,
    },
    {
      name: 'Perfil',
      route: '/(tabs)/profile' as Href,
      ios_icon_name: 'person.circle',
      android_material_icon_name: 'person' as const,
    },
  ];

  return <FloatingTabBar tabs={tabs} />;
}
