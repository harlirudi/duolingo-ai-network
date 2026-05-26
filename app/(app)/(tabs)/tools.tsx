import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Tools() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-bg">
      <View className="bg-primary px-6 pt-12 pb-6">
        <Text className="text-text-inverse text-xl font-heading mb-1">
          🛠️ Creator Tools
        </Text>
        <Text className="text-text-inverse text-sm opacity-80">
          Semua yang kamu butuh buat bikin konten
        </Text>
      </View>

      <View className="px-6 mt-6 gap-4">
        <ToolCard
          icon="✨"
          title="AI Caption Generator"
          desc="Bikin caption jualan yang nyambung sama gayamu"
          onPress={() => router.push("/tools/caption")}
        />
        <ToolCard
          icon="🎯"
          title="Product Recommender"
          desc="AI pilihkan produk terbaik buat dijual ke audiens-mu"
          onPress={() => router.push("/tools/recommend")}
        />
        <ToolCard
          icon="🛠️"
          title="Digital Product Builder"
          desc="Bikin ebook, template, dan produk digital siap jual"
          onPress={() => router.push("/tools/digital")}
        />
      </View>
    </View>
  );
}

function ToolCard({
  icon,
  title,
  desc,
  onPress,
}: {
  icon: string;
  title: string;
  desc: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      className="bg-bg rounded-lg p-4 shadow-sm flex-row items-center"
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View className="w-12 h-12 rounded-full bg-primary-light items-center justify-center mr-4">
        <Text className="text-2xl">{icon}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-text-primary text-sm font-heading mb-1">
          {title}
        </Text>
        <Text className="text-text-secondary text-xs">{desc}</Text>
      </View>
      <Text className="text-primary text-xs">→</Text>
    </TouchableOpacity>
  );
}
