import { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import {
  useOnboarding,
  questions,
  determineArchetype,
} from "@/src/features/onboarding/onboarding.store";

export default function ChatScreen() {
  const router = useRouter();
  const {
    messages,
    step,
    loading,
    addMessage,
    setAnswer,
    nextStep,
    setLoading,
    setArchetype,
    setError,
  } = useOnboarding();

  const [input, setInput] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const handleSend = () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    addMessage({ role: "user", content: text });
    setAnswer(step, text);

    if (step < questions.length - 1) {
      setLoading(true);
      setTimeout(() => {
        nextStep();
        setLoading(false);
      }, 800);
    } else {
      processAnswers(text);
    }

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const processAnswers = (finalAnswer: string) => {
    setLoading(true);
    const state = useOnboarding.getState();
    const allAnswers = { ...state.answers, [state.step]: finalAnswer };
    const result = determineArchetype(allAnswers);
    setArchetype(result.type, result.confidence);

    setTimeout(() => {
      setLoading(false);
      router.push("/onboarding/archetype");
    }, 1200);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-bg"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View className="bg-primary px-6 pt-12 pb-4">
        <Text className="text-text-inverse text-lg font-heading">
          👋 Kenalan dulu, yuk!
        </Text>
        <Text className="text-text-inverse text-sm opacity-80">
          AI Coach mau kenal kamu lebih dekat
        </Text>
      </View>

      {/* Chat */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        className="flex-1 px-4"
        contentContainerStyle={{ paddingVertical: 16 }}
        renderItem={({ item }) => (
          <View
            className={`mb-3 max-w-[85%] rounded-lg px-4 py-3 ${
              item.role === "ai"
                ? "bg-primary-light self-start rounded-bl-sm"
                : "bg-bg-secondary self-end rounded-br-sm"
            }`}
          >
            {item.role === "ai" && (
              <Text className="text-text-primary text-xs mb-1 font-heading">
                🦜 KreaTori
              </Text>
            )}
            <Text className="text-text-primary text-sm leading-5">
              {item.content}
            </Text>
          </View>
        )}
      />

      {/* Input */}
      <View className="px-4 py-3 border-t border-bg-secondary bg-bg">
        {loading ? (
          <View className="flex-row items-center justify-center h-12">
            <Text className="text-text-primary text-sm">
              KreaTori mikir dulu...
            </Text>
          </View>
        ) : (
          <View className="flex-row items-center bg-bg-secondary rounded-full px-4">
            <TextInput
              className="flex-1 h-11 text-text-primary text-sm"
              placeholder="Ketik jawabanmu..."
              placeholderTextColor="#AFAFAF"
              value={input}
              onChangeText={setInput}
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />
            <View
              className="w-11 h-11 bg-primary rounded-full items-center justify-center"
              onTouchEnd={handleSend}
            >
              <Text className="text-text-inverse text-xs">↑</Text>
            </View>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
