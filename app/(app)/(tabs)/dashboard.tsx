import { View, Text, ScrollView } from "react-native";
import { Fire, Star, Medal } from "phosphor-react-native";

export default function Dashboard() {
  return (
    <ScrollView className="flex-1 bg-bg">
      {/* Streak Banner */}
      <View className="bg-primary px-6 pt-12 pb-6">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-text-inverse text-lg font-heading">
              🔥 7 Hari!
            </Text>
            <Text className="text-text-inverse text-sm opacity-80">
              Jangan putuskan streak-mu!
            </Text>
          </View>
          <Fire size={40} color="#FFFFFF" weight="fill" />
        </View>
      </View>

      {/* XP Bar */}
      <View className="bg-bg -mt-4 rounded-t-lg px-6 pt-6 mx-3 shadow-md">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-text-primary text-base font-heading">
            ⭐ Level 12
          </Text>
          <Text className="text-text-secondary text-sm">
            2,400 / 3,000 XP
          </Text>
        </View>
        <View className="h-3 bg-bg-secondary rounded-full overflow-hidden">
          <View className="h-full bg-xp rounded-full" style={{ width: "80%" }} />
        </View>
      </View>

      {/* Missions */}
      <View className="px-6 mt-6">
        <Text className="text-text-primary text-xl font-heading mb-4">
          📋 Misi Hari Ini
        </Text>

        {/* Mission Card 1 */}
        <View className="bg-bg rounded-lg p-4 mb-3 shadow-sm border-l-4 border-archetype-seller">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 mr-3">
              <Text className="text-text-primary text-sm font-heading mb-1">
                🟠 Natural Seller
              </Text>
              <Text className="text-text-secondary text-sm mb-3">
                Buat 1 video talking-head 30 detik
              </Text>
              <Text className="text-xp text-xs">+50 XP</Text>
            </View>
            <View className="bg-primary px-4 py-2 rounded-md">
              <Text className="text-text-inverse text-sm">Mulai</Text>
            </View>
          </View>
        </View>

        {/* Mission Card 2 */}
        <View className="bg-bg rounded-lg p-4 mb-3 shadow-sm border-l-4 border-archetype-builder">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 mr-3">
              <Text className="text-text-primary text-sm font-heading mb-1">
                🔵 Silent Builder
              </Text>
              <Text className="text-text-secondary text-sm mb-3">
                Generate 3 caption produk dengan AI
              </Text>
              <Text className="text-xp text-xs">+30 XP</Text>
            </View>
            <View className="bg-primary px-4 py-2 rounded-md">
              <Text className="text-text-inverse text-sm">Buka Tools</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Leaderboard Mini */}
      <View className="px-6 mt-6 mb-8">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-text-primary text-xl font-heading">
            🏆 Leaderboard
          </Text>
          <Text className="text-primary text-sm">Lihat Semua</Text>
        </View>
        <View className="bg-bg rounded-lg p-4 shadow-sm">
          <LeaderRow
            rank={1}
            name="Budi S."
            xp={12400}
            archetype="Silent Builder"
            medal="gold"
          />
          <LeaderRow
            rank={2}
            name="Siti A."
            xp={10200}
            archetype="Natural Seller"
            medal="silver"
          />
          <LeaderRow
            rank={3}
            name="Kamu"
            xp={8900}
            archetype="Trust Anchor"
            medal="bronze"
            isMe
          />
        </View>
      </View>
    </ScrollView>
  );
}

function LeaderRow({
  rank,
  name,
  xp,
  archetype,
  medal,
  isMe,
}: {
  rank: number;
  name: string;
  xp: number;
  archetype: string;
  medal: "gold" | "silver" | "bronze";
  isMe?: boolean;
}) {
  const medalColorMap = {
    gold: "#FFD700",
    silver: "#C0C0C0",
    bronze: "#CD7F32",
  };
  return (
    <View
      className={`flex-row items-center py-2 ${
        isMe ? "bg-primary-light rounded-md px-2 -mx-2" : ""
      }`}
    >
      <Medal size={20} color={medalColorMap[medal]} weight="fill" />
      <View className="flex-1 ml-3">
        <Text className="text-text-primary text-sm">{name}</Text>
        <Text className="text-text-secondary text-xs">{archetype}</Text>
      </View>
      <Text className="text-text-primary text-sm font-heading">
        {xp.toLocaleString()} XP
      </Text>
    </View>
  );
}
