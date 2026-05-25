import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import {
  useOnboarding,
  archetypeDescriptions,
} from "@/src/features/onboarding/onboarding.store";

export default function ArchetypeScreen() {
  const router = useRouter();
  const { archetype, confidence } = useOnboarding();

  if (!archetype) return null;
  const desc = archetypeDescriptions[archetype];

  return (
    <View className="flex-1 bg-bg justify-center items-center px-8">
      {/* Celebration */}
      <Text className="text-4xl mb-4">🎉</Text>

      {/* KreaTori message */}
      <View className="bg-primary-light rounded-lg px-6 py-4 mb-6 max-w-sm">
        <Text className="text-text-primary text-sm mb-1 font-heading">
          🦜 KreaTori
        </Text>
        <Text className="text-text-primary text-base leading-6">
          "Aku udah kenal kamu! Kamu tipe yang spesial..."
        </Text>
      </View>

      {/* Archetype Card */}
      <View
        className="bg-bg rounded-lg p-6 shadow-md border-l-4 mb-8"
        style={{ borderLeftColor: desc.color }}
      >
        <Text className="text-text-primary text-2xl font-heading mb-1">
          {desc.emoji} {desc.title}
        </Text>
        <View
          className="bg-bg-secondary self-start px-2 py-1 rounded-full mb-3"
        >
          <Text className="text-text-secondary text-xs">
            Confidence: {Math.round((confidence ?? 0) * 100)}%
          </Text>
        </View>
        <Text className="text-text-primary text-base leading-6">
          {desc.description}
        </Text>
      </View>

      {/* CTA */}
      <View
        className="w-full bg-primary rounded-md py-4 items-center"
        onTouchEnd={() => router.replace("/(app)/(tabs)/dashboard")}
      >
        <Text className="text-text-inverse text-base font-heading">
          ⚡ Mulai Misi Pertamamu!
        </Text>
      </View>

      <Text className="text-text-secondary text-xs mt-4">
        (Bisa kamu ubah nanti di Profil)
      </Text>
    </View>
  );
}
