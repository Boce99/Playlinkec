
import "react-native-reanimated";
import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { WidgetProvider } from "@/contexts/WidgetContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import * as SplashScreen from "expo-splash-screen";
import { useNetworkState } from "expo-network";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme, Alert } from "react-native";
import { useFonts } from "expo-font";
import { SystemBars } from "react-native-edge-to-edge";
import { colors } from "@/styles/commonStyles";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Custom theme with PlayLink colors
const PlayLinkLightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.light.primary,
    background: colors.light.background,
    card: colors.light.card,
    text: colors.light.text,
    border: colors.light.border,
  },
};

const PlayLinkDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.dark.primary,
    background: colors.dark.background,
    card: colors.dark.card,
    text: colors.dark.text,
    border: colors.dark.border,
  },
};

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'auth' || segments[0] === 'auth-popup' || segments[0] === 'auth-callback';

    console.log('Auth state changed - User:', user ? 'logged in' : 'not logged in', 'Segments:', segments);

    if (!user && !inAuthGroup) {
      // User is not signed in and not on auth screen, redirect to auth
      console.log('Redirecting to auth screen');
      router.replace('/auth');
    } else if (user && inAuthGroup) {
      // User is signed in but on auth screen, redirect to home
      console.log('Redirecting to home screen');
      router.replace('/(tabs)/(home)');
    }
  }, [user, loading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="auth-popup" options={{ presentation: "modal" }} />
      <Stack.Screen name="auth-callback" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const { isConnected } = useNetworkState();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (isConnected === false) {
      Alert.alert(
        "No Internet Connection",
        "Please check your internet connection and try again."
      );
    }
  }, [isConnected]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? PlayLinkDarkTheme : PlayLinkLightTheme}>
        <AuthProvider>
          <WidgetProvider>
            <SystemBars style={colorScheme === "dark" ? "light" : "dark"} />
            <RootLayoutNav />
            <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
          </WidgetProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
