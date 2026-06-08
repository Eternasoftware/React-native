import { Platform, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function useLandscapeBox() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const androidVersion = Platform.OS === "android" ? Platform.Version : 0;

  const shouldSubtractInsets = Platform.OS === "android" && androidVersion >= 30;

  const offsetX = (width - height + (insets.top + insets.bottom)) / 2;
  const offsetY =
    shouldSubtractInsets || Platform.OS === "ios"
      ? (height - width - (insets.top + insets.bottom)) / 2
      : (height - width) / 2;

  return {
    boxW: height - insets.top - insets.bottom,
    boxH: width,
    offsetX,
    offsetY,
  };
}
