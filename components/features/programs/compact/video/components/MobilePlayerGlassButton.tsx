import React from "react";
import {
  Platform,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { SvgGradientBorder } from "@/components/common/SvgGradientBorder";
import { colors, withAlpha } from "@/assets/styles/constants";
import { mobilePlayerStyles as styles } from "../styles/videoPlayerMobile.styles";

type MobilePlayerGlassButtonProps = {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
  borderOpacities?: [number, number];
  children: React.ReactNode;
  withResponder?: boolean;
};

const GlassBackground = ({ borderRadius = 50 }: { borderRadius?: number }) =>
  Platform.OS === "android" ? (
    <LinearGradient
      colors={[
        withAlpha(colors.surface.overlay, 0.6),
        withAlpha(colors.surface.overlay, 0.2),
        withAlpha(colors.surface.overlay, 0.6),
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.blur, borderRadius !== 50 && { borderRadius }]}
    />
  ) : (
    <BlurView
      intensity={30}
      tint="dark"
      style={[
        styles.blur,
        borderRadius !== 50 && { borderRadius, left: borderRadius === 15 ? 0 : 1 },
      ]}
      experimentalBlurMethod="dimezisBlurView"
      blurReductionFactor={5}
    />
  );

export const MobilePlayerGlassButton: React.FC<MobilePlayerGlassButtonProps> = ({
  onPress,
  style,
  borderRadius = 50,
  borderOpacities = [0.4, 0.2],
  children,
  withResponder = true,
}) => {
  const content = (
    <>
      <GlassBackground borderRadius={borderRadius} />
      {children}
    </>
  );

  const borderStyle = StyleSheet.flatten(style) as ViewStyle | undefined;

  return (
    <SvgGradientBorder
      radius={borderRadius}
      strokeWidth={1}
      colors={[colors.neutral.divider, colors.surface.overlay]}
      opacities={borderOpacities}
      style={borderStyle}
    >
      {withResponder ? (
        <View
          onStartShouldSetResponder={() => true}
          onResponderTerminationRequest={() => false}
        >
          {onPress ? (
            <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={style}>
              {content}
            </TouchableOpacity>
          ) : (
            <View style={style}>{content}</View>
          )}
        </View>
      ) : onPress ? (
        <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={style}>
          {content}
        </TouchableOpacity>
      ) : (
        <View style={style}>{content}</View>
      )}
    </SvgGradientBorder>
  );
};
