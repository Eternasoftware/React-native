import { StyleSheet } from "react-native";
import { colors } from "@/assets/styles/constants";

export const programDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 1,
  },
  headerContainer: {
    position: "relative",
    height: 322,
  },
  header: {
    paddingHorizontal: 16,
    position: "absolute",
    bottom: 8,
  },
  newBaner: {
    width: 49,
    height: 19,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.action.primary,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    marginBottom: 4,
  },
  newText: {
    fontFamily: "Poppins-Medium",
    fontSize: 13,
    lineHeight: 16,
  },
  image: {
    flex: 1,
  },
  title: {
    fontFamily: "HelveticaNow-Black",
    color: colors.text.body,
    fontSize: 24,
  },
  info: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 10,
  },
  infoSection: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  infoSectionIcon: {
    minWidth: 15,
    minHeight: 15,
    width: 15,
    height: 15,
  },
  infoText: {
    fontFamily: "HelveticaNow-Light",
    color: colors.text.body,
    fontSize: 14,
    textTransform: "capitalize",
  },
  description: {
    fontFamily: "HelveticaNow-Regular",
    color: colors.text.body,
    paddingHorizontal: 24,
    paddingVertical: 18,
    fontSize: 14,
    lineHeight: 20,
  },
  list: {
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
});
