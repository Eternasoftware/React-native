import React, { useRef, useEffect } from "react";
import { Animated, Easing, EasingFunction, ViewStyle } from "react-native";

type SlideUpAppearProps = {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  easing?: EasingFunction;
  containerStyle?: ViewStyle;
  action?: () => void;
};

const SlideUpAppear: React.FC<SlideUpAppearProps> = ({
  children,
  delay = 0,
  duration = 500,
  easing = Easing.out(Easing.ease),
  containerStyle,
  action,
}) => {
  const slideAnim = useRef(new Animated.Value(100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration,
        delay,
        easing,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration,
        delay,
        easing,
        useNativeDriver: true,
      }),
    ]);

    animation.start(action);
  }, [action, delay, duration, easing, opacityAnim, slideAnim]);

  return (
    <Animated.View
      style={[
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
        containerStyle,
      ]}
    >
      {children}
    </Animated.View>
  );
};

export default SlideUpAppear;
