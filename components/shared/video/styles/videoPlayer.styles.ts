import { StyleSheet } from "react-native";
import { colors } from "@/assets/styles/constants";

export const webPlayerStyles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    minWidth: "100%",
    minHeight: "100%",
    overflow: "hidden",
    backgroundColor: colors.surface.splash,
  },
  innerShadow: {
    position: "absolute",
    top: -10,
    bottom: -10,
    left: -10,
    right: -10,
    borderRadius: 12,
    zIndex: 4,
  },
  video: {
    width: "100%",
    height: "100%",
    flex: 1,
    zIndex: 3,
    minWidth: "100%",
    minHeight: "100%",
  },
  controlsContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 6,
    minWidth: "100%",
    paddingHorizontal: 18,
    flex: 1,
  },
  controlsPanel: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 24,
  },
  leftPanel: {
    width: 40,
  },
  rightPanel: {
    width: 40,
  },
  centerPanel: {
    width: 190,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  slider: {
    zIndex: 5,
    paddingTop: 16,
    width: "100%",
    paddingHorizontal: 6,
  },
  timePanel: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    marginBottom: 10,
  },
  time: {
    color: colors.neutral.gray800,
  },
  blurBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  touchOverlay: {
    flex: 1,
    zIndex: 4,
    minWidth: "100%",
    minHeight: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
});
