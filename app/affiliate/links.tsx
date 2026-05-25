import { useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAffiliateStore } from "@/src/features/affiliate/affiliate.store";

export default function LinksScreen() {
  const router = useRouter();
  const { links, loading, generateLink, loadLinks } = useAffiliateStore();

  useEffect(() => {
    loadLinks();
  }, []);

  return (
    <View className="flex-1 bg-bg">
      <View className="bg-primary px-6 pt-12 pb-6">
        <Text className="text-text-inverse text-xl font-heading mb-1">
          🔗 Link Afiliasi
        </Text>
        <Text className="text-text-inverse text-sm opacity-80">
          Tiap klik = potential cuan
        </Text>
      </View>

      <FlatList
        className="px-6"
        contentContainerStyle={{ paddingVertical: 24 }}
        data={links}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View className="items-center mt-12">
            <Text className="text-4xl mb-3">🔗</Text>
            <Text className="text-text-primary text-lg font-heading mb-2">
              Belum ada link
            </Text>
            <Text className="text-text-secondary text-sm text-center">
              Buat link afiliasi pertamamu dan mulai dapatkan komisi!
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="bg-bg rounded-lg p-4 mb-3 shadow-sm">
            <View className="flex-row justify-between items-start mb-2">
              <Text className="text-text-primary text-sm font-heading flex-1">
                {item.productName}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert("Disalin!", `Link ${item.url}`);
                }}
              >
                <Text className="text-primary text-xs">📋 Copy</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-text-secondary text-xs mb-3">
              {item.url}
            </Text>
            <View className="flex-row gap-4">
              <View>
                <Text className="text-text-primary text-base font-heading">
                  {item.clicks}
                </Text>
                <Text className="text-text-secondary text-xs">Klik</Text>
              </View>
              <View>
                <Text className="text-text-primary text-base font-heading">
                  {item.conversions}
                </Text>
                <Text className="text-text-secondary text-xs">Konversi</Text>
              </View>
              <View>
                <Text className="text-xp text-base font-heading">
                  Rp {item.commission.toLocaleString("id-ID")}
                </Text>
                <Text className="text-text-secondary text-xs">Komisi</Text>
              </View>
            </View>
          </View>
        )}
      />

      <View className="px-6 pb-8">
        <TouchableOpacity
          className="bg-primary rounded-md py-4 items-center"
          onPress={async () => {
            if (loading) return;
            await generateLink("Produk Baru");
          }}
        >
          <Text className="text-text-inverse text-sm font-heading">
            {loading ? "Membuat..." : "+ Buat Link Baru"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
