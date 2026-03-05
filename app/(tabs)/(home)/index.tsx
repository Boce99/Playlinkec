
import { Stack, useRouter } from "expo-router";
import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import { useAuth } from "@/contexts/AuthContext";

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
}

export default function HomeScreen() {
  const { colors: themeColors } = useTheme();
  const colorScheme = useColorScheme();
  const appColors = colorScheme === 'dark' ? colors.dark : colors.light;
  const router = useRouter();
  const { user } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    console.log('HomeScreen mounted, user:', user?.name || user?.email);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      console.log('Loading bookings and clubs data');
      // TODO: Backend Integration - GET /api/bookings to fetch user's bookings
      // TODO: Backend Integration - GET /api/clubs to fetch available clubs
      
      // Mock data for now
      setBookings([]);
      setClubs([]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    console.log('User pulled to refresh');
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={appColors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const upcomingBookings = bookings.filter(b => b.status === 'confirmed');
  const hasUpcomingBookings = upcomingBookings.length > 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={appColors.primary} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: appColors.textSecondary }]}>
              Hola
            </Text>
            <Text style={[styles.userName, { color: themeColors.text }]}>
              {user?.name || 'Jugador'}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: appColors.card }]}
            onPress={() => console.log('Notifications tapped')}
          >
            <IconSymbol
              ios_icon_name="bell"
              android_material_icon_name="notifications"
              size={24}
              color={themeColors.text}
            />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Acciones Rápidas
          </Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: appColors.primary }]}
              onPress={() => console.log('User tapped Nueva Reserva')}
            >
              <IconSymbol
                ios_icon_name="plus.circle"
                android_material_icon_name="add-circle"
                size={32}
                color="#FFFFFF"
              />
              <Text style={styles.actionCardTitle}>
                Nueva Reserva
              </Text>
              <Text style={styles.actionCardSubtitle}>
                Reserva una cancha
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: appColors.secondary }]}
              onPress={() => console.log('User tapped Mis Clubes')}
            >
              <IconSymbol
                ios_icon_name="building.2"
                android_material_icon_name="store"
                size={32}
                color="#FFFFFF"
              />
              <Text style={styles.actionCardTitle}>
                Mis Clubes
              </Text>
              <Text style={styles.actionCardSubtitle}>
                Ver clubes
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Upcoming Bookings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Próximas Reservas
            </Text>
            {hasUpcomingBookings && (
              <TouchableOpacity onPress={() => console.log('Ver todas tapped')}>
                <Text style={[styles.seeAllText, { color: appColors.primary }]}>
                  Ver todas
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {!hasUpcomingBookings ? (
            <View style={[styles.emptyCard, { backgroundColor: appColors.card }]}>
              <IconSymbol
                ios_icon_name="calendar"
                android_material_icon_name="calendar-today"
                size={48}
                color={appColors.textSecondary}
              />
              <Text style={[styles.emptyTitle, { color: themeColors.text }]}>
                No tienes reservas
              </Text>
              <Text style={[styles.emptySubtitle, { color: appColors.textSecondary }]}>
                Crea tu primera reserva para empezar a jugar
              </Text>
            </View>
          ) : (
            <View>
              {upcomingBookings.map((booking, index) => {
                const dateText = booking.bookingDate;
                const timeText = `${booking.startTime} - ${booking.endTime}`;
                
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.bookingCard, { backgroundColor: appColors.card }]}
                    onPress={() => console.log('Booking tapped:', booking.id)}
                  >
                    <View style={styles.bookingHeader}>
                      <View style={[styles.statusBadge, { backgroundColor: appColors.success }]}>
                        <Text style={styles.statusText}>
                          Confirmada
                        </Text>
                      </View>
                      <IconSymbol
                        ios_icon_name="qrcode"
                        android_material_icon_name="qr-code"
                        size={24}
                        color={appColors.primary}
                      />
                    </View>
                    
                    <Text style={[styles.bookingClub, { color: themeColors.text }]}>
                      {booking.clubName}
                    </Text>
                    <Text style={[styles.bookingCourt, { color: appColors.textSecondary }]}>
                      {booking.courtName}
                    </Text>
                    
                    <View style={styles.bookingDetails}>
                      <View style={styles.bookingDetailItem}>
                        <IconSymbol
                          ios_icon_name="calendar"
                          android_material_icon_name="calendar-today"
                          size={16}
                          color={appColors.textSecondary}
                        />
                        <Text style={[styles.bookingDetailText, { color: appColors.textSecondary }]}>
                          {dateText}
                        </Text>
                      </View>
                      <View style={styles.bookingDetailItem}>
                        <IconSymbol
                          ios_icon_name="clock"
                          android_material_icon_name="access-time"
                          size={16}
                          color={appColors.textSecondary}
                        />
                        <Text style={[styles.bookingDetailText, { color: appColors.textSecondary }]}>
                          {timeText}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* Available Clubs */}
        {clubs.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Clubes Disponibles
            </Text>
            {clubs.map((club, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.clubCard, { backgroundColor: appColors.card }]}
                onPress={() => console.log('Club tapped:', club.id)}
              >
                <View style={[styles.clubIcon, { backgroundColor: appColors.highlight }]}>
                  <IconSymbol
                    ios_icon_name="building.2"
                    android_material_icon_name="store"
                    size={24}
                    color={appColors.primary}
                  />
                </View>
                <View style={styles.clubInfo}>
                  <Text style={[styles.clubName, { color: themeColors.text }]}>
                    {club.name}
                  </Text>
                  <Text style={[styles.clubAddress, { color: appColors.textSecondary }]}>
                    {club.address}
                  </Text>
                </View>
                <IconSymbol
                  ios_icon_name="chevron.right"
                  android_material_icon_name="chevron-right"
                  size={24}
                  color={appColors.textSecondary}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 14,
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
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
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
  },
  actionCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 12,
    textAlign: 'center',
  },
  actionCardSubtitle: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 4,
    textAlign: 'center',
  },
  emptyCard: {
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  bookingCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
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
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
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
  bookingDetailItem: {
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
  },
  clubIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  clubInfo: {
    flex: 1,
  },
  clubName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  clubAddress: {
    fontSize: 14,
  },
});
