import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Learn() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-bg">
      <View className="bg-primary px-6 pt-12 pb-6">
        <Text className="text-text-inverse text-xl font-heading mb-1">
          📚 Belajar
        </Text>
        <Text className="text-text-inverse text-sm opacity-80">
          Upgrade skill, upgrade cuan
        </Text>
      </View>

      <View className="px-6 mt-6 gap-4">
        <TouchableOpacity
          className="bg-bg rounded-lg p-4 shadow-sm flex-row items-center"
          onPress={() => router.push("/learn")}
        >
          <View className="w-12 h-12 rounded-full bg-primary-light items-center justify-center mr-4">
            <Text className="text-2xl">📖</Text>
          </View>
          <View className="flex-1">
            <Text className="text-text-primary text-sm font-heading mb-1">
              Learning Path
            </Text>
            <Text className="text-text-secondary text-xs">
              5 modul — dari pemula sampai jago
            </Text>
          </View>
          <Text className="text-primary text-xs">→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-bg rounded-lg p-4 shadow-sm flex-row items-center"
          onPress={() => router.push("/learn/mentor")}
        >
          <View className="w-12 h-12 rounded-full bg-primary-light items-center justify-center mr-4">
            <Text className="text-2xl">🤝</Text>
          </View>
          <View className="flex-1">
            <Text className="text-text-primary text-sm font-heading mb-1">
              Mentor Match
            </Text>
            <Text className="text-text-secondary text-xs">
              Belajar langsung dari yang udah jago
            </Text>
          </View>
          <Text className="text-primary text-xs">→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
