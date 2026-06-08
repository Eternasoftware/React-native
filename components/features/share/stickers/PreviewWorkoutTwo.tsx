import React from "react";
import { View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { colors, withAlpha } from "@/assets/styles/constants";
import FitFlowLogo from "@/assets/icons/app/fitflow-logo.svg";
import FitFlowMark from "@/assets/icons/app/fitflow-mark.svg";
import { formatTime } from "@/utils/functions";
import useSettingsStore from "@/store/settingsStore";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import { useShallow } from "zustand/react/shallow";

type PreviewWorkoutTwoProps = {
  programName: string;
  workoutName: string;
  duration: number;
  containerStyle?: StyleProp<ViewStyle>;
  resultColor?: string;
};

export default function PreviewWorkoutTwo({
  programName,
  workoutName,
  duration,
  containerStyle,
  resultColor = colors.text.accent,
}: PreviewWorkoutTwoProps) {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

  return (
    <View style={[styles.previewWorkoutContainer, containerStyle]}>
      <View style={{ gap: 24 }}>
        <View style={styles.fitflowLogo}>
          <FitFlowLogo width={61} height={17} />
          <FitFlowMark width={110} height={17} />
        </View>
        <Text style={[styles.previewTitle, styles.textShadow]}>
          {localization.t(LOCALIZATION_KEYS.TITLE_SHARE_WORKOUT_PREVIEW_TWO)}
        </Text>
      </View>

      <View style={{ gap: 16 }}>
        <View
          style={{
            flexDirection: "row",
            gap: 24,
            justifyContent: "center",
          }}
        >
          <View style={{ flexDirection: "column", maxWidth: "45%" }}>
            <Text style={[styles.previewSubtitle, { color: resultColor }, styles.textShadow]}>
              {localization.t(LOCALIZATION_KEYS.TITLE_SHARE_PREVIEW_PROGRAM)}
            </Text>
            <Text style={[styles.previewText, { color: resultColor }, styles.textShadow]}>
              {programName}
            </Text>
          </View>
          <View style={{ flexDirection: "column", maxWidth: "45%" }}>
            <Text style={[styles.previewSubtitle, { color: resultColor }, styles.textShadow]}>
              {localization.t(LOCALIZATION_KEYS.TITLE_SHARE_PREVIEW_WORKOUT)}
            </Text>
            <Text style={[styles.previewText, { color: resultColor }, styles.textShadow]}>
              {workoutName}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "column" }}>
          <Text style={[styles.previewSubtitle, { color: resultColor }, styles.textShadow]}>
            {localization.t(LOCALIZATION_KEYS.TITLE_SHARE_PREVIEW_DURATION)}
          </Text>
          <Text
            style={[styles.previewText, { fontSize: 18, color: resultColor }, styles.textShadow]}
          >
            {formatTime(duration)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  previewWorkoutContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    margin: "auto",
    width: "100%",
    gap: 16,
    height: "100%",
    maxWidth: 310,
  },
  previewTitle: {
    fontFamily: "Poppins-BlackItalic",
    fontSize: 18,
    color: colors.text.accent,
    textTransform: "uppercase",
    textAlign: "center",
  },
  previewSubtitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 8,
    color: colors.text.onLight,
    textTransform: "uppercase",
    textAlign: "center",
  },
  previewText: {
    fontFamily: "Poppins-SemiBoldItalic",
    fontSize: 12,
    color: colors.text.onLight,
    textTransform: "uppercase",
    textAlign: "center",
  },
  fitflowLogo: {
    flexDirection: "column",
    marginHorizontal: "auto",
  },
  textShadow: {
    textShadowColor: withAlpha(colors.surface.overlay, 0.25),
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
