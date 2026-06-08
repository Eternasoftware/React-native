import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/assets/styles/constants";

type Props = {
  markedDays?: number[];
  today?: number;
  daysInMonth?: number;
};

const SIZE = 36;

export default function TrainingStreakCalendar({
  markedDays = [],
  today = 0,
  daysInMonth = 31,
}: Props) {
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <View style={styles.calendarWrapper}>
      <View style={styles.grid}>
        {days.map((day) => {
          const isMarked = markedDays.includes(day);
          const isMissed = !isMarked && day < today;
          const isToday = day === today;

          return (
            <View
              key={day}
              style={[styles.day, isMarked && styles.marked, isToday && !isMarked && styles.today]}
            >
              <Text
                style={[
                  styles.defaultText,
                  (isMarked || isToday) && styles.markedText,
                  isMissed && styles.inactiveText,
                ]}
              >
                {day}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  calendarWrapper: {
    position: "relative",
    maxWidth: 7 * (SIZE + 8),
    marginLeft: 12,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 12,
    columnGap: 22,
  },

  day: {
    width: 21,
    height: 21,
    borderRadius: SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },

  marked: {
    backgroundColor: colors.accent.highlight,
  },

  today: {
    backgroundColor: colors.text.inverse,
    color: colors.text.inverse,
  },

  markedText: {
    fontWeight: "600",
    color: colors.surface.overlay,
  },

  inactiveText: {
    fontWeight: "600",
    color: colors.text.inverse,
  },

  defaultText: {
    fontWeight: "300",
    color: colors.text.body,
    textAlign: "center",
  },
});
