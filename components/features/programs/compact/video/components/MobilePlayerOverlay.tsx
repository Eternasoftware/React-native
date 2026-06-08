import React from "react";
import { Animated, Platform, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { colors, withAlpha } from "@/assets/styles/constants";
import { mobilePlayerStyles as styles } from "../styles/videoPlayerMobile.styles";

type MobilePlayerOverlayProps = {
  isShowControls: boolean;
  fadeAnim: Animated.Value;
  onOverlayPress: () => void;
};

export const MobilePlayerOverlay: React.FC<MobilePlayerOverlayProps> = ({
  isShowControls,
  fadeAnim,
  onOverlayPress,
}) => (
  <>
    {Platform.OS !== "ios" && isShowControls && (
      <TouchableOpacity
        style={styles.innerShadow}
        activeOpacity={1}
        onPress={onOverlayPress}
      >
        <Animated.View style={[styles.innerShadow, { opacity: fadeAnim, flex: 1 }]}>
          <LinearGradient
            colors={[
              withAlpha(colors.surface.overlay, 0),
              withAlpha(colors.surface.overlay, 0),
              withAlpha(colors.surface.overlay, 0),
              withAlpha(colors.surface.overlay, 0),
              colors.surface.overlay,
            ]}
            style={{ flex: 1 }}
          />
        </Animated.View>
      </TouchableOpacity>
    )}
    <BlurView intensity={50} tint="dark" style={styles.blurBackground} />
    <TouchableOpacity
      style={styles.touchOverlay}
      activeOpacity={1}
      onPress={onOverlayPress}
    />
  </>
);
