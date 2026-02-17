import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { ClerkProvider, ClerkLoaded, useAuth } from '@clerk/clerk-expo'
import { tokenCache } from '../lib/cache'
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
  )
}

function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [isGuest, setIsGuest] = useState(false);

  // Handle errors in font loading
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // Hide splash screen when fonts are loaded
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
    checkGuestStatus();
  }, [loaded]);

  const checkGuestStatus = async () => {
    try {
      const guest = await AsyncStorage.getItem('guest_mode');
      if (guest === 'true') {
        setIsGuest(true);
      }
    } catch (error) {
      console.error('Error checking guest status:', error);
    }
  };

  // Auth protection logic
  useEffect(() => {
    if (!isLoaded) return;

    // If user is a guest, do not enforce auth redirection for protected routes
    if (isGuest) return;

    const segment = segments[0] as string | undefined;

    console.log("Auth State:", { isSignedIn, segment, isLoaded });

    // Sync guest state with auth state
    if (isSignedIn && isGuest) {
      setIsGuest(false);
      AsyncStorage.removeItem('guest_mode').catch(console.error);
    }

    // Public routes: index, onboarding, oauth-native-callback
    const isPublicRoute = !segment || segment === 'index' || segment === 'onboarding' || segment === 'oauth-native-callback';

    // TEMPORARY: Enable strict redirect to ensure user is signed in
    if (isLoaded && !isSignedIn && !isPublicRoute) {
      console.log('Redirecting to login because user is not signed in and path is protected');
      router.replace('/');
    }
  }, [isSignedIn, segments, isLoaded, isGuest]);

  if (!loaded || !isLoaded) {
    return <View />; // Or a custom loading screen
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="service/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="address" options={{ headerShown: false }} />
        <Stack.Screen name="payments" options={{ headerShown: false }} />
        <Stack.Screen name="legal/[type]" options={{ headerShown: false }} />
        <Stack.Screen name="membership" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="admin" options={{ headerShown: false }} />
        <Stack.Screen name="oauth-native-callback" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <InitialLayout />
      </ClerkLoaded>
    </ClerkProvider>
  );
}
