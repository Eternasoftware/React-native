import { useState } from "react";
import { useSharedValue } from "react-native-reanimated";
import { WorkoutType } from "@/types/program.type";

type UseWorkoutNavigationParams = {
  workout: WorkoutType;
  onWorkoutWithoutChallengesAdvance: () => void;
};

export function useWorkoutNavigation({
  workout,
  onWorkoutWithoutChallengesAdvance,
}: UseWorkoutNavigationParams) {
  const [levels, setLevels] = useState<number[]>(workout.workoutDescription ? [0] : [0, 1]);
  const [pauseKey, setPauseKey] = useState(0);
  const [isFlowCount, setIsFlowCount] = useState(false);
  const [isCongrats, setIsCongrats] = useState(false);

  const offset = useSharedValue(workout.workoutDescription ? 0 : 1);

  const handleBackScreen = (index: number) => {
    if (offset.value > 0) {
      offset.value = index - 1;
      setTimeout(() => setLevels((prev) => [...prev.slice(0, index)]), 300);
    }
  };

  const handleNextScreen = (index: number) => {
    if (index === 2) {
      setPauseKey(Date.now());
      setTimeout(() => {
        setPauseKey(Date.now());
      }, 1000);
    }
    if (offset.value < 5) {
      if (!workout.challenges.length) {
        onWorkoutWithoutChallengesAdvance();
        offset.value += 1;
        setLevels((prev) => [...prev, index]);
      } else if (index !== offset.value) {
        offset.value += 1;
        setLevels((prev) => [...prev, index]);
      }
    }
    setIsFlowCount(index === 3);
    setIsCongrats(index === 5 || !workout.challenges.length);
  };

  const skipChallengeDescription = () => {
    offset.value = 4;
    setLevels((prev) => [...prev, 3, 4]);
  };

  return {
    offset,
    levels,
    pauseKey,
    setPauseKey,
    isFlowCount,
    isCongrats,
    handleNextScreen,
    handleBackScreen,
    skipChallengeDescription,
  };
}
