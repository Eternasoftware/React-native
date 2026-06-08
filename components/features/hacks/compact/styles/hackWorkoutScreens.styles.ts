import { StyleSheet } from "react-native";
import { colors } from "@/assets/styles/constants";

export const hackWorkoutScreensStyles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
    backgroundColor: colors.surface.splash,
    minHeight: "100%",
  },
});
