
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
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';

interface Booking {
  id: string;
  clubName: string;
  courtName: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: string;
  qrCode: string;
}

interface Club {
  id: string;
  name: string;
  address: string;
  city: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [myClubs, setMyClubs] = useState<Club[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const loadData = useCallback(async () => {
    console.log('HomeScreen: Loading data for user', user?.email);
    try {
      // TODO: Backend Integration - GET /api/bookings to fetch upcoming bookings
      // TODO: Backend Integration - GET /api/clubs/my-clubs to fetch user's clubs
      // TODO: Backend Integration - GET /api/notifications to fetch notifications
      
      // Mock data for now
      setUpcomingBookings([
        {
          id: '1',
          clubName: 'Club Padel Central',
          courtName: 'Cancha 1',
          bookingDate: '2024-01-20',
          startTime: '18:00',
          endTime: '19:30',
          status: 'confirmed',
          qrCode: 'QR123456',
        },
      ]);
      
      setMyClubs([
        {
          id: '1',
          name: 'Club Padel Central',
          address: 'Av. Principal 123',
          city: 'Quito',
        },
      ]);
      
      setNotifications([
        {
          id: '1',
          title: 'Reserva confirmada',
          message: 'Tu reserva para mañana a las 18:00 está confirmada',
          type: 'booking_created',
          read: false,
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error('HomeScreen: Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    console.log('HomeScreen: Refreshing data');
    setRefreshing(true);
    loadData();
  }, [loadData]);

  const userName = user?.name || 'Jugador';
  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.textSecondary }]}>Hola,</Text>
            <Text style={[styles.userName, { color: theme.text }]}>{userName}</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => router.push('/notifications')}
          >
            <IconSymbol
              ios_icon_name="bell.fill"
              android_material_icon_name="notifications"
              size={24}
              color={theme.text}
            />
            {unreadCount > 0 && (
              <View style={[styles.badge, { backgroundColor: theme.error }]}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Acciones Rápidas</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: theme.card }]}
              onPress={() => router.push('/booking/new')}
            >
              <View style={[styles.actionIcon, { backgroundColor: theme.primary + '20' }]}>
                <IconSymbol
                  ios_icon_name="calendar.badge.plus"
                  android_material_icon_name="add-circle"
                  size={28}
                  color={theme.primary}
                />
              </View>
              <Text style={[styles.actionText, { color: theme.text }]}>Nueva Reserva</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: theme.card }]}
              onPress={() => router.push('/clubs')}
            >
              <View style={[styles.actionIcon, { backgroundColor: theme.secondary + '20' }]}>
                <IconSymbol
                  ios_icon_name="building.2.fill"
                  android_material_icon_name="business"
                  size={28}
                  color={theme.secondary}
                />
              </View>
              <Text style={[styles.actionText, { color: theme.text }]}>Mis Clubes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: theme.card }]}
              onPress={() => router.push('/(tabs)/tournaments')}
            >
              <View style={[styles.actionIcon, { backgroundColor: theme.accent + '20' }]}>
                <IconSymbol
                  ios_icon_name="trophy.fill"
                  android_material_icon_name="emoji-events"
                  size={28}
                  color={theme.accent}
                />
              </View>
              <Text style={[styles.actionText, { color: theme.text }]}>Torneos</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Upcoming Bookings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Próximas Reservas</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/bookings')}>
              <Text style={[styles.seeAll, { color: theme.primary }]}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          
          {upcomingBookings.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: theme.card }]}>
              <IconSymbol
                ios_icon_name="calendar"
                android_material_icon_name="calendar-today"
                size={48}
                color={theme.textSecondary}
              />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No tienes reservas próximas
              </Text>
              <TouchableOpacity
                style={[styles.emptyButton, { backgroundColor: theme.primary }]}
                onPress={() => router.push('/booking/new')}
              >
                <Text style={styles.emptyButtonText}>Hacer una reserva</Text>
              </TouchableOpacity>
            </View>
          ) : (
            upcomingBookings.map((booking) => {
              const dateText = booking.bookingDate;
              const timeText = `${booking.startTime} - ${booking.endTime}`;
              
              return (
                <TouchableOpacity
                  key={booking.id}
                  style={[styles.bookingCard, { backgroundColor: theme.card }]}
                  onPress={() => router.push(`/booking/${booking.id}`)}
                >
                  <View style={styles.bookingHeader}>
                    <View style={[styles.statusBadge, { backgroundColor: theme.success + '20' }]}>
                      <Text style={[styles.statusText, { color: theme.success }]}>Confirmada</Text>
                    </View>
                    <IconSymbol
                      ios_icon_name="qrcode"
                      android_material_icon_name="qr-code"
                      size={24}
                      color={theme.primary}
                    />
                  </View>
                  <Text style={[styles.bookingClub, { color: theme.text }]}>{booking.clubName}</Text>
                  <Text style={[styles.bookingCourt, { color: theme.textSecondary }]}>
                    {booking.courtName}
                  </Text>
                  <View style={styles.bookingDetails}>
                    <View style={styles.bookingDetail}>
                      <IconSymbol
                        ios_icon_name="calendar"
                        android_material_icon_name="calendar-today"
                        size={16}
                        color={theme.textSecondary}
                      />
                      <Text style={[styles.bookingDetailText, { color: theme.textSecondary }]}>
                        {dateText}
                      </Text>
                    </View>
                    <View style={styles.bookingDetail}>
                      <IconSymbol
                        ios_icon_name="clock"
                        android_material_icon_name="access-time"
                        size={16}
                        color={theme.textSecondary}
                      />
                      <Text style={[styles.bookingDetailText, { color: theme.textSecondary }]}>
                        {timeText}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* My Clubs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Mis Clubes</Text>
            <TouchableOpacity onPress={() => router.push('/clubs')}>
              <Text style={[styles.seeAll, { color: theme.primary }]}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          
          {myClubs.map((club) => (
            <TouchableOpacity
              key={club.id}
              style={[styles.clubCard, { backgroundColor: theme.card }]}
              onPress={() => router.push(`/club/${club.id}`)}
            >
              <View style={[styles.clubIcon, { backgroundColor: theme.primary + '20' }]}>
                <IconSymbol
                  ios_icon_name="building.2.fill"
                  android_material_icon_name="business"
                  size={24}
                  color={theme.primary}
                />
              </View>
              <View style={styles.clubInfo}>
                <Text style={[styles.clubName, { color: theme.text }]}>{club.name}</Text>
                <Text style={[styles.clubAddress, { color: theme.textSecondary }]}>
                  {club.address}
                </Text>
                <Text style={[styles.clubCity, { color: theme.textSecondary }]}>{club.city}</Text>
              </View>
              <IconSymbol
                ios_icon_name="chevron.right"
                android_material_icon_name="chevron-right"
                size={20}
                color={theme.textSecondary}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 16,
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  notificationButton: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyCard: {
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  bookingCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bookingClub: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bookingCourt: {
    fontSize: 14,
    marginBottom: 12,
  },
  bookingDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  bookingDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bookingDetailText: {
    fontSize: 14,
  },
  clubCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  clubIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  clubInfo: {
    flex: 1,
  },
  clubName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  clubAddress: {
    fontSize: 13,
    marginBottom: 2,
  },
  clubCity: {
    fontSize: 13,
  },
});
