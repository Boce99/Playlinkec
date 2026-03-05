
import { useTheme } from "@react-navigation/native";
import { IconSymbol } from "@/components/IconSymbol";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/styles/commonStyles";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const { colors: themeColors } = useTheme();
  const colorScheme = useColorScheme();
  const appColors = colorScheme === 'dark' ? colors.dark : colors.light;
  const { user, signOut, loading } = useAuth();
  const router = useRouter();
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    console.log('User confirmed sign out');
    setSigningOut(true);
    try {
      await signOut();
      console.log('Sign out successful, redirecting to auth');
      setShowSignOutModal(false);
      router.replace('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setSigningOut(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={appColors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const userInitials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: themeColors.text }]}>
            Perfil
          </Text>
        </View>

        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: appColors.card }]}>
          <View style={[styles.avatar, { backgroundColor: appColors.primary }]}>
            <Text style={styles.avatarText}>
              {userInitials}
            </Text>
          </View>
          <Text style={[styles.userName, { color: themeColors.text }]}>
            {user?.name || 'Usuario'}
          </Text>
          <Text style={[styles.userEmail, { color: appColors.textSecondary }]}>
            {user?.email || ''}
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: appColors.card }]}>
            <Text style={[styles.statValue, { color: themeColors.text }]}>
              0
            </Text>
            <Text style={[styles.statLabel, { color: appColors.textSecondary }]}>
              Reservas
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: appColors.card }]}>
            <Text style={[styles.statValue, { color: themeColors.text }]}>
              0
            </Text>
            <Text style={[styles.statLabel, { color: appColors.textSecondary }]}>
              Clubes
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: appColors.card }]}>
            <Text style={[styles.statValue, { color: themeColors.text }]}>
              0
            </Text>
            <Text style={[styles.statLabel, { color: appColors.textSecondary }]}>
              Partidos
            </Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: appColors.card }]}
            onPress={() => console.log('Mis Clubes tapped')}
          >
            <View style={styles.menuItemLeft}>
              <IconSymbol
                ios_icon_name="building.2"
                android_material_icon_name="store"
                size={24}
                color={appColors.primary}
              />
              <Text style={[styles.menuItemText, { color: themeColors.text }]}>
                Mis Clubes
              </Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={24}
              color={appColors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: appColors.card }]}
            onPress={() => console.log('Historial de Reservas tapped')}
          >
            <View style={styles.menuItemLeft}>
              <IconSymbol
                ios_icon_name="clock"
                android_material_icon_name="history"
                size={24}
                color={appColors.primary}
              />
              <Text style={[styles.menuItemText, { color: themeColors.text }]}>
                Historial de Reservas
              </Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={24}
              color={appColors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: appColors.card }]}
            onPress={() => console.log('Configuración tapped')}
          >
            <View style={styles.menuItemLeft}>
              <IconSymbol
                ios_icon_name="gear"
                android_material_icon_name="settings"
                size={24}
                color={appColors.primary}
              />
              <Text style={[styles.menuItemText, { color: themeColors.text }]}>
                Configuración
              </Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={24}
              color={appColors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={[styles.signOutButton, { backgroundColor: appColors.card }]}
          onPress={() => {
            console.log('User tapped sign out button');
            setShowSignOutModal(true);
          }}
        >
          <IconSymbol
            ios_icon_name="arrow.right.square"
            android_material_icon_name="logout"
            size={24}
            color={appColors.error}
          />
          <Text style={[styles.signOutText, { color: appColors.error }]}>
            Cerrar Sesión
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Sign Out Confirmation Modal */}
      <Modal
        visible={showSignOutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSignOutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: appColors.card }]}>
            <Text style={[styles.modalTitle, { color: themeColors.text }]}>
              Cerrar Sesión
            </Text>
            <Text style={[styles.modalMessage, { color: appColors.textSecondary }]}>
              ¿Estás seguro que deseas cerrar sesión?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: appColors.background }]}
                onPress={() => {
                  console.log('User cancelled sign out');
                  setShowSignOutModal(false);
                }}
                disabled={signingOut}
              >
                <Text style={[styles.modalButtonText, { color: themeColors.text }]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: appColors.error }]}
                onPress={handleSignOut}
                disabled={signingOut}
              >
                {signingOut ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>
                    Cerrar Sesión
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  profileCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  menuSection: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    padding: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  signOutButton: {
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
