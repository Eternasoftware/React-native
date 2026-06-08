import React, { RefObject } from "react";
import { View } from "react-native";
import { GestureType } from "react-native-gesture-handler";
import WorkoutCardB from "../../WorkoutCardB";
import { ProgramType, WorkoutType } from "@/types/program.type";
import { programDetailStyles as styles } from "../styles/programDetail.styles";

type ProgramDetailWorkoutListProps = {
  program: ProgramType;
  listRef: RefObject<View | null>;
  workoutRefs: RefObject<View[]>;
  scrollGesture: GestureType;
  onStartWorkout: (program: ProgramType, workout: WorkoutType) => void;
};

export const ProgramDetailWorkoutList: React.FC<ProgramDetailWorkoutListProps> = ({
  program,
  listRef,
  workoutRefs,
  scrollGesture,
  onStartWorkout,
}) => (
  <View ref={listRef} style={styles.list}>
    {program.workouts.map((item, index) => (
      <View
        ref={(ref) => {
          workoutRefs.current[index] = ref!;
        }}
        key={item.guid}
      >
        <WorkoutCardB
          workout={item}
          hideDetail={program.isHack}
          onPress={() => onStartWorkout(program, item)}
          simultaneousHandler={scrollGesture}
        />
      </View>
    ))}
  </View>
);
