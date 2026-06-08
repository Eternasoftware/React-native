import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Animated } from "react-native";
import HeartFalse from "@icons/common/heart-empty.svg";
import HeartTrue from "@icons/common/heart.svg";
import ReAnimated from "react-native-reanimated";
import { colors } from "@/assets/styles/constants";

type LikeStateProps = {
  value: boolean;
  shadow?: boolean;
  buttonShadowStyle?: object;
  onPress: () => void;
};

const LikeState: React.FC<LikeStateProps> = ({
  value,
  shadow = true,
  buttonShadowStyle,
  onPress,
}) => {
  const [scale] = useState(new Animated.Value(1));

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
    <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
      <ReAnimated.View style={[styles.iconContainer, shadow && styles.shadow, buttonShadowStyle]}>
        <Animated.View style={{ transform: [{ scale }] }}>
          {value ? <HeartTrue style={styles.icon} /> : <HeartFalse style={styles.icon} />}
        </Animated.View>
      </ReAnimated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  shadow: {
    borderRadius: 100,
    backgroundColor: colors.alpha.black40,
  },
  icon: {
    width: 20,
  },
});

export default LikeState;
