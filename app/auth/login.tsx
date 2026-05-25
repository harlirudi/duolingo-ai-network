import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/src/shared/stores/useAuthStore";

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, verifyOtp } = useAuthStore();
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!phone.trim() || phone.length < 10) return;
    setLoading(true);
    setError(null);
    try {
      await signIn(`+62${phone.replace(/^0/, "")}`);
      setOtpSent(true);
    } catch {
      setError("Gagal kirim kode. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await verifyOtp(`+62${phone.replace(/^0/, "")}`, otp);
      router.replace("/(app)/(tabs)/dashboard");
    } catch {
      setError("Kode salah. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-bg justify-center px-8"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="items-center mb-8">
        <Text className="text-5xl mb-4">🦜</Text>
        <Text className="text-text-primary text-2xl font-heading mb-2">
          Skill AI, Cuan Nyata.
        </Text>
        <Text className="text-text-secondary text-sm text-center">
          Masuk pakai nomor HP buat mulai perjalananmu sebagai kreator digital
        </Text>
      </View>

      {!otpSent ? (
        <>
          <Text className="text-text-primary text-sm mb-2">Nomor HP</Text>
          <View className="flex-row bg-bg-secondary rounded-md px-4 mb-4">
            <Text className="text-text-primary py-3 mr-2">+62</Text>
            <TextInput
              className="flex-1 py-3 text-text-primary text-base"
              placeholder="81234567890"
              placeholderTextColor="#AFAFAF"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>
          <TouchableOpacity
            className={`rounded-md py-4 items-center ${loading ? "bg-bg-secondary" : "bg-primary"}`}
            onPress={handleSendOtp}
            disabled={loading || phone.length < 10}
          >
            <Text className={`text-base font-heading ${loading ? "text-text-secondary" : "text-text-inverse"}`}>
              {loading ? "Mengirim..." : "Kirim Kode OTP"}
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text className="text-text-primary text-sm mb-2">
            Masukkan 6-digit kode yang dikirim ke +62{phone.replace(/^0/, "")}
          </Text>
          <TextInput
            className="bg-bg-secondary rounded-md px-4 py-3 text-text-primary text-base text-center tracking-widest mb-4"
            placeholder="000000"
            placeholderTextColor="#AFAFAF"
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
          />
          <TouchableOpacity
            className={`rounded-md py-4 items-center mb-3 ${loading ? "bg-bg-secondary" : "bg-primary"}`}
            onPress={handleVerifyOtp}
            disabled={loading || otp.length < 6}
          >
            <Text className={`text-base font-heading ${loading ? "text-text-secondary" : "text-text-inverse"}`}>
              {loading ? "Verifikasi..." : "Masuk"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setOtpSent(false)}>
            <Text className="text-primary text-sm text-center">Ganti nomor</Text>
          </TouchableOpacity>
        </>
      )}

      {error && (
        <View className="mt-4 bg-error/10 rounded-md px-4 py-3">
          <Text className="text-error text-sm text-center">{error}</Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
