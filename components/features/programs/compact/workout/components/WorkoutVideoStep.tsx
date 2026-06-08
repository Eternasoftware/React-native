import React from "react";
import { WorkoutType } from "@/types/program.type";
import WorkoutVideoScreen from "../../WorkoutVideoScreen";
import WorkoutVideoScreenWeb from "@/components/features/programs/expanded/WorkoutVideoScreen";
import AnimatedSlide from "@/components/common/AnimatedSlide";
import { SharedValue } from "react-native-reanimated";

export type WorkoutVideoStepProps = {
  visible: boolean;
  offset: SharedValue<number>;
  slideIndex?: number;
  isCompact: boolean;
  programTitle: string;
  workout: WorkoutType;
  pauseKey: number;
  restartVideo: boolean;
  onBack: () => void;
  onEnd: () => void;
  onSkip: () => void;
  onSaveVideoTime?: (time: number) => void;
  onVideoWatchStatus?: (isFullyWatched: boolean) => void;
};

export const WorkoutVideoStep: React.FC<WorkoutVideoStepProps> = ({
  visible,
  offset,
  slideIndex = 1,
  isCompact,
  programTitle,
  workout,
  pauseKey,
  restartVideo,
  onBack,
  onEnd,
  onSkip,
  onSaveVideoTime,
  onVideoWatchStatus,
}) => {
  if (!visible) return null;

  return (
    <AnimatedSlide index={slideIndex} offset={offset} safeMode>
      {isCompact ? (
        <WorkoutVideoScreen
          programTitle={programTitle}
          pauseKey={pauseKey}
          workout={workout}
          back={onBack}
          end={onEnd}
          skip={onSkip}
          onSaveVideoTime={onSaveVideoTime}
          onVideoWatchStatus={onVideoWatchStatus}
          restartVideo={restartVideo}
        />
      ) : (
        <WorkoutVideoScreenWeb
          pauseKey={pauseKey}
          workout={workout}
          back={onBack}
          end={onEnd}
          skip={onSkip}
          onSaveVideoTime={onSaveVideoTime}
          restartVideo={restartVideo}
        />
      )}
    </AnimatedSlide>
  );
};
