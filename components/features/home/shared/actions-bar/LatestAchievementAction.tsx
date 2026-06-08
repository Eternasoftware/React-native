import React from "react";
import { useIsCompactLayout } from "@/hooks/useIsCompactLayout";
import { View, Text, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import ActionCard from "@/components/features/home/shared/actions-bar/ActionCard";
import { Achievement } from "@/types/users.type";
import { LOCALIZATION_KEYS } from "@utils/constants/localization";
import useSettingsStore from "@/store/settingsStore";
import { PROFILE_SCREENS } from "@utils/constants/home";
import { colors } from "@/assets/styles/constants";
import { useShallow } from "zustand/react/shallow";

type Props = {
  lastAchievement: Achievement | undefined;
};

export default function LatestAchievementAction({ lastAchievement }: Props) {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

  const router = useRouter();
  const isCompact = useIsCompactLayout();

  return (
    <ActionCard
      onPress={() => {
        router.push(`${"/profile?linkTo=" + PROFILE_SCREENS.ACHIEVEMENTS}`);
      }}
      title={localization.t(LOCALIZATION_KEYS.TITLE_LATEST_ACHIEVEMENT)}
      flex={1.5}
      minWidth={200}
    >
      <View
        style={[styles.cardContent, isCompact ? styles.cardContentMobile : styles.cardContentWeb]}
      >
        {lastAchievement ? (
          <Image resizeMode="contain" source={{ uri: lastAchievement.image }} style={styles.img} />
        ) : (
          <Image
            resizeMode="contain"
            source={require("@images/common/default-achievement.png")}
            style={styles.img}
          />
        )}

        <Text numberOfLines={3} style={styles.title}>
          {lastAchievement
            ? localization.t(lastAchievement.title)
            : localization.t(LOCALIZATION_KEYS.TXT_NO_ACHIEVEMENT)}
        </Text>
      </View>
    </ActionCard>
  );
}

const styles = StyleSheet.create({
  cardContent: {
    flexDirection: "row",
    width: "100%",
    flex: 1,
    alignItems: "center",
    height: "100%",
  },
  cardContentWeb: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 16,
  },
  cardContentMobile: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 8,
  },
  img: {
    width: 73,
    height: 73,
    maxHeight: 73,
    maxWidth: 73,
    minHeight: 73,
    minWidth: 73,
  },
  title: {
    color: colors.text.body,
    fontFamily: "HelveticaNow-ExtraBold",
    fontSize: 14,
    flex: 1,
    textTransform: "uppercase",
  },
});
