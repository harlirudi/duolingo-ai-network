import { View, Text } from "react-native";

export default function Profile() {
  return (
    <View className="flex-1 bg-bg justify-center items-center px-6">
      <Text className="text-text-primary text-xl font-heading mb-2">
        👤 Profil
      </Text>
      <Text className="text-text-secondary text-base text-center">
        XP, streak, affiliate links, earning stats.
      </Text>
    </View>
  );
}
