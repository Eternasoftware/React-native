import { useState } from "react";
import { Platform } from "react-native";

export function useShellSplash() {
  const [showCustomSplash, setShowCustomSplash] = useState(true);
  const [showWebSplashScreen, setShowWebSplashScreen] = useState(Platform.OS === "web");

  return {
    showCustomSplash,
    setShowCustomSplash,
    showWebSplashScreen,
    setShowWebSplashScreen,
  };
}
