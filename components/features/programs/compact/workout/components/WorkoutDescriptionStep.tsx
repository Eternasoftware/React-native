import React from "react";
import { WorkoutType } from "@/types/program.type";
import WorkoutDescriptionScreen from "../../WorkoutDescriptionScreen";
import AnimatedSlide from "@/components/common/AnimatedSlide";
import { SharedValue } from "react-native-reanimated";

type WorkoutDescriptionStepProps = {
  visible: boolean;
  offset: SharedValue<number>;
  workout: WorkoutType;
  onBack: () => void;
  onNext: () => void;
};

export const WorkoutDescriptionStep: React.FC<WorkoutDescriptionStepProps> = ({
  visible,
  offset,
  workout,
  onBack,
  onNext,
}) => {
  if (!visible || !workout.workoutDescription) return null;

  return (
    <AnimatedSlide index={0} offset={offset} safeMode>
      <WorkoutDescriptionScreen workout={workout} onBack={onBack} onNext={onNext} />
    </AnimatedSlide>
  );
};
