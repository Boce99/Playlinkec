
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  RefreshControl,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

interface DashboardStats {
  todayBookings: number;
  activeMembers: number;
  activeTournaments: number;
  revenue: number;
}

export default function ClubDashboardScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    todayBookings: 0,
    activeMembers: 0,
    activeTournaments: 0,
    revenue: 0,
  });

  const loadDashboardData = useCallback(async () => {
    try {
      console.log('Loading club dashboard data');
      // TODO: Backend Integration - GET /api/club/dashboard to fetch stats
      // Mock data for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStats({
        todayBookings: 12,
        activeMembers: 156,
        activeTournaments: 3,
        revenue: 2450,
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadDashboardData();
  }, [loadDashboardData]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors[colorScheme ?? 'light'].background }]}>
        <ActivityIndicator size="large" color={colors[colorScheme ?? 'light'].primary} />
      </View>
    );
  }

  const userName = user?.name || user?.email || 'Club Admin';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors[colorScheme ?? 'light'].background }]} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors[colorScheme ?? 'light'].primary}
          />
        }
      >
        <View style={[styles.header, Platform.OS === 'android' && { paddingTop: 48 }]}>
          <View>
            <Text style={[styles.greeting, { color: colors[colorScheme ?? 'light'].text }]}>
              Hola
            </Text>
            <Text style={[styles.userName, { color: colors[colorScheme ?? 'light'].text }]}>
              {userName}
            </Text>
          </View>
          <TouchableOpacity onPress={handleSignOut}>
            <IconSymbol
              ios_icon_name="rectangle.portrait.and.arrow.right"
              android_material_icon_name="logout"
              size={24}
              color={colors[colorScheme ?? 'light'].text}
            />
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: colors[colorScheme ?? 'light'].text }]}>
          Panel de Control
        </Text>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: isDark ? '#1E1E1E' : '#fff' }]}>
            <IconSymbol
              ios_icon_name="calendar"
              android_material_icon_name="calendar-today"
              size={32}
              color="#4CAF50"
            />
            <Text style={[styles.statValue, { color: colors[colorScheme ?? 'light'].text }]}>
              {stats.todayBookings}
            </Text>
            <Text style={[styles.statLabel, { color: colors[colorScheme ?? 'light'].textSecondary }]}>
              Reservas Hoy
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: isDark ? '#1E1E1E' : '#fff' }]}>
            <IconSymbol
              ios_icon_name="person.3"
              android_material_icon_name="group"
              size={32}
              color="#2196F3"
            />
            <Text style={[styles.statValue, { color: colors[colorScheme ?? 'light'].text }]}>
              {stats.activeMembers}
            </Text>
            <Text style={[styles.statLabel, { color: colors[colorScheme ?? 'light'].textSecondary }]}>
              Miembros Activos
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: isDark ? '#1E1E1E' : '#fff' }]}>
            <IconSymbol
              ios_icon_name="trophy"
              android_material_icon_name="emoji-events"
              size={32}
              color="#FF9800"
            />
            <Text style={[styles.statValue, { color: colors[colorScheme ?? 'light'].text }]}>
              {stats.activeTournaments}
            </Text>
            <Text style={[styles.statLabel, { color: colors[colorScheme ?? 'light'].textSecondary }]}>
              Torneos Activos
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: isDark ? '#1E1E1E' : '#fff' }]}>
            <IconSymbol
              ios_icon_name="dollarsign.circle"
              android_material_icon_name="attach-money"
              size={32}
              color="#9C27B0"
            />
            <Text style={[styles.statValue, { color: colors[colorScheme ?? 'light'].text }]}>
              ${stats.revenue}
            </Text>
            <Text style={[styles.statLabel, { color: colors[colorScheme ?? 'light'].textSecondary }]}>
              Ingresos Hoy
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors[colorScheme ?? 'light'].text }]}>
          Gestión
        </Text>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: isDark ? '#1E1E1E' : '#fff' }]}
          onPress={() => router.push('/(club)/courts')}
        >
          <View style={styles.menuItemLeft}>
            <IconSymbol
              ios_icon_name="square.grid.2x2"
              android_material_icon_name="grid-on"
              size={24}
              color="#4CAF50"
            />
            <Text style={[styles.menuItemText, { color: colors[colorScheme ?? 'light'].text }]}>
              Canchas
            </Text>
          </View>
          <IconSymbol
            ios_icon_name="chevron.right"
            android_material_icon_name="chevron-right"
            size={20}
            color={colors[colorScheme ?? 'light'].textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: isDark ? '#1E1E1E' : '#fff' }]}
          onPress={() => router.push('/(club)/bookings')}
        >
          <View style={styles.menuItemLeft}>
            <IconSymbol
              ios_icon_name="calendar.badge.clock"
              android_material_icon_name="event"
              size={24}
              color="#2196F3"
            />
            <Text style={[styles.menuItemText, { color: colors[colorScheme ?? 'light'].text }]}>
              Reservas
            </Text>
          </View>
          <IconSymbol
            ios_icon_name="chevron.right"
            android_material_icon_name="chevron-right"
            size={20}
            color={colors[colorScheme ?? 'light'].textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: isDark ? '#1E1E1E' : '#fff' }]}
          onPress={() => router.push('/(club)/tournaments')}
        >
          <View style={styles.menuItemLeft}>
            <IconSymbol
              ios_icon_name="trophy.fill"
              android_material_icon_name="emoji-events"
              size={24}
              color="#FF9800"
            />
            <Text style={[styles.menuItemText, { color: colors[colorScheme ?? 'light'].text }]}>
              Torneos
            </Text>
          </View>
          <IconSymbol
            ios_icon_name="chevron.right"
            android_material_icon_name="chevron-right"
            size={20}
            color={colors[colorScheme ?? 'light'].textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: isDark ? '#1E1E1E' : '#fff' }]}
          onPress={() => router.push('/(club)/players')}
        >
          <View style={styles.menuItemLeft}>
            <IconSymbol
              ios_icon_name="person.2"
              android_material_icon_name="people"
              size={24}
              color="#9C27B0"
            />
            <Text style={[styles.menuItemText, { color: colors[colorScheme ?? 'light'].text }]}>
              Jugadores
            </Text>
          </View>
          <IconSymbol
            ios_icon_name="chevron.right"
            android_material_icon_name="chevron-right"
            size={20}
            color={colors[colorScheme ?? 'light'].textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: isDark ? '#1E1E1E' : '#fff' }]}
          onPress={() => router.push('/(club)/staff')}
        >
          <View style={styles.menuItemLeft}>
            <IconSymbol
              ios_icon_name="person.badge.key"
              android_material_icon_name="badge"
              size={24}
              color="#F44336"
            />
            <Text style={[styles.menuItemText, { color: colors[colorScheme ?? 'light'].text }]}>
              Staff
            </Text>
          </View>
          <IconSymbol
            ios_icon_name="chevron.right"
            android_material_icon_name="chevron-right"
            size={20}
            color={colors[colorScheme ?? 'light'].textSecondary}
          />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
