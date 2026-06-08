import { StyleSheet } from "react-native";
import { colors } from "./colors";

const styles = StyleSheet.create({
  inputPrimary: {
    borderRadius: 15,
    backgroundColor: colors.input.background,
    width: "100%",
    height: 45,
    paddingHorizontal: 16,
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    color: colors.input.text,
    borderWidth: 0,
    outlineColor: colors.input.outline,
  },
  primaryButton: {
    borderRadius: 100,
    borderWidth: 0.5,
    borderColor: colors.input.outline,
    alignSelf: "center",
    maxWidth: "100%",
    paddingHorizontal: 24,
    paddingVertical: 13,
    backgroundColor: colors.surface.button,
  },
});

export default styles;
