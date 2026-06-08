import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import ActionCard from "@/components/features/home/shared/actions-bar/ActionCard";
import TrainingStreakCalendar from "@/components/features/home/shared/actions-bar/TrainingStreakCalendar";
import streakAPI from "@/utils/api/streak";
import { StreakResponse } from "@/types/streak.type";
import { LOCALIZATION_KEYS } from "@utils/constants/localization";
import useSettingsStore from "@/store/settingsStore";
import { useShallow } from "zustand/react/shallow";
import { colors, withAlpha } from "@/assets/styles/constants";

export default function TrainingStreakAction() {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

  const router = useRouter();
  const [streakData, setStreakData] = useState<StreakResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const data = await streakAPI.getStreak();
        setStreakData(data);
      } catch (error) {
        console.error("Failed to fetch streak data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStreak();
  }, []);

  const getMarkedDays = (): number[] => {
    if (!streakData) return [];

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    return streakData.activities
      .map((activity) => {
        const date = new Date(activity.activeDate);
        if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
          return date.getDate();
        }
        return null;
      })
      .filter((day): day is number => day !== null);
  };

  const getCurrentDay = (): number => {
    return new Date().getDate();
  };

  const getDaysInMonth = (): number => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getStreakCount = (): number => {
    return streakData?.currentStreak ?? 0;
  };

  return (
    <ActionCard
      onPress={() => {
        router.push("/training-streak");
      }}
      title={localization.t(LOCALIZATION_KEYS.TXT_TRAINING_STREAK)}
    >
      <View style={styles.content}>
        <TrainingStreakCalendar
          markedDays={getMarkedDays()}
          today={getCurrentDay()}
          daysInMonth={getDaysInMonth()}
        />

        <View style={styles.streak}>
          <Text style={styles.streakCount}>{getStreakCount()}</Text>
          <Text style={styles.streakLabel}>DAYS</Text>
        </View>

        <LinearGradient
          colors={[
            withAlpha(colors.overlay.gradient, 0),
            withAlpha(colors.overlay.gradient, 0.15),
            withAlpha(colors.overlay.gradient, 0.35),
            withAlpha(colors.overlay.gradient, 0.6),
            withAlpha(colors.overlay.gradient, 0.85),
            colors.overlay.gradient,
          ]}
          style={styles.fade}
          pointerEvents="none"
        />
      </View>
    </ActionCard>
  );
}

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
  },

  fade: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },

  streak: {
    width: 55,
    textAlign: "center",
    marginTop: 13,
  },

  streakCount: {
    textAlign: "center",
    fontWeight: "800",
    fontSize: 14,
    color: colors.text.inverse,
  },

  streakLabel: {
    textAlign: "center",
    fontWeight: "800",
    color: colors.text.body,
    fontSize: 14,
    marginTop: 2,
  },
});
