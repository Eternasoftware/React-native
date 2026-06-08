import { StyleSheet } from "react-native";
import { colors } from "@/assets/styles/constants";

export const programDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    position: "relative",
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
  mainBlockContainer: {
    padding: 32,
    alignItems: "center",
  },
  mainBlock: {
    flexDirection: "row",
    gap: 16,
    maxWidth: 822,
  },
  description: {},
  list: {
    gap: 12,
    paddingBottom: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    flex: 1,
  },
  item: {
    marginBottom: 12,
  },
});
