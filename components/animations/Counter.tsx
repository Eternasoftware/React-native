import { colors } from "@/assets/styles/constants";
import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

type CounterProps = {
  amount?: number;
  extraTime?: number;
  finish?: () => void;
  isRun: boolean;
};

const Counter: React.FC<CounterProps> = ({
  amount = 20,
  extraTime = 0,
  finish = () => {},
  isRun,
}) => {
  const [count, setCount] = useState(0);
  const [extra, setExtra] = useState(1);
  const scale = useSharedValue(0);

  const timerOneRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isRun) {
      if (timerOneRef.current) clearTimeout(timerOneRef.current);
      return;
    }

    if (count <= amount) {
      scale.value = withSequence(
        withTiming(1, { duration: 250 }),
        withTiming(1, { duration: 500 }),
        withTiming(0, { duration: 250 })
      );
      timerOneRef.current = setTimeout(() => {
        setCount((prevCount) => prevCount + 1);
      }, 1000);
    } else if (extra <= extraTime) {
      scale.value = withSequence(
        withTiming(1, { duration: 250 }),
        withTiming(1, { duration: 500 }),
        withTiming(0, { duration: 250 })
      );
      timerOneRef.current = setTimeout(() => {
        setExtra((prevExtra) => prevExtra + 1);
      }, 1000);
    } else {
      finish();
    }

    return () => {
      if (timerOneRef.current) clearTimeout(timerOneRef.current);
    };
  }, [count, extra, amount, extraTime, finish, isRun, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      {count > 0 && (
        <Animated.Text
          style={[styles.countText, animatedStyle, count <= amount ? styles.regular : styles.extra]}
        >
          {count <= amount ? count : `+${extra}`}
        </Animated.Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: 140,
  },
  countText: {
    fontFamily: "HelveticaNow-Bold",
    fontSize: 80,
  },
  regular: {
    color: colors.text.body,
  },
  extra: {
    color: colors.state.orangeAccent,
  },
});

export default Counter;
