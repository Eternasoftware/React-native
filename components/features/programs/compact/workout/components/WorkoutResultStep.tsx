import React from "react";
import { WorkoutType } from "@/types/program.type";
import ChallengeResultScreen from "../../ChallengeResultScreen";
import AnimatedSlide from "@/components/common/AnimatedSlide";
import { SharedValue } from "react-native-reanimated";

type WorkoutResultStepProps = {
  visible: boolean;
  offset: SharedValue<number>;
  workout: WorkoutType;
  challengeIndex: number;
  challengeTime: number;
  points: number;
  isInterrupted: boolean;
  onQuit: () => void;
  onRetry: () => void;
  onNext: () => void;
  onShare: () => void;
};

export const WorkoutResultStep: React.FC<WorkoutResultStepProps> = ({
  visible,
  offset,
  workout,
  challengeIndex,
  challengeTime,
  points,
  isInterrupted,
  onQuit,
  onRetry,
  onNext,
  onShare,
}) => {
  if (!visible || !workout.challenges.length) return null;

  return (
    <AnimatedSlide index={4} offset={offset}>
      <ChallengeResultScreen
        workout={workout}
        time={challengeTime}
        points={points}
        isLastChallenge={challengeIndex === workout.challenges.length - 1}
        isInterrupted={isInterrupted}
        onQuit={onQuit}
        onRetry={onRetry}
        onNext={onNext}
        onShare={onShare}
      />
    </AnimatedSlide>
  );
};
