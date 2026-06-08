import React from "react";
import { WorkoutType } from "@/types/program.type";
import ChallengeTimerFlowScreen from "../../ChallengeTimerFlowScreen";
import ChallengePickerFlowScreen from "../../ChallengePickerFlowScreen";
import ChallengeButtonScreen from "../../ChallengeButtonScreen";
import AnimatedSlide from "@/components/common/AnimatedSlide";
import { SharedValue } from "react-native-reanimated";

type WorkoutChallengeFlowStepProps = {
  visible: boolean;
  offset: SharedValue<number>;
  levelsLength: number;
  workout: WorkoutType;
  challengeIndex: number;
  isFlowCount: boolean;
  onBack: () => void;
  onStop: (time: number) => void;
  onQuit: () => void;
  onPickerSkip: () => void;
  onPickerNext: (value: number) => void;
  onButtonSkip: () => void;
  onButtonNext: () => void;
};

export const WorkoutChallengeFlowStep: React.FC<WorkoutChallengeFlowStepProps> = ({
  visible,
  offset,
  levelsLength,
  workout,
  challengeIndex,
  isFlowCount,
  onBack,
  onStop,
  onQuit,
  onPickerSkip,
  onPickerNext,
  onButtonSkip,
  onButtonNext,
}) => {
  if (!visible || !workout.challenges.length) return null;

  const challenge = workout.challenges[challengeIndex];

  return (
    <AnimatedSlide index={3} offset={offset}>
      {challenge.isTimer && (
        <ChallengeTimerFlowScreen
          isStart={isFlowCount}
          isFocused={levelsLength === 4}
          workout={workout}
          challengeIndex={challengeIndex}
          onBack={onBack}
          onStop={onStop}
          onQuit={onQuit}
        />
      )}
      {challenge.isNumberInput && (
        <ChallengePickerFlowScreen
          workout={workout}
          challenge={challenge}
          isLastChallenge={challengeIndex === workout.challenges.length - 1}
          onBack={onBack}
          onSkip={onPickerSkip}
          onNext={onPickerNext}
        />
      )}
      {challenge.isButton && (
        <ChallengeButtonScreen
          workout={workout}
          challenge={challenge}
          onBack={onBack}
          onSkip={onButtonSkip}
          onNext={onButtonNext}
        />
      )}
    </AnimatedSlide>
  );
};
