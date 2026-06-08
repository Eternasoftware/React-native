import React from "react";
import { Animated, Text, View } from "react-native";
import Slider from "@react-native-community/slider";
import { formatTime } from "@/utils/functions";
import { colors } from "@/assets/styles/constants";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
type LocalizationService = {
  t: (key: string) => string;
};
import { MobilePlayerGlassButton } from "./MobilePlayerGlassButton";
import { mobilePlayerStyles as styles } from "../styles/videoPlayerMobile.styles";

type MobilePlayerBottomPanelProps = {
  isShowControls: boolean;
  fadeAnim: Animated.Value;
  localization: LocalizationService;
  programTitle: string;
  workoutTitle: string;
  progress: number;
  currTime: number;
  duration: number;
  onSkip: () => void;
  onSlidingStart: () => void;
  onSlidingComplete: (value: number) => void;
};

export const MobilePlayerBottomPanel: React.FC<MobilePlayerBottomPanelProps> = ({
  isShowControls,
  fadeAnim,
  localization,
  programTitle,
  workoutTitle,
  progress,
  currTime,
  duration,
  onSkip,
  onSlidingStart,
  onSlidingComplete,
}) => (
  <Animated.View style={[styles.controlsContainer, { opacity: fadeAnim }]}>
    {isShowControls && (
      <>
        <View style={styles.infoPanel}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title} numberOfLines={4}>
              {localization.t(programTitle)}
            </Text>
            <Text style={styles.subTitle} numberOfLines={4}>
              {localization.t(workoutTitle)}
            </Text>
          </View>
          <View style={{ gap: 12 }}>
            <MobilePlayerGlassButton
              borderRadius={15}
              borderOpacities={[1, 0.2]}
              onPress={onSkip}
              style={styles.skipButton}
              withResponder={false}
            >
              <Text style={styles.skipText}>
                {localization.t(LOCALIZATION_KEYS.BTN_SKIP_VIDEO)}
              </Text>
            </MobilePlayerGlassButton>
            <View style={styles.timePanel}>
              <Text style={styles.time}>
                {`${formatTime(currTime)} / ${formatTime(duration)}`}
              </Text>
            </View>
          </View>
        </View>

        <Slider
          style={styles.slider}
          value={progress}
          onSlidingComplete={onSlidingComplete}
          onSlidingStart={onSlidingStart}
          minimumTrackTintColor={colors.text.inverse}
          maximumTrackTintColor={colors.alpha.divider40}
          thumbTintColor={colors.text.inverse}
        />
      </>
    )}
  </Animated.View>
);
