import React, { useState } from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "@/assets/styles/constants";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import useSettingsStore from "@/store/settingsStore";
import { useShallow } from "zustand/react/shallow";

type DefaultButtonProps = {
  onPress: () => void;
  text?: any;
  py?: number;
  px?: number;
  bg?: string;
  color?: string;
  bgActive?: string;
  textActive?: string;
  width?: number;
  disabled?: boolean;
  btnStyle?: object;
  textStyle?: object;
  onPressStyle?: object;
};

const DefaultButton: React.FC<DefaultButtonProps> = ({
  text,
  py = 8,
  px = 16,
  width,
  bg = colors.surface.card,
  color = colors.text.body,
  bgActive = colors.action.primary,
  textActive = colors.text.body,
  disabled = false,
  onPress = () => {},
  onPressStyle,
  btnStyle,
  textStyle,
}) => {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );
  const [isPressed, setIsPressed] = useState(false);
  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      activeOpacity={1}
      disabled={disabled}
      style={[
        styles.buttonContainer,
        {
          paddingHorizontal: px,
          paddingVertical: py,
          backgroundColor: isPressed ? bgActive : bg,
          color: isPressed ? textActive : color,
          opacity: disabled ? 0.5 : 1,
          width: width,
          minHeight: 44,
        },
        btnStyle,
        isPressed ? onPressStyle : {},
      ]}
    >
      <Text
        numberOfLines={3}
        style={[textStyle || styles.buttonText, { color: isPressed ? textActive : color }]}
      >
        {text || localization.t(LOCALIZATION_KEYS.BTN_CONTINUE)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    minWidth: 100,
    justifyContent: "center",
    alignSelf: "flex-start",
    borderRadius: 100,
    borderWidth: 0.5,
    borderColor: colors.text.body,
    marginHorizontal: "auto",
    opacity: 1,
  },

  buttonText: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    textAlign: "center",
    marginHorizontal: "auto",
  },
});

export default DefaultButton;
