import React from "react";
import { View } from "react-native";
import WorkoutCardA from "@/components/features/programs/shared/WorkoutCardA";
import { ProgramType, WorkoutType } from "@/types/program.type";
import { programDetailStyles as styles } from "../styles/programDetail.styles";

type ProgramDetailWorkoutGridProps = {
  program: ProgramType;
  onStartWorkout: (program: ProgramType, workout: WorkoutType) => void;
};

export const ProgramDetailWorkoutGrid: React.FC<ProgramDetailWorkoutGridProps> = ({
  program,
  onStartWorkout,
}) => (
  <View style={styles.list}>
    {program.workouts.map((item) => (
      <WorkoutCardA
        key={item.guid}
        workout={item}
        showIsFavorites={true}
        containerStyle={styles.item}
        onPress={() => onStartWorkout(program, item)}
      />
    ))}
  </View>
);
