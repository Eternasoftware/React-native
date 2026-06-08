import { colors } from "@/assets/styles/constants";
import { useIsCompactLayout } from "@/hooks/useIsCompactLayout";
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Achievement } from "@/types/users.type";
import TrainingStreakAction from "@/components/features/home/shared/actions-bar/TrainingStreakAction";
import LatestAchievementAction from "@/components/features/home/shared/actions-bar/LatestAchievementAction";
import PointsAction from "@/components/features/home/shared/actions-bar/PointsAction";

type UserActionsBarProps = {
  points: number;
  lastAchievement: Achievement | undefined;
};

const UserActionsBar: React.FC<UserActionsBarProps> = ({ points, lastAchievement }) => {
  const isCompact = useIsCompactLayout();
  return (
    <View
      style={[styles.container, isCompact ? styles.blockHeightMobile : styles.blockHeightDesktop]}
    >
      <View style={styles.row}>
        <LatestAchievementAction lastAchievement={lastAchievement} />
        <PointsAction points={points} />
      </View>

      <View style={styles.row}>
        <TrainingStreakAction />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface.splash,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: "100%",
    gap: 8,
  },
  blockHeightMobile: {
    minHeight: 122,
  },
  blockHeightDesktop: {
    minHeight: 133,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});

export default React.memo(UserActionsBar);
