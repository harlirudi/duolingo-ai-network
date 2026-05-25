import { useEffect } from "react";
import { View, Text } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { useAuthStore } from "@/src/shared/stores/useAuthStore";

export default function AppLayout() {
  const { user, loading, initialize } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] === "(app)";
    if (!user && inAuthGroup) {
      router.replace("/auth/login");
    } else if (user && !inAuthGroup) {
      router.replace("/(app)/(tabs)/dashboard");
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View className="flex-1 bg-bg items-center justify-center">
        <Text className="text-5xl mb-4">🦜</Text>
        <Text className="text-text-secondary text-sm">Memuat...</Text>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
