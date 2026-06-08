import { useEffect } from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSharedValue, withTiming } from "react-native-reanimated";
import * as ScreenOrientation from "expo-screen-orientation";

type UseShellInsetsParams = {
  orientation: ScreenOrientation.OrientationLock;
  isFullScreen: boolean;
};

export function useShellInsets({ orientation, isFullScreen }: UseShellInsetsParams) {
  const insets = useSafeAreaInsets();
  const paddingTop = useSharedValue(insets.top);
  const paddingBottom = useSharedValue(Platform.OS === "ios" ? 0 : insets.bottom);
  const paddingLeft = useSharedValue(insets.left);
  const paddingRight = useSharedValue(insets.right);

  useEffect(() => {
    paddingTop.value = withTiming(insets.top, { duration: 150 });
    paddingBottom.value = withTiming(0, { duration: 150 });
    paddingLeft.value = withTiming(insets.left, { duration: 150 });
    paddingRight.value = withTiming(insets.right, { duration: 150 });
  }, [orientation, insets, isFullScreen]);

  return {
    insets,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
  };
}
