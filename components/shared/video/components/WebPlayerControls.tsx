import React from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import PlayIcon from "@icons/player/play.svg";
import PauseIcon from "@icons/player/pause.svg";
import NextIcon from "@icons/player/next-15-sec.svg";
import PrevIcon from "@icons/player/prev-15-sec.svg";
import FullscreenModeOnIcon from "@icons/player/fullscreen-mode-on.svg";
import FullscreenModeOffIcon from "@icons/player/fullscreen-mode-off.svg";
import { colors } from "@/assets/styles/constants";
import { AirPlayButton, CastButton } from "../utils/castPlatform";
import { webPlayerStyles as styles } from "../styles/videoPlayer.styles";

type WebPlayerControlsProps = {
  isPlaying: boolean;
  isFullScreen: boolean;
  onRewind: (forward: boolean) => void;
  onTogglePlayPause: () => void;
  onChangeMode: () => void;
};

export const WebPlayerControls: React.FC<WebPlayerControlsProps> = ({
  isPlaying,
  isFullScreen,
  onRewind,
  onTogglePlayPause,
  onChangeMode,
}) => (
  <View style={styles.controlsPanel}>
    <View style={styles.leftPanel}>
      {Platform.OS === "android" && CastButton && (
        <CastButton style={{ width: 40, height: 40 }} />
      )}
      {Platform.OS === "ios" && (
        <AirPlayButton style={{ width: 40, height: 40 }} tintColor={colors.text.inverse} />
      )}
    </View>

    <View style={styles.centerPanel}>
      <TouchableOpacity activeOpacity={0.7} onPress={() => onRewind(false)}>
        <PrevIcon />
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.7} onPress={onTogglePlayPause}>
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.7} onPress={() => onRewind(true)}>
        <NextIcon />
      </TouchableOpacity>
    </View>

    <View style={styles.rightPanel}>
      <TouchableOpacity activeOpacity={0.7} onPress={onChangeMode}>
        {isFullScreen ? (
          <FullscreenModeOffIcon style={{ width: 40 }} />
        ) : (
          <FullscreenModeOnIcon style={{ width: 40 }} />
        )}
      </TouchableOpacity>
    </View>
  </View>
);
