/** @type {import('jest').Config} */
module.exports = {
  preset: "jest-expo",
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|phosphor-react-native|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg)",
  ],
  setupFilesAfterSetup: [],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
  ],
};
