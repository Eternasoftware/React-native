import React from "react";
import { useIsCompactLayout } from "@/hooks/useIsCompactLayout";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import ActionCard from "@/components/features/home/shared/actions-bar/ActionCard";
import { LOCALIZATION_KEYS } from "@utils/constants/localization";
import useSettingsStore from "@/store/settingsStore";
import { colors } from "@/assets/styles/constants";
import { useShallow } from "zustand/react/shallow";

type Props = {
  points: number;
};

export default function PointsAction({ points }: Props) {
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
        router.push("/profile");
      }}
      title={localization.t(LOCALIZATION_KEYS.TITLE_POINTS)}
      flex={1}
      minWidth={120}
    >
      <View
        style={[
          styles.cardPointContent,
          isCompact ? styles.cardHeaderMobile : styles.cardHeaderWeb,
        ]}
      >
        <Text style={styles.points}>{points}</Text>
        <Text style={styles.subTitle}>
          {localization.t(LOCALIZATION_KEYS.TXT_ACCUMULATED_POINTS)}
        </Text>
      </View>
    </ActionCard>
  );
}

const styles = StyleSheet.create({
  cardPointContent: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  cardHeaderWeb: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  cardHeaderMobile: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  points: {
    color: colors.text.body,
    fontFamily: "HelveticaNow-Black",
    fontSize: 32,
    flex: 1,
    textTransform: "uppercase",
  },
  subTitle: {
    color: colors.text.body,
    fontFamily: "HelveticaNow-ExtraBold",
    fontSize: 12,
    flex: 1,
    textTransform: "uppercase",
    textAlign: "center",
  },
});
