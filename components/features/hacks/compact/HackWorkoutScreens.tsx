import React from "react";
import { View } from "react-native";
import { WorkoutType } from "@/types/program.type";
import CompleteHackScreen from "./CompleteHackScreen";
import { WorkoutVideoStep } from "@/components/features/programs/compact/workout/components/WorkoutVideoStep";
import AnimatedSlide from "@/components/common/AnimatedSlide";
import { useHackWorkoutScreens } from "./hooks/useHackWorkoutScreens";
import { hackWorkoutScreensStyles as styles } from "./styles/hackWorkoutScreens.styles";

type HackWorkoutScreensProps = {
  nextWorkout?: WorkoutType;
  workout: WorkoutType;
  isLastWorkout: boolean;
  onNextWorkout: () => void;
  back: () => void;
};

const HackWorkoutScreens: React.FC<HackWorkoutScreensProps> = ({
  nextWorkout,
  workout,
  isLastWorkout,
  onNextWorkout,
  back,
}) => {
  const {
    isCompact,
    offset,
    levels,
    pauseKey,
    restartVideo,
    handleNextScreen,
    handleCompleteHackBack,
    handleVideoSkipWeb,
  } = useHackWorkoutScreens({ back });

  return (
    <View style={styles.container}>
      <WorkoutVideoStep
        visible={levels[0] === 0}
        offset={offset}
        slideIndex={0}
        isCompact={isCompact}
        programTitle={workout.title}
        workout={workout}
        pauseKey={pauseKey}
        restartVideo={restartVideo}
        onBack={back}
        onEnd={() => handleNextScreen(1)}
        onSkip={isCompact ? () => handleNextScreen(1) : handleVideoSkipWeb}
      />

      {levels[1] === 1 && (
        <AnimatedSlide index={1} offset={offset} safeMode>
          <CompleteHackScreen
            title={workout.title}
            nextPreview={nextWorkout?.previewSmall}
            nextTitle={nextWorkout?.title}
            back={handleCompleteHackBack}
            toProgram={back}
            onNext={onNextWorkout}
            isLastWorkout={isLastWorkout}
          />
        </AnimatedSlide>
      )}
    </View>
  );
};

export default HackWorkoutScreens;
