
import { StyleSheet } from 'react-native';

// PlayLink Ec - Padel Club Theme
// Sporty, energetic colors inspired by padel courts
export const colors = {
  // Light theme
  light: {
    background: '#F8FAFB',
    card: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#6B7280',
    primary: '#10B981', // Vibrant green (padel court color)
    secondary: '#3B82F6', // Bright blue
    accent: '#F59E0B', // Orange accent
    highlight: '#ECFDF5', // Light green highlight
    border: '#E5E7EB',
    error: '#EF4444',
    success: '#10B981',
  },
  // Dark theme
  dark: {
    background: '#0F172A',
    card: '#1E293B',
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    primary: '#10B981',
    secondary: '#3B82F6',
    accent: '#F59E0B',
    highlight: '#064E3B',
    border: '#334155',
    error: '#EF4444',
    success: '#10B981',
  },
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
  },
});
