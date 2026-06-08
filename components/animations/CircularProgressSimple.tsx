import React, { useEffect, useRef } from "react";
import { View, Animated, Easing } from "react-native";
import { colors } from "@/assets/styles/constants";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
type CircularProgressSimpleProps = {
  size?: number;
  strokeWidth?: number;
  percentageComplete: number;
};

const CircularProgressSimple: React.FC<CircularProgressSimpleProps> = ({
  size = 310,
  strokeWidth = 37,
  percentageComplete = 100,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const circumference = 2 * Math.PI * ((size - strokeWidth) / 2);
  const halfSize = size / 2;
  const radius = halfSize - strokeWidth / 2;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: percentageComplete,
      duration: 1000,
      useNativeDriver: false,
      easing: Easing.linear,
    }).start();
  }, [percentageComplete]);

  const [strokeDashoffset, setStrokeDashoffset] = React.useState(circumference);

  useEffect(() => {
    const listener = animatedValue.addListener(({ value }) => {
      const newOffset = circumference - (circumference * value) / 100;
      setStrokeDashoffset(newOffset);
    });

    return () => {
      animatedValue.removeListener(listener);
    };
  }, [animatedValue, circumference]);

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <LinearGradient id="grad" x1={`50%`} y1={`0%`} x2={`100%`} y2={`0%`}>
            <Stop offset="0%" stopColor={colors.state.orange} />
            <Stop offset="100%" stopColor={colors.action.primary} />
          </LinearGradient>
          <LinearGradient id="grad1" x1={`50%`} y1={`0%`} x2={`100%`} y2={`0%`}>
            <Stop offset="0%" stopColor={colors.action.primary} />
            <Stop offset="100%" stopColor={colors.action.primary} />
          </LinearGradient>
        </Defs>

        <Circle
          cx={halfSize}
          cy={halfSize}
          r={radius}
          stroke={colors.surface.card}
          strokeWidth={strokeWidth}
          fill="none"
        />

        <Circle
          cx={halfSize}
          cy={halfSize}
          r={radius}
          stroke="url(#grad1)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${halfSize} ${halfSize})`}
        />
        <Circle
          cx={halfSize}
          cy={halfSize}
          r={radius}
          stroke="url(#grad)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${halfSize} ${halfSize})`}
        />
      </Svg>
    </View>
  );
};

export default CircularProgressSimple;
