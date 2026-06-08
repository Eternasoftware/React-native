import React from "react";
import { WorkoutType } from "@/types/program.type";
import CompleteHackScreen from "@/components/features/hacks/compact/CompleteHackScreen";
import AnimatedSlide from "@/components/common/AnimatedSlide";
import { SharedValue } from "react-native-reanimated";

type WorkoutCompleteHackStepProps = {
  visible: boolean;
  offset: SharedValue<number>;
  workout: WorkoutType;
  nextWorkout?: WorkoutType;
  isLastWorkout: boolean;
  onBack: () => void;
  onToProgram: () => void;
  onNext: () => void;
};

export const WorkoutCompleteHackStep: React.FC<WorkoutCompleteHackStepProps> = ({
  visible,
  offset,
  workout,
  nextWorkout,
  isLastWorkout,
  onBack,
  onToProgram,
  onNext,
}) => {
  if (!visible || workout.challenges.length > 0) return null;

  return (
    <AnimatedSlide index={2} offset={offset}>
      <CompleteHackScreen
        title={workout.title}
        nextPreview={nextWorkout?.previewSmall}
        nextTitle={nextWorkout?.title}
        back={onBack}
        toProgram={onToProgram}
        onNext={onNext}
        isLastWorkout={isLastWorkout || !nextWorkout?.isAvailableForGuest}
      />
    </AnimatedSlide>
  );
};
