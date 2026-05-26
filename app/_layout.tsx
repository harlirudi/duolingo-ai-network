import { useEffect } from "react";
import { View, Text } from "react-native";
import { Stack, SplashScreen } from "expo-router";
import { useAuthStore } from "@/src/shared/stores/useAuthStore";
import {
  useFonts,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from "@expo-google-fonts/nunito";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";

export default function RootLayout() {
  const initialize = useAuthStore((s) => s.initialize);
  const [loaded] = useFonts({
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  useEffect(() => {
    initialize();
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="(app)" />
      <Stack.Screen name="onboarding/chat" options={{ gestureEnabled: false }} />
      <Stack.Screen name="onboarding/archetype" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
