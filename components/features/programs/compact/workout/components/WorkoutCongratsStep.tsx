import React from "react";
import { WorkoutType } from "@/types/program.type";
import ChallengeCongratsScreen from "../../ChallengeCongratsScreen";
import AnimatedSlide from "@/components/common/AnimatedSlide";
import { SharedValue } from "react-native-reanimated";

type WorkoutCongratsStepProps = {
  visible: boolean;
  offset: SharedValue<number>;
  workout: WorkoutType;
  isCongrats: boolean;
  showBadge: boolean;
  points: number;
  isLastWorkout: boolean;
  onBack: () => void;
  onRetry: () => void;
  onToProgram: () => void;
  onNext: () => void;
  onShare: () => void;
};

export const WorkoutCongratsStep: React.FC<WorkoutCongratsStepProps> = ({
  visible,
  offset,
  workout,
  isCongrats,
  showBadge,
  points,
  isLastWorkout,
  onBack,
  onRetry,
  onToProgram,
  onNext,
  onShare,
}) => {
  if (!visible) return null;

  return (
    <AnimatedSlide index={5} offset={offset}>
      <ChallengeCongratsScreen
        isStart={isCongrats}
        workout={workout}
        showBadge={showBadge}
        points={points}
        back={onBack}
        retry={onRetry}
        toProgram={onToProgram}
        next={onNext}
        onShare={onShare}
        isLastWorkout={isLastWorkout}
      />
    </AnimatedSlide>
  );
};
