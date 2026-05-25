const { withNativeWind } = require("nativewind/metro");

module.exports = withNativeWind(require("expo/metro-config"), {
  input: "./global.css",
});
