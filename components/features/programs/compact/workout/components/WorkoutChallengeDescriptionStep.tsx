import React from "react";
import { WorkoutType } from "@/types/program.type";
import ChallengeDescriptionScreen from "../../ChallengeDescriptionScreen";
import AnimatedSlide from "@/components/common/AnimatedSlide";
import { SharedValue } from "react-native-reanimated";

type WorkoutChallengeDescriptionStepProps = {
  visible: boolean;
  offset: SharedValue<number>;
  workout: WorkoutType;
  challengeIndex: number;
  onBack: () => void;
  onSkip: () => void;
  onStart: () => void;
};

export const WorkoutChallengeDescriptionStep: React.FC<WorkoutChallengeDescriptionStepProps> = ({
  visible,
  offset,
  workout,
  challengeIndex,
  onBack,
  onSkip,
  onStart,
}) => {
  if (!visible || !workout.challenges.length) return null;

  return (
    <AnimatedSlide index={2} offset={offset} safeMode>
      <ChallengeDescriptionScreen
        workout={workout}
        challenge={workout.challenges[challengeIndex]}
        back={onBack}
        skip={onSkip}
        start={onStart}
      />
    </AnimatedSlide>
  );
};
