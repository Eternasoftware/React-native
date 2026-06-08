import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import NavHeader from "@/components/shared/NavHeader";
import { colors } from "@/assets/styles/constants";
import TrainingStreakCalendar from "@/components/features/home/shared/actions-bar/TrainingStreakCalendar";
import streakAPI from "@/utils/api/streak";
import { StreakResponse } from "@/types/streak.type";
import { LOCALIZATION_KEYS } from "@utils/constants/localization";
import useSettingsStore from "@/store/settingsStore";
import { useShallow } from "zustand/react/shallow";

export default function TrainingStreakPage() {
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
        const data = await streakAPI.getStreak(1, 100);
        setStreakData(data);
      } catch (error) {
        console.error("Failed to fetch streak data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStreak();
  }, []);

  const getMonths = () => {
    const months = [];
    const now = new Date();

    for (let i = 0; i < 3; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const monthName = date.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });
      const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      const year = date.getFullYear();
      const month = date.getMonth();

      const markedDays =
        streakData?.activities
          .map((activity) => {
            const activityDate = new Date(activity.activeDate);
            if (activityDate.getMonth() === month && activityDate.getFullYear() === year) {
              return activityDate.getDate();
            }
            return null;
          })
          .filter((day): day is number => day !== null) || [];

      const today = i === 0 ? now.getDate() : undefined;

      months.push({
        name: monthName,
        daysInMonth,
        year,
        month,
        markedDays,
        today,
      });
    }

    return months;
  };

  const months = getMonths();

  return (
    <View style={styles.container}>
      <NavHeader
        text={localization.t(LOCALIZATION_KEYS.TXT_TRAINING_STREAK)}
        onBack={() => router.push("/")}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.stats}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>CURRENT STREAK</Text>
            <Text style={styles.statValue}>{streakData?.currentStreak ?? 0} Days</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>LONGEST STREAK</Text>
            <Text style={styles.statValue}>{streakData?.longestStreak ?? 0} Days</Text>
          </View>
        </View>

        <View style={styles.calendarSection}>
          {months.map((month, index) => (
            <View key={index} style={styles.monthBlock}>
              <Text style={styles.monthTitle}>{month.name}</Text>
              <TrainingStreakCalendar
                daysInMonth={month.daysInMonth}
                markedDays={month.markedDays}
                today={month.today}
              />
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.app,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  stats: {
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: colors.surface.box,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.text.body,
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.action.primary,
  },
  calendarSection: {
    gap: 20,
    alignItems: "center",
  },
  monthBlock: {
    alignItems: "center",
  },
  monthTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text.body,
    marginBottom: 15,
    marginLeft: 12,
    alignSelf: "flex-start",
  },
});
