import { colors } from "@/assets/styles/constants";

import useSettingsStore from "@/store/settingsStore";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import React, { useState, useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet, Easing } from "react-native";
import { useShallow } from "zustand/react/shallow";

type CountdownProps = {
  amount?: number;
  finish: () => void;
};

const Countdown: React.FC<CountdownProps> = ({ amount = 3, finish }) => {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

  const [count, setCount] = useState(amount);
  const fontSize = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (count >= 0) {
      animateFontSize();
      const timer = setTimeout(() => {
        setCount(count - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      finish();
    }
  }, [count, finish]);

  const animateFontSize = () => {
    if (!fontSize || typeof fontSize.setValue !== "function") {
      return;
    }

    try {
      fontSize.setValue(1);
      Animated.sequence([
        Animated.timing(fontSize, {
          toValue: 80,
          duration: 150,
          useNativeDriver: false,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(fontSize, {
          toValue: 80,
          duration: 550,
          useNativeDriver: false,
        }),
        Animated.timing(fontSize, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
          easing: Easing.out(Easing.ease),
        }),
      ]).start();
    } catch (error) {
      console.warn("CountDown animation error:", error);
    }
  };

  return (
    <View style={styles.container}>
      {count >= 0 && (
        <Animated.Text
          style={[
            styles.countText,
            {
              fontSize: fontSize && typeof fontSize === "object" ? fontSize : 60,
            },
          ]}
        >
          {count ? count : localization.t(LOCALIZATION_KEYS.TXT_COUNT_GO)}
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
    color: colors.text.accent,
  },
});

export default Countdown;
