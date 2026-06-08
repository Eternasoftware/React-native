import { TouchableOpacity, StyleSheet, View } from "react-native";
import { SvgProps } from "react-native-svg";
import { Route } from "./TabBar";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useEffect } from "react";
import { colors } from "@/assets/styles/constants";

type TabBarItemProps = {
  route: Route;
  isFocused: boolean;
  onPress: () => void;
  tabWidth: number;
  InactiveIcon: React.FC<SvgProps>;
  ActiveIcon: React.FC<SvgProps>;
};

export default function TabBarItem({
  route,
  isFocused,
  onPress,
  tabWidth,
  InactiveIcon,
  ActiveIcon,
}: TabBarItemProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = isFocused ? 1 : 0;
  }, [isFocused]);

  const animatedLabelStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 1],
      [colors.text.inverse, colors.surface.overlay]
    );
    return { color };
  });

  const inactiveIconStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
  }));
  const activeIconStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  return (
    <TouchableOpacity
      key={route.key}
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      style={[styles.tab, { width: tabWidth }]}
      onPress={onPress}
      activeOpacity={1}
    >
      <View style={styles.iconContainer}>
        <Animated.View style={[styles.iconWrapper, inactiveIconStyle]}>
          <InactiveIcon width={20} height={20} />
        </Animated.View>
        <Animated.View style={[styles.iconWrapper, activeIconStyle]}>
          <ActiveIcon width={20} height={20} />
        </Animated.View>
      </View>
      <Animated.Text style={[animatedLabelStyle, styles.label]}>{route.label}</Animated.Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tab: {
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  iconWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  iconContainer: {
    width: 20,
    height: 20,
    position: "relative",
  },
  label: {
    fontSize: 12,
    marginTop: 2,
    color: colors.text.inverse,
    fontWeight: "600",
  },
});
