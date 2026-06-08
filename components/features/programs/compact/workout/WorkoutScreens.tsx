import React from "react";
import { View } from "react-native";
import { SaveProgramResult, WorkoutType } from "@/types/program.type";
import { useWorkoutScreens } from "./hooks/useWorkoutScreens";
import { workoutScreensStyles as styles } from "./styles/workoutScreens.styles";
import { WorkoutShareModal } from "./components/WorkoutShareModal";
import { WorkoutDescriptionStep } from "./components/WorkoutDescriptionStep";
import { WorkoutVideoStep } from "./components/WorkoutVideoStep";
import { WorkoutChallengeDescriptionStep } from "./components/WorkoutChallengeDescriptionStep";
import { WorkoutCompleteHackStep } from "./components/WorkoutCompleteHackStep";
import { WorkoutChallengeFlowStep } from "./components/WorkoutChallengeFlowStep";
import { WorkoutResultStep } from "./components/WorkoutResultStep";
import { WorkoutCongratsStep } from "./components/WorkoutCongratsStep";

export type WorkoutScreensProps = {
  programGuid: string;
  programName: string;
  workout: WorkoutType;
  nextWorkout?: WorkoutType;
  isLastWorkout: boolean;
  onNextWorkout: () => void;
  back: () => void;
  onComplete: (data: SaveProgramResult) => Promise<void>;
};

const WorkoutScreens: React.FC<WorkoutScreensProps> = (props) => {
  const flow = useWorkoutScreens(props);

  return (
    <View style={styles.container}>
      <WorkoutShareModal
        isVisible={flow.isShareModalVisible}
        shareType={flow.shareType}
        shareData={flow.shareData}
        onClose={() => flow.setIsShareModalVisible(false)}
      />

      <WorkoutDescriptionStep
        visible={flow.levels[0] === 0}
        offset={flow.offset}
        workout={flow.workout}
        onBack={flow.back}
        onNext={() => flow.handleNextScreen(1)}
      />

      <WorkoutVideoStep
        visible={flow.levels[1] === 1}
        offset={flow.offset}
        isCompact={flow.isCompact}
        programTitle={props.programName}
        workout={flow.workout}
        pauseKey={flow.pauseKey}
        restartVideo={flow.restartVideo}
        onBack={flow.handleVideoBack}
        onEnd={flow.completeVideo}
        onSkip={flow.isCompact ? flow.handleVideoSkipCompact : flow.handleVideoSkipWeb}
        onSaveVideoTime={flow.handleSaveVideoTime}
        onVideoWatchStatus={flow.setIsVideoFullyWatched}
      />

      <WorkoutChallengeDescriptionStep
        visible={flow.levels[2] === 2}
        offset={flow.offset}
        workout={flow.workout}
        challengeIndex={flow.challengeIndex}
        onBack={() => flow.handleBackScreen(2)}
        onSkip={flow.skipChallengeDescription}
        onStart={flow.startChallenge}
      />

      <WorkoutCompleteHackStep
        visible={flow.levels[2] === 2}
        offset={flow.offset}
        workout={flow.workout}
        nextWorkout={flow.nextWorkout}
        isLastWorkout={flow.isLastWorkout}
        onBack={flow.handleCompleteHackBack}
        onToProgram={flow.back}
        onNext={flow.onNextWorkout}
      />

      <WorkoutChallengeFlowStep
        visible={flow.levels[3] === 3}
        offset={flow.offset}
        levelsLength={flow.levels.length}
        workout={flow.workout}
        challengeIndex={flow.challengeIndex}
        isFlowCount={flow.isFlowCount}
        onBack={() => flow.handleBackScreen(3)}
        onStop={flow.stop}
        onQuit={flow.back}
        onPickerSkip={flow.handlePickerSkip}
        onPickerNext={flow.handlePickerNext}
        onButtonSkip={flow.handleButtonSkip}
        onButtonNext={flow.handleButtonNext}
      />

      <WorkoutResultStep
        visible={flow.levels[4] === 4}
        offset={flow.offset}
        workout={flow.workout}
        challengeIndex={flow.challengeIndex}
        challengeTime={flow.challengeTime}
        points={flow.points}
        isInterrupted={flow.isInterrupted}
        onQuit={flow.back}
        onRetry={flow.retryWorkout}
        onNext={flow.handleResultNext}
        onShare={flow.openWorkoutShare}
      />

      <WorkoutCongratsStep
        visible={flow.levels[5] === 5}
        offset={flow.offset}
        workout={flow.workout}
        isCongrats={flow.isCongrats}
        showBadge={!flow.isBadgeAlreadyReceived}
        points={flow.points}
        isLastWorkout={flow.isLastWorkout}
        onBack={() => flow.handleBackScreen(3)}
        onRetry={() => flow.handleBackScreen(3)}
        onToProgram={flow.back}
        onNext={flow.onNextWorkout}
        onShare={flow.openBadgeShare}
      />
    </View>
  );
};

export default WorkoutScreens;
