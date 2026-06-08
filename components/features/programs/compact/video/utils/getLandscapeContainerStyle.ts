import { ViewStyle } from "react-native";

type LandscapeBox = {
  boxW: number;
  boxH: number;
  offsetX: number;
  offsetY: number;
};

export function getLandscapeContainerStyle(
  isHorizontal: boolean | null,
  { boxW, boxH, offsetX, offsetY }: LandscapeBox
): ViewStyle | undefined {
  if (isHorizontal !== true) return undefined;

  const canRotate =
    boxW &&
    boxH &&
    typeof offsetY === "number" &&
    typeof offsetX === "number" &&
    isFinite(offsetY) &&
    isFinite(offsetX);

  return {
    position: "absolute",
    width: boxW,
    maxWidth: boxW,
    minWidth: boxW,
    height: boxH,
    maxHeight: boxH,
    minHeight: boxH,
    top: offsetY,
    left: offsetX,
    ...(canRotate
      ? {
          transform: [{ rotate: "90deg" }],
          backfaceVisibility: "hidden",
          perspective: 1000,
        }
      : {}),
  };
}
