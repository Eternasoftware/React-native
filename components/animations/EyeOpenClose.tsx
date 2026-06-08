import React, { useRef } from "react";
import { StyleSheet, TouchableOpacity, Animated } from "react-native";
import EyeCloseIcon from "@icons/common/eye-close.svg";
import EyeOpenIcon from "@icons/common/eye-open.svg";

type EyeOpenCloseProps = {
  value: boolean;
  onPress: () => void;
};

const EyeOpenClose: React.FC<EyeOpenCloseProps> = ({ value, onPress }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.timing(scale, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      onPress();
      Animated.timing(scale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={handlePress} style={styles.iconContainer}>
      <Animated.View style={{ transform: [{ scale }] }}>
        {value ? <EyeCloseIcon style={styles.icon} /> : <EyeOpenIcon style={styles.icon} />}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    position: "absolute",
    right: 6,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    padding: 10,
  },
  icon: {
    width: 18,
  },
});

export default EyeOpenClose;
