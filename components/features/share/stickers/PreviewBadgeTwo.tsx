import React from "react";
import { View, Text, StyleSheet, StyleProp, ViewStyle, Image } from "react-native";
import { colors, withAlpha } from "@/assets/styles/constants";
import FitFlowLogo from "@/assets/icons/app/fitflow-logo.svg";
import FitFlowMark from "@/assets/icons/app/fitflow-mark.svg";
import useSettingsStore from "@/store/settingsStore";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import { useShallow } from "zustand/react/shallow";

type PreviewBadgeTwoProps = {
  badgeName: string;
  badgeImage: string;
  containerStyle?: StyleProp<ViewStyle>;
  resultColor?: string;
};

export default function PreviewBadgeTwo({
  badgeName,
  badgeImage,
  containerStyle,
  resultColor = colors.text.accent,
}: PreviewBadgeTwoProps) {
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
        <Text numberOfLines={2} style={[styles.previewTitle, styles.textShadow]}>
          {localization.t(LOCALIZATION_KEYS.TITLE_SHARE_BADGE_PREVIEW_TWO)}
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
          <Image
            source={{ uri: badgeImage }}
            style={{ width: 110, height: 110 }}
            resizeMode="cover"
          />
        </View>
        <View>
          <Text style={[styles.previewSubtitle, { color: resultColor }, styles.textShadow]}>
            {badgeName}
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
    textShadowRadius: 10,
  },
});
