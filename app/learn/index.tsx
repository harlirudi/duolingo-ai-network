import { useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useLearningStore } from "@/src/features/learning/learning.store";

export default function LearnIndex() {
  const { modules, completed, loadModules, progress } = useLearningStore();

  useEffect(() => {
    loadModules();
  }, []);

  const pct = progress();

  return (
    <View className="flex-1 bg-bg">
      <View className="bg-primary px-6 pt-12 pb-6">
        <Text className="text-text-inverse text-xl font-heading mb-1">
          📚 Belajar
        </Text>
        <Text className="text-text-inverse text-sm opacity-80">
          Dari pemula sampai jago — step by step
        </Text>
        <View className="mt-3">
          <View className="h-2 bg-primary-hover rounded-full overflow-hidden">
            <View
              className="h-full bg-white rounded-full"
              style={{ width: `${pct * 100}%` }}
            />
          </View>
          <Text className="text-text-inverse text-xs mt-1 opacity-80">
            {Math.round(pct * 100)}% selesai
          </Text>
        </View>
      </View>

      <FlatList
        className="px-6"
        contentContainerStyle={{ paddingVertical: 24 }}
        data={modules}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const done = completed.has(item.id);
          return (
            <TouchableOpacity
              className={`rounded-lg p-4 mb-3 shadow-sm flex-row items-center ${
                done ? "bg-primary-light" : "bg-bg"
              }`}
              activeOpacity={0.7}
            >
              <View
                className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                  done ? "bg-primary" : "bg-bg-secondary"
                }`}
              >
                <Text className={done ? "text-text-inverse" : "text-text-primary"}>
                  {done ? "✓" : item.order}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-text-primary text-sm font-heading">
                  {item.title}
                </Text>
                <Text
                  className="text-text-secondary text-xs mt-1"
                  numberOfLines={2}
                >
                  {item.description}
                </Text>
              </View>
              <Text className="text-xp text-xs">+{item.xpReward} XP</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
