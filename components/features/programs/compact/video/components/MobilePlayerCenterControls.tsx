import React from "react";
import { Animated } from "react-native";
import PlayIcon from "@icons/player/play-white.svg";
import PauseIcon from "@icons/player/pause-white.svg";
import NextIcon from "@icons/player/next-15-white.svg";
import PrevIcon from "@icons/player/prev-15-white.svg";
import { MobilePlayerGlassButton } from "./MobilePlayerGlassButton";
import { mobilePlayerStyles as styles } from "../styles/videoPlayerMobile.styles";

type MobilePlayerCenterControlsProps = {
  isShowControls: boolean;
  isPlaying: boolean;
  fadeAnim: Animated.Value;
  onRewind: (forward: boolean) => void;
  onTogglePlayPause: () => void;
  onButtonPress: () => void;
};

export const MobilePlayerCenterControls: React.FC<MobilePlayerCenterControlsProps> = ({
  isShowControls,
  isPlaying,
  fadeAnim,
  onRewind,
  onTogglePlayPause,
  onButtonPress,
}) => {
  if (!isShowControls) return null;

  return (
    <Animated.View style={[{ opacity: fadeAnim }, styles.centerPanel]}>
      <MobilePlayerGlassButton
        style={styles.rewindButton}
        onPress={() => {
          onRewind(false);
          onButtonPress();
        }}
      >
        <PrevIcon />
      </MobilePlayerGlassButton>

      <MobilePlayerGlassButton
        style={styles.playButton}
        onPress={() => {
          onTogglePlayPause();
          onButtonPress();
        }}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </MobilePlayerGlassButton>

      <MobilePlayerGlassButton
        style={styles.rewindButton}
        onPress={() => {
          onRewind(true);
          onButtonPress();
        }}
      >
        <NextIcon />
      </MobilePlayerGlassButton>
    </Animated.View>
  );
};
