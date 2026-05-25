import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Profile() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-bg">
      <View className="bg-primary px-6 pt-12 pb-8">
        <View className="items-center">
          <View className="w-20 h-20 rounded-full bg-white items-center justify-center mb-3">
            <Text className="text-primary text-3xl">🦜</Text>
          </View>
          <Text className="text-text-inverse text-lg font-heading">
            Creator 12
          </Text>
        </View>

        {/* Stats */}
        <View className="flex-row justify-around mt-6">
          <StatItem value="8,900" label="XP" />
          <StatItem value="12" label="Level" />
          <StatItem value="7" label="Streak 🔥" />
          <StatItem value="5" label="Misi" />
        </View>
      </View>

      {/* XP Bar */}
      <View className="bg-bg -mt-4 rounded-t-lg px-6 pt-4 mx-3 shadow-md">
        <View className="flex-row justify-between mb-2">
          <Text className="text-text-primary text-sm">Progress Level 13</Text>
          <Text className="text-text-secondary text-xs">8,900 / 10,000 XP</Text>
        </View>
        <View className="h-2 bg-bg-secondary rounded-full overflow-hidden">
          <View className="h-full bg-xp rounded-full" style={{ width: "89%" }} />
        </View>
      </View>

      {/* Menu */}
      <View className="px-6 mt-6 gap-4 mb-8">
        <MenuRow icon="🟡" label="Trust Anchor" desc="Archetype kamu" />
        <TouchableOpacity onPress={() => router.push("/affiliate/links")}>
          <MenuRow icon="🔗" label="Link Afiliasi" desc="Kelola link & lihat statistik" />
        </TouchableOpacity>
        <MenuRow icon="🏆" label="Leaderboard" desc="Lihat peringkat nasional" />
        <MenuRow icon="⚙️" label="Pengaturan" desc="Ubah profil & preferensi" />
      </View>
    </ScrollView>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <View className="items-center">
      <Text className="text-text-inverse text-lg font-heading">{value}</Text>
      <Text className="text-text-inverse text-xs opacity-80">{label}</Text>
    </View>
  );
}

function MenuRow({
  icon,
  label,
  desc,
}: {
  icon: string;
  label: string;
  desc: string;
}) {
  return (
    <View className="flex-row items-center">
      <Text className="text-xl mr-3">{icon}</Text>
      <View className="flex-1">
        <Text className="text-text-primary text-sm font-heading">{label}</Text>
        <Text className="text-text-secondary text-xs">{desc}</Text>
      </View>
      <Text className="text-text-secondary text-sm">›</Text>
    </View>
  );
}
