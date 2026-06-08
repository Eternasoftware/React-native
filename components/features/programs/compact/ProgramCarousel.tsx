import React, { useEffect } from "react";
import { View, StyleSheet, FlatList, Text, TouchableOpacity } from "react-native";
import { WorkoutType, ProgramType } from "@/types/program.type";
import { colors } from "@/assets/styles/constants";

import ArrowRightIcon from "@icons/common/arrow-right.svg";
import WorkoutCardA from "@/components/features/programs/shared/WorkoutCardA";
import useSettingsStore from "@/store/settingsStore";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import { useShallow } from "zustand/react/shallow";
type ProgramCarouselProps = {
  program: ProgramType;
  openProgram: () => void;
  startWorkout: (program: ProgramType, workout: WorkoutType) => void;
};

const ProgramCarousel: React.FC<ProgramCarouselProps> = ({
  program,
  openProgram,
  startWorkout,
}) => {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{localization.t(program.title)}</Text>
        <TouchableOpacity style={styles.titleSeeAllBtn} onPress={openProgram} activeOpacity={0.7}>
          <Text style={styles.titleSeeAllText}>
            {localization.t(LOCALIZATION_KEYS.BTN_SEE_ALL)}
          </Text>
          <ArrowRightIcon />
        </TouchableOpacity>
      </View>
      <FlatList
        data={program.workouts}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => startWorkout(program, item)}
            activeOpacity={0.7}
            key={item.guid}
          >
            <WorkoutCardA
              workout={item}
              showIsFavorites={false}
              showDuration={!program.isHack}
              onPress={() => startWorkout(program, item)}
              key={item.guid}
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.guid}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  titleContainer: {
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center",
  },
  title: {
    flex: 1,
    flexWrap: "wrap",
    marginRight: 10,
    fontFamily: "NeueBit-Bold",
    color: colors.text.accent,
    fontSize: 28,
  },
  titleSeeAllText: {
    fontFamily: "Poppins-Medium",
    color: colors.text.body,
    fontSize: 12,
    lineHeight: 16,
  },
  titleSeeAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  list: {
    gap: 8,
    flexDirection: "row",
  },
});

export default ProgramCarousel;
