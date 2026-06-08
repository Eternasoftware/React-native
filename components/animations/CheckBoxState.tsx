import React, { useEffect, useRef } from "react";
import { StyleSheet, TouchableOpacity, Animated } from "react-native";
import CheckFalse from "@icons/common/checkbox-false.svg";
import CheckTrue from "@icons/common/checkbox-true.svg";

type CheckBoxStateProps = {
  clickEvent?: boolean;
  value: boolean;
  onPress: () => void;
};

const CheckBoxState: React.FC<CheckBoxStateProps> = ({ clickEvent, value, onPress }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const isFirstRender = useRef(true);

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

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    handlePress();
  }, [clickEvent]);

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={handlePress} style={styles.iconContainer}>
      <Animated.View style={{ transform: [{ scale }] }}>
        {value ? <CheckTrue style={styles.icon} /> : <CheckFalse style={styles.icon} />}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconContainer: {},
  icon: {
    width: 20,
  },
});

export default CheckBoxState;
