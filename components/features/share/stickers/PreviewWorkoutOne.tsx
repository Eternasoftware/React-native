import React from "react";
import { View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { colors, withAlpha } from "@/assets/styles/constants";
import FitFlowLogo from "@/assets/icons/app/fitflow-logo.svg";
import FitFlowMark from "@/assets/icons/app/fitflow-mark.svg";
import { formatTime } from "@/utils/functions";
import useSettingsStore from "@/store/settingsStore";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import { useShallow } from "zustand/react/shallow";

type PreviewWorkoutOneProps = {
  programName: string;
  workoutName: string;
  duration: number;
  containerStyle?: StyleProp<ViewStyle>;
};

export default function PreviewWorkoutOne({
  programName,
  workoutName,
  duration,
  containerStyle,
}: PreviewWorkoutOneProps) {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

  return (
    <View style={[styles.previewWorkoutOneContainer, containerStyle]}>
      <Text style={[styles.previewTitle, styles.textShadow]}>
        {localization.t(LOCALIZATION_KEYS.TITLE_SHARE_WORKOUT_PREVIEW_ONE)}
      </Text>
      <View style={{ gap: 16 }}>
        <View
          style={{
            flexDirection: "row",
            gap: 16,
            justifyContent: "space-around",
          }}
        >
          <View style={{ flexDirection: "column", gap: 11, maxWidth: "50%" }}>
            <Text style={[styles.previewSubtitle, styles.textShadow]}>
              {localization.t(LOCALIZATION_KEYS.TITLE_SHARE_PREVIEW_PROGRAM)}
            </Text>
            <Text style={[styles.previewText, styles.textShadow]}>{programName}</Text>
          </View>
          <View style={{ flexDirection: "column", gap: 11, maxWidth: "50%" }}>
            <Text style={[styles.previewSubtitle, styles.textShadow]}>
              {localization.t(LOCALIZATION_KEYS.TITLE_SHARE_PREVIEW_WORKOUT)}
            </Text>
            <Text style={[styles.previewText, styles.textShadow]}>{workoutName}</Text>
          </View>
        </View>
        <View style={{ flexDirection: "column", gap: 11 }}>
          <Text style={[styles.previewSubtitle, styles.textShadow]}>
            {localization.t(LOCALIZATION_KEYS.TITLE_SHARE_PREVIEW_DURATION)}
          </Text>
          <Text style={[styles.previewText, { fontSize: 18 }, styles.textShadow]}>
            {formatTime(duration)}
          </Text>
        </View>
      </View>
      <View style={styles.fitflowLogo}>
        <FitFlowLogo width={61} height={17} />
        <FitFlowMark width={110} height={17} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  previewWorkoutOneContainer: {
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 39,
    margin: "auto",
    width: "100%",
    gap: 16,
    height: "100%",
    justifyContent: "space-between",
    maxWidth: 310,
  },
  previewTitle: {
    fontFamily: "Poppins-BlackItalic",
    fontSize: 16,
    color: colors.text.accent,
    textTransform: "uppercase",
    textAlign: "center",
  },
  previewSubtitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 10,
    color: colors.text.accent,
    textTransform: "uppercase",
    textAlign: "center",
  },
  previewText: {
    fontFamily: "Poppins-SemiBoldItalic",
    fontSize: 13,
    color: colors.text.accent,
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
