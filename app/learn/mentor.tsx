import { useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useMentorStore } from "@/src/features/mentor/mentor.store";

export default function MentorMatch() {
  const { mentors, myMentor, loadMentors, adoptMentor } = useMentorStore();

  useEffect(() => {
    loadMentors();
  }, []);

  return (
    <View className="flex-1 bg-bg">
      <View className="bg-primary px-6 pt-12 pb-6">
        <Text className="text-text-inverse text-xl font-heading mb-1">
          🤝 Mentor Match
        </Text>
        <Text className="text-text-inverse text-sm opacity-80">
          Belajar langsung dari yang sudah jago
        </Text>
      </View>

      {/* Current mentor */}
      {myMentor && (
        <View className="mx-6 mt-4 bg-primary-light rounded-lg p-4">
          <Text className="text-text-primary text-xs font-heading mb-2">
            MENTOR KAMU
          </Text>
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-full bg-archetype-anchor items-center justify-center mr-3">
              <Text className="text-white text-lg">
                {myMentor.name[0]}
              </Text>
            </View>
            <View>
              <Text className="text-text-primary text-sm font-heading">
                {myMentor.name}
              </Text>
              <Text className="text-text-secondary text-xs">
                {myMentor.archetype} · {myMentor.xp.toLocaleString()} XP
              </Text>
            </View>
          </View>
        </View>
      )}

      <FlatList
        className="px-6 flex-1"
        contentContainerStyle={{ paddingVertical: 24 }}
        data={mentors.filter((m) => m.id !== myMentor?.id)}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <Text className="text-text-primary text-base font-heading mb-4">
            Pilih Mentormu
          </Text>
        }
        renderItem={({ item }) => (
          <View className="bg-bg rounded-lg p-4 mb-3 shadow-sm flex-row items-center">
            <View className="w-12 h-12 rounded-full bg-bg-secondary items-center justify-center mr-3">
              <Text className="text-text-primary text-lg">{item.name[0]}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-text-primary text-sm font-heading">
                {item.name}
              </Text>
              <Text className="text-text-secondary text-xs">
                {item.archetype} · {item.xp.toLocaleString()} XP ·{" "}
                {item.mentees} mentee
              </Text>
            </View>
            <TouchableOpacity
              className="bg-primary px-4 py-2 rounded-full"
              onPress={() => adoptMentor(item.id)}
            >
              <Text className="text-text-inverse text-xs">Adopsi</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
