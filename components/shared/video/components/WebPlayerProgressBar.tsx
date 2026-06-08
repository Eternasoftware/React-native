import React from "react";
import { Text, View } from "react-native";
import Slider from "@react-native-community/slider";
import { colors } from "@/assets/styles/constants";
import { webPlayerStyles as styles } from "../styles/videoPlayer.styles";

type WebPlayerProgressBarProps = {
  progress: number;
  currTime: string;
  duration: string;
  onSlidingStart: () => void;
  onSlidingComplete: (value: number) => void;
};

export const WebPlayerProgressBar: React.FC<WebPlayerProgressBarProps> = ({
  progress,
  currTime,
  duration,
  onSlidingStart,
  onSlidingComplete,
}) => (
  <>
    <Slider
      style={styles.slider}
      value={progress}
      onSlidingComplete={onSlidingComplete}
      onSlidingStart={onSlidingStart}
      minimumTrackTintColor={colors.action.primary}
      maximumTrackTintColor={colors.neutral.gray700}
      thumbTintColor={colors.text.inverse}
    />
    <View style={styles.timePanel}>
      <Text style={styles.time}>{currTime}</Text>
      <Text style={styles.time}>{duration}</Text>
    </View>
  </>
);
