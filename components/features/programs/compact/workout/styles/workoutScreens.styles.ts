import { StyleSheet } from "react-native";
import { colors } from "@/assets/styles/constants";

export const workoutScreensStyles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
    backgroundColor: colors.surface.splash,
    minHeight: "100%",
  },
  playerHeader: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    width: "100%",
    zIndex: 5,
  },
});
