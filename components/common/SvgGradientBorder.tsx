import React, { useState } from "react";
import { View, StyleSheet, LayoutChangeEvent, ViewStyle } from "react-native";
import { colors as themeColors } from "@/assets/styles/constants";
import Svg, { Defs, LinearGradient as SvgGradient, Stop, Rect } from "react-native-svg";

type StopDef = { offset?: number; color: string; opacity?: number };

type Props = {
  radius?: number;
  strokeWidth?: number;
  colors?: string[];
  opacities?: number[];
  offsets?: number[];
  stops?: StopDef[];
  gradientFrom?: { x: number; y: number };
  gradientTo?: { x: number; y: number };
  strokeOpacity?: number;
  backgroundColor?: string;
  style?: ViewStyle;
  children?: React.ReactNode;
};

export function SvgGradientBorder({
  radius = 14,
  strokeWidth = 3,
  colors = [themeColors.text.inverse, themeColors.surface.overlay],
  opacities,
  offsets,
  stops,
  gradientFrom = { x: 1, y: 0 },
  gradientTo = { x: 0, y: 1 },
  strokeOpacity = 1,
  backgroundColor = "transparent",
  style,
  children,
}: Props) {
  const [box, setBox] = useState({ w: 0, h: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== box.w || height !== box.h) setBox({ w: width, h: height });
  };

  const builtStops: Required<StopDef>[] = React.useMemo(() => {
    if (stops && stops.length) {
      const withDefaults = stops.map((s, i) => ({
        color: s.color,
        opacity: s.opacity ?? 1,
        offset: s.offset ?? (stops.length === 1 ? 0 : i / Math.max(stops.length - 1, 1)),
      }));
      return withDefaults as Required<StopDef>[];
    }
    const n = colors.length;
    return colors.map((c, i) => ({
      color: c,
      opacity: opacities?.[i] ?? 1,
      offset: offsets?.[i] ?? (n === 1 ? 0 : i / (n - 1)),
    })) as Required<StopDef>[];
  }, [stops, colors, opacities, offsets]);

  return (
    <View style={[styles.wrapper, style]}>
      <View
        collapsable={false}
        onLayout={onLayout}
        style={{
          borderRadius: radius,
          backgroundColor,
          overflow: "hidden",
          zIndex: 1,
        }}
      >
        {children}
      </View>

      {box.w > 0 && box.h > 0 && (
        <Svg
          pointerEvents="none"
          style={StyleSheet.absoluteFill}
          width="100%"
          height="100%"
          viewBox={`0 0 ${box.w} ${box.h}`}
        >
          <Defs>
            <SvgGradient
              id="grad"
              x1={String(gradientFrom.x)}
              y1={String(gradientFrom.y)}
              x2={String(gradientTo.x)}
              y2={String(gradientTo.y)}
            >
              {builtStops.map((s, i) => (
                <Stop
                  key={i}
                  offset={String(Math.max(0, Math.min(1, s.offset)))}
                  stopColor={s.color}
                  stopOpacity={s.opacity}
                />
              ))}
            </SvgGradient>
          </Defs>

          <Rect
            x={strokeWidth / 2}
            y={strokeWidth / 2}
            width={box.w - strokeWidth}
            height={box.h - strokeWidth}
            rx={radius}
            ry={radius}
            stroke="url(#grad)"
            strokeWidth={strokeWidth}
            strokeOpacity={strokeOpacity}
            fill="transparent"
          />
        </Svg>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: "relative" },
});
