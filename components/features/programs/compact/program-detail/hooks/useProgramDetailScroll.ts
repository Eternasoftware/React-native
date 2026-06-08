import React, { useEffect, useRef, useState } from "react";
import { View, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Gesture } from "react-native-gesture-handler";
import { colors, rgbaFromHex } from "@/assets/styles/constants";
import { ProgramType } from "@/types/program.type";

export function useProgramDetailScroll(program: ProgramType) {
  const listRef = useRef<View>(null);
  const scrollViewRef = useRef<React.ComponentRef<typeof Animated.ScrollView>>(null);
  const workoutRefs = useRef<View[]>([]);
  const opacity = useSharedValue(0);
  const [distanceToList, setDistanceToList] = useState<number | null>(null);

  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: rgbaFromHex(colors.surface.app, opacity.value),
    borderBottomWidth: 1,
    borderBottomColor: rgbaFromHex(
      colors.text.inverse,
      interpolate(opacity.value, [0, 1], [0, 0.2])
    ),
  }));

  const animatedButtonShadowStyle = useAnimatedStyle(() => ({
    backgroundColor: rgbaFromHex(
      colors.surface.overlay,
      interpolate(opacity.value, [0, 1], [0.5, 0])
    ),
  }));

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const elementY = (distanceToList || 414) - 80;
    if (scrollY < elementY) {
      opacity.value = withTiming(scrollY / elementY, {
        duration: 0,
      });
    } else {
      opacity.value = withTiming(1, { duration: 0 });
    }
  };

  const scrollToElement = (index: number) => {
    const scrollView = scrollViewRef.current;
    if (!scrollView) return;

    workoutRefs.current[index]?.measureLayout(
      scrollView as unknown as View,
      (_x, y) => {
        scrollView.scrollTo({
          y: y - 90,
          animated: true,
        });
      },
      () => {
        console.error("Error measuring layout");
      }
    );
  };

  const measureElement = () => {
    if (!scrollViewRef.current) return;

    listRef.current?.measureLayout(
      scrollViewRef.current as unknown as View,
      (_x, y) => {
        setDistanceToList(y);
      }
    );
  };

  useEffect(() => {
    for (let i = 0; i < program.workouts.length; i++) {
      if (!program.workouts[i].statusComplete) {
        if (i) {
          setTimeout(() => {
            scrollToElement(i);
          }, 1000);
        }
        break;
      }
    }
  }, [scrollViewRef]);

  const scrollGesture = Gesture.Native();

  return {
    listRef,
    scrollViewRef,
    workoutRefs,
    animatedBackgroundStyle,
    animatedButtonShadowStyle,
    handleScroll,
    measureElement,
    scrollGesture,
  };
}
