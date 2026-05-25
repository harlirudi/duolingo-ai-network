import { Stack } from "expo-router";

// TODO: Add auth guard — redirect to /onboarding if no session
export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
