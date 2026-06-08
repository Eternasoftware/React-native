import React from "react";
import { View, Text, StyleSheet, StyleProp, ViewStyle, Image } from "react-native";
import { colors, withAlpha } from "@/assets/styles/constants";
import FitFlowLogo from "@/assets/icons/app/fitflow-logo.svg";
import FitFlowMark from "@/assets/icons/app/fitflow-mark.svg";
import useSettingsStore from "@/store/settingsStore";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import { useShallow } from "zustand/react/shallow";

type PreviewBadgeOneProps = {
  badgeName: string;
  badgeImage: string;
  containerStyle?: StyleProp<ViewStyle>;
};

export default function PreviewBadgeOne({
  badgeName,
  badgeImage,
  containerStyle,
}: PreviewBadgeOneProps) {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

  return (
    <View style={[styles.previewWorkoutOneContainer, containerStyle]}>
      <Text style={[styles.previewTitle, styles.textShadow]}>
        {localization.t(LOCALIZATION_KEYS.TITLE_SHARE_BADGE_PREVIEW_ONE)}
      </Text>
      <View style={{ gap: 19, alignItems: "center" }}>
        <Image
          source={{ uri: badgeImage }}
          style={{ width: 110, height: 110 }}
          resizeMode="cover"
        />
        <View>
          <Text style={[styles.previewSubtitle, styles.textShadow]}>{badgeName}</Text>
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
    fontSize: 12,
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
