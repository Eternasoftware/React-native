import React from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  Easing,
  type SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import useSettingsStore from "@/store/settingsStore";
import { colors } from "@/assets/styles/constants";
import { useShallow } from "zustand/react/shallow";

type AnimatedSlideProps = {
  index: number;
  offset: SharedValue<number>;
  screenWidth?: number;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  backShiftDivisor?: number;
  duration?: number;
  safeMode?: boolean;
};

const AnimatedSlide: React.FC<AnimatedSlideProps> = ({
  index,
  offset,
  screenWidth,
  style,
  children,
  backShiftDivisor = 4,
  duration = 500,
  safeMode = false,
}) => {
  const { screenWidth: storeScreenWidth } = useSettingsStore(
    useShallow((s) => ({
      screenWidth: s.screenWidth,
    }))
  );

  const resolvedScreenWidth = screenWidth ?? storeScreenWidth;

  const animatedStyle = useAnimatedStyle(() => {
    const width =
      isFinite(resolvedScreenWidth) && resolvedScreenWidth > 0 ? resolvedScreenWidth : 0;
    const divisor = isFinite(backShiftDivisor) && backShiftDivisor > 0 ? backShiftDivisor : 4;
    const animationDuration = isFinite(duration) && duration > 0 ? duration : 500;
    const currentOffset = isFinite(offset.value) ? offset.value : index;

    if (safeMode && width === 0) {
      return { transform: [{ translateX: 0 }] };
    }

    const rawTranslateX =
      currentOffset === index || width === 0 ? 0 : currentOffset > index ? -width / divisor : width;
    const translateX = isFinite(rawTranslateX) ? rawTranslateX : 0;

    return {
      transform: [
        {
          translateX: withTiming(translateX, {
            duration: animationDuration,
            easing: Easing.bezier(0.3, 0.8, 0.5, 1.0),
          }),
        },
      ],
    };
  }, [resolvedScreenWidth, index, backShiftDivisor, duration, safeMode]);

  return (
    <Animated.View style={[styles.defaultSlide, style, animatedStyle]}>{children}</Animated.View>
  );
};

const styles = StyleSheet.create({
  defaultSlide: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.surface.splash,
    flex: 1,
  },
});

export default AnimatedSlide;
