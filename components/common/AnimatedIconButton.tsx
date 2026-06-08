import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { colors } from "@/assets/styles/constants";

function useIconTransition() {
  const progress = useSharedValue(0);

  const trigger = () => {
    progress.value = withTiming(1, { duration: 200 }, () => {
      progress.value = withDelay(3000, withTiming(0, { duration: 200 }));
    });
  };

  const primaryStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [{ scale: 1 - 0.15 * progress.value }],
  }));

  const secondaryStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: 0.85 + 0.15 * progress.value }],
  }));

  return { trigger, primaryStyle, secondaryStyle };
}

type AnimatedIconButtonProps = {
  onPress: () => void;
  label: string;
  PrimaryIcon: React.FC<any>;
  SuccessIcon: React.FC<any>;
};

export default function AnimatedIconButton({
  onPress,
  label,
  PrimaryIcon,
  SuccessIcon,
}: AnimatedIconButtonProps) {
  const { trigger, primaryStyle, secondaryStyle } = useIconTransition();

  const handlePress = () => {
    onPress();
    trigger();
  };

  return (
    <TouchableOpacity activeOpacity={0.7} style={styles.shareOptionButton} onPress={handlePress}>
      <View style={styles.shareOptionButtonIconContainer}>
        <Animated.View
          style={[styles.shareOptionButtonIconContainer, StyleSheet.absoluteFill, primaryStyle]}
        >
          <PrimaryIcon style={styles.shareOptionButtonIcon} />
        </Animated.View>
        <Animated.View
          style={[styles.shareOptionButtonIconContainer, StyleSheet.absoluteFill, secondaryStyle]}
        >
          <SuccessIcon style={styles.shareOptionButtonIcon} />
        </Animated.View>
      </View>
      <Text style={styles.shareOptionButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  shareOptionButton: {
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },
  shareOptionButtonIconContainer: {
    width: 55,
    height: 55,
    backgroundColor: colors.surface.box,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
  },
  shareOptionButtonIcon: {
    width: 30,
    height: 30,
    maxWidth: 30,
    maxHeight: 30,
  },
  shareOptionButtonText: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: colors.text.body,
  },
});
