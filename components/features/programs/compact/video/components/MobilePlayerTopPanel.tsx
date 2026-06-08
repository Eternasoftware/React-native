import React from "react";
import { Animated, Platform, Pressable, View } from "react-native";
import ArrowBack from "@icons/common/arrow-back.svg";
import CloseIcon from "@icons/common/close-white.svg";
import { colors } from "@/assets/styles/constants";
import { AirPlayButton, CastButton } from "../utils/castPlatform";
import { MobilePlayerGlassButton } from "./MobilePlayerGlassButton";
import { mobilePlayerStyles as styles } from "../styles/videoPlayerMobile.styles";

type MobilePlayerTopPanelProps = {
  isShowControls: boolean;
  isBackButton: boolean;
  fadeAnim: Animated.Value;
  onBack: () => void;
  onOverlayPress: () => void;
  onButtonPress: () => void;
};

export const MobilePlayerTopPanel: React.FC<MobilePlayerTopPanelProps> = ({
  isShowControls,
  isBackButton,
  fadeAnim,
  onBack,
  onOverlayPress,
  onButtonPress,
}) => {
  if (!isShowControls) return null;

  const handleBack = () => {
    onBack();
    onButtonPress();
  };

  return (
    <Pressable onPress={onOverlayPress} style={styles.topPanelPressable}>
      <Animated.View
        style={[
          {
            opacity: fadeAnim,
            justifyContent: isBackButton ? "space-between" : "flex-end",
          },
          styles.topPanel,
        ]}
      >
        {isBackButton && (
          <View style={styles.topPanelPart}>
            <MobilePlayerGlassButton onPress={handleBack} style={styles.topPanelButton}>
              <ArrowBack style={{ width: 24, height: 24 }} />
            </MobilePlayerGlassButton>
          </View>
        )}

        <View style={styles.topPanelPart}>
          <MobilePlayerGlassButton style={styles.topPanelButton} withResponder={false}>
            {Platform.OS === "android" && CastButton && (
              <CastButton style={{ width: 40, height: 40 }} />
            )}
            {Platform.OS === "ios" && (
              <AirPlayButton style={{ width: 40, height: 40 }} tintColor={colors.text.inverse} />
            )}
          </MobilePlayerGlassButton>

          {!isBackButton && (
            <MobilePlayerGlassButton onPress={handleBack} style={styles.topPanelButton}>
              <CloseIcon style={{ width: 24, height: 24 }} />
            </MobilePlayerGlassButton>
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
};
