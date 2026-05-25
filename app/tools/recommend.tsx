import { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useProductStore } from "@/src/features/products/products.store";

export default function RecommendScreen() {
  const { recommendations, loading, loadRecommendations, acceptProduct } =
    useProductStore();

  useEffect(() => {
    loadRecommendations();
  }, []);

  return (
    <View className="flex-1 bg-bg">
      <View className="bg-primary px-6 pt-12 pb-6">
        <Text className="text-text-inverse text-xl font-heading mb-1">
          🎯 Rekomendasi Produk
        </Text>
        <Text className="text-text-inverse text-sm opacity-80">
          AI pilihkan produk terbaik untuk networkmu
        </Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-text-secondary text-sm">
            🦜 KreaTori lagi analisa networkmu...
          </Text>
        </View>
      ) : (
        <FlatList
          className="px-6 flex-1"
          contentContainerStyle={{ paddingVertical: 24 }}
          data={recommendations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="bg-bg rounded-lg p-4 mb-3 shadow-sm">
              <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1 mr-3">
                  <Text className="text-text-primary text-sm font-heading mb-1">
                    {item.name}
                  </Text>
                  <View className="bg-bg-secondary self-start px-2 py-1 rounded-full mb-2">
                    <Text className="text-text-secondary text-xs">
                      {item.type === "physical" ? "📦 Fisik" : "💻 Digital"}
                    </Text>
                  </View>
                </View>
                <Text className="text-xp text-sm font-heading">
                  Rp {item.price.toLocaleString("id-ID")}
                </Text>
              </View>
              <Text className="text-text-secondary text-sm mb-2">
                {item.description}
              </Text>
              {/* AI reason */}
              <View className="bg-primary-light rounded-md px-3 py-2 mb-3">
                <Text className="text-text-primary text-xs">
                  💡 {item.reason}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-text-secondary text-xs">
                  Match: {Math.round(item.confidence * 100)}%
                </Text>
                <TouchableOpacity
                  className="bg-primary px-4 py-2 rounded-md"
                  onPress={() => acceptProduct(item.id)}
                >
                  <Text className="text-text-inverse text-xs">
                    Jual Ini
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
