import { Tabs } from "expo-router";
import { CheckCircle, Wrench, BookOpen, User } from "phosphor-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#58CC02",
        tabBarInactiveTintColor: "#AFAFAF",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E5E5E5",
          height: 56,
          paddingBottom: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: "Inter_500Medium",
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Misi",
          tabBarIcon: ({ color, size }) => <CheckCircle size={size} color={color as string} weight="fill" />,
        }}
      />
      <Tabs.Screen
        name="tools"
        options={{
          title: "Tools",
          tabBarIcon: ({ color, size }) => <Wrench size={size} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: "Belajar",
          tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => <User size={size} color={color as string} />,
        }}
      />
    </Tabs>
  );
}
