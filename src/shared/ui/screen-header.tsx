import { View, Text } from "react-native";

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
};

export default function ScreenHeader({ title, subtitle }: ScreenHeaderProps) {
  return (
    <View className="bg-primary px-6 pt-12 pb-6">
      <Text className="text-text-inverse text-xl font-heading mb-1">
        {title}
      </Text>
      {subtitle && (
        <Text className="text-text-inverse text-sm opacity-80">
          {subtitle}
        </Text>
      )}
    </View>
  );
}
