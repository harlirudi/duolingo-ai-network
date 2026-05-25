import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";

export default function DigitalProductScreen() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleBuild = async () => {
    if (!name.trim()) return;
    setGenerating(true);
    setTimeout(() => {
      setResult(
        `✅ Produk digital "${name}" sudah jadi!\n\nDeskripsi: ${description || "AI-generate otomatis"}\n\nFormat: PDF/Ebook siap jual.\n\nBagikan link afiliasi kamu sekarang!`,
      );
      setGenerating(false);
    }, 1500);
  };

  return (
    <ScrollView className="flex-1 bg-bg">
      <View className="bg-primary px-6 pt-12 pb-6">
        <Text className="text-text-inverse text-xl font-heading mb-1">
          🛠️ Digital Product Builder
        </Text>
        <Text className="text-text-inverse text-sm opacity-80">
          Bikin produk digital siap jual dalam hitungan menit
        </Text>
      </View>

      <View className="px-6 mt-6">
        <Text className="text-text-primary text-sm mb-2">Nama Produk</Text>
        <TextInput
          className="bg-bg-secondary rounded-md px-4 py-3 text-text-primary text-sm"
          placeholder="Contoh: Ebook 30 Hari Jago Jualan Online"
          placeholderTextColor="#AFAFAF"
          value={name}
          onChangeText={setName}
        />

        <Text className="text-text-primary text-sm mt-4 mb-2">
          Deskripsi (optional)
        </Text>
        <TextInput
          className="bg-bg-secondary rounded-md px-4 py-3 text-text-primary text-sm h-24"
          placeholder="Apa isi produk ini?"
          placeholderTextColor="#AFAFAF"
          multiline
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />

        <TouchableOpacity
          className={`mt-6 rounded-md py-4 items-center ${
            generating ? "bg-bg-secondary" : "bg-primary"
          }`}
          onPress={handleBuild}
          disabled={generating || !name.trim()}
        >
          <Text
            className={`text-base font-heading ${
              generating ? "text-text-secondary" : "text-text-inverse"
            }`}
          >
            {generating ? "🛠️ Membangun..." : "🚀 Bikin Produk"}
          </Text>
        </TouchableOpacity>

        {result && (
          <View className="bg-primary-light rounded-lg p-4 mt-6 mb-8">
            <Text className="text-text-primary text-sm leading-5">
              {result}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
