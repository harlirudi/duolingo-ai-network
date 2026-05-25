import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useContentStore } from "@/src/features/text-tool/text-tool.store";

export default function TextTool() {
  const { generating, lastCaption, history, generateCaption } =
    useContentStore();
  const [productName, setProductName] = useState("");
  const [vibe, setVibe] = useState("promo");

  const handleGenerate = async () => {
    if (!productName.trim()) return;
    await generateCaption(`${vibe}: ${productName}`);
  };

  return (
    <ScrollView className="flex-1 bg-bg">
      <View className="bg-primary px-6 pt-12 pb-6">
        <Text className="text-text-inverse text-xl font-heading mb-1">
          ✨ AI Caption Generator
        </Text>
        <Text className="text-text-inverse text-sm opacity-80">
          Caption otomatis yang sesuai gayamu
        </Text>
      </View>

      <View className="px-6 mt-6">
        <Text className="text-text-primary text-sm mb-2">Produk</Text>
        <TextInput
          className="bg-bg-secondary rounded-md px-4 py-3 text-text-primary text-sm"
          placeholder="Nama produk yang mau dijual..."
          placeholderTextColor="#AFAFAF"
          value={productName}
          onChangeText={setProductName}
        />

        {/* Vibe selector */}
        <Text className="text-text-primary text-sm mt-4 mb-2">Gaya</Text>
        <View className="flex-row flex-wrap gap-2">
          {[
            { key: "promo", label: "🔥 Promo" },
            { key: "edukasi", label: "📚 Edukasi" },
            { key: "story", label: "💬 Story Personal" },
            { key: "trendy", label: "🎯 Tren" },
          ].map(({ key, label }) => (
            <TouchableOpacity
              key={key}
              className={`px-4 py-2 rounded-full ${
                vibe === key ? "bg-primary" : "bg-bg-secondary"
              }`}
              onPress={() => setVibe(key)}
            >
              <Text
                className={`text-sm ${
                  vibe === key ? "text-text-inverse" : "text-text-primary"
                }`}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Generate button */}
        <TouchableOpacity
          className={`w-full mt-6 rounded-md py-4 items-center ${
            generating ? "bg-bg-secondary" : "bg-primary"
          }`}
          onPress={handleGenerate}
          disabled={generating || !productName.trim()}
        >
          <Text
            className={`text-base font-heading ${
              generating ? "text-text-secondary" : "text-text-inverse"
            }`}
          >
            {generating ? "🦜 KreaTori mikir..." : "🚀 Generate Caption"}
          </Text>
        </TouchableOpacity>

        {/* Result */}
        {lastCaption && (
          <View className="bg-primary-light rounded-lg p-4 mt-6">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-text-primary text-sm font-heading">
                Hasil Generate
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert("Disalin!", "Caption sudah dicopy ke clipboard.");
                }}
              >
                <Text className="text-primary text-xs">📋 Copy</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-text-primary text-sm leading-5">
              {lastCaption}
            </Text>
          </View>
        )}

        {/* History */}
        {history.length > 0 && (
          <View className="mt-6 mb-8">
            <Text className="text-text-primary text-base font-heading mb-3">
              Riwayat
            </Text>
            {history.slice(0, 5).map((item) => (
              <View
                key={item.id}
                className="bg-bg-secondary rounded-md p-3 mb-2"
              >
                <Text
                  className="text-text-primary text-xs leading-4"
                  numberOfLines={2}
                >
                  {item.caption}
                </Text>
                <Text className="text-text-secondary text-2xs mt-1">
                  {new Date(item.timestamp).toLocaleDateString("id-ID")}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
