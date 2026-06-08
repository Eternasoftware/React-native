import { colors } from "@/assets/styles/constants";
import { useState } from "react";
import { TouchableOpacity, Animated, StyleSheet, View } from "react-native";
import { Easing } from "react-native-reanimated";

type ToggleProps = {
  value: boolean;
  onValueChange: (val: boolean) => void;
};

const Toggle: React.FC<ToggleProps> = ({ value, onValueChange }) => {
  const [translateX] = useState(new Animated.Value(value ? 28 : 0));

  const toggleSwitch = () => {
    Animated.timing(translateX, {
      toValue: value ? 0 : 28,
      duration: 250,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
    onValueChange(!value);
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={toggleSwitch}
      style={[
        styles.switchContainer,
        {
          backgroundColor: value ? colors.action.primary : colors.surface.input,
        },
      ]}
    >
      <Animated.View style={[styles.thumb, { transform: [{ translateX }] }]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    width: 59,
    height: 31,
    borderRadius: 100,
    backgroundColor: colors.neutral.gray300,
    padding: 2,
    justifyContent: "center",
  },
  thumb: {
    width: 27,
    height: 27,
    borderRadius: 100,
    backgroundColor: colors.surface.box,
  },
});

export default Toggle;
