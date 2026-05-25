module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#58CC02",
        "primary-hover": "#4CAF00",
        "primary-light": "#E8F5E0",
        // Archetype accents
        "archetype-builder": "#1CB0F6",
        "archetype-seller": "#FF9600",
        "archetype-hunter": "#CE82FF",
        "archetype-anchor": "#FFD700",
        // Gamification
        xp: "#FFC800",
        streak: "#FF4B4B",
        "gold-medal": "#FFD700",
        "silver-medal": "#C0C0C0",
        "bronze-medal": "#CD7F32",
        // Neutrals
        bg: "#FFFFFF",
        "bg-secondary": "#F7F7F7",
        "bg-tertiary": "#EEEEEE",
        "text-primary": "#4B4B4B",
        "text-secondary": "#AFAFAF",
        "text-inverse": "#FFFFFF",
        border: "#E5E5E5",
        error: "#E53935",
        success: "#43A047",
      },
      fontFamily: {
        heading: ["Nunito_700Bold", "Nunito_800ExtraBold"],
        body: ["Inter_400Regular", "Inter_500Medium", "Inter_600SemiBold"],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        full: "9999px",
      },
      spacing: {
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        5: "20px",
        6: "24px",
        8: "32px",
        12: "48px",
        16: "64px",
      },
    },
  },
};
