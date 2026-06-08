import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { WorkoutType } from "@/types/program.type";
import { colors } from "@/assets/styles/constants";
import useSettingsStore from "@/store/settingsStore";
import VideoPlayerMobile from "@/components/features/programs/compact/video/VideoPlayerMobile";
import { useShallow } from "zustand/react/shallow";

type WorkoutVideoScreenProps = {
  programTitle: string;
  pauseKey?: number;
  workout: WorkoutType;
  back: () => void;
  skip: () => void;
  end: () => void;
  onSaveVideoTime?: (time: number) => void;
  onVideoWatchStatus?: (isFullyWatched: boolean) => void;
  restartVideo?: boolean;
};

const WorkoutVideoScreen: React.FC<WorkoutVideoScreenProps> = ({
  programTitle,
  pauseKey = 0,
  workout,
  back,
  skip,
  end,
  onSaveVideoTime = () => {},
  onVideoWatchStatus = () => {},
  restartVideo = false,
}) => {
  const { isFullScreen, toggleShowNavigation } = useSettingsStore(
    useShallow((s) => ({
      isFullScreen: s.isFullScreen,
      toggleShowNavigation: s.toggleShowNavigation,
    }))
  );
  const [isReady, setIsReady] = useState<boolean>(false);
  useEffect(() => {
    setIsReady(true);
    toggleShowNavigation(false);
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isFullScreen ? colors.surface.overlay : colors.surface.splash,
        },
      ]}
    >
      {isReady && (
        <VideoPlayerMobile
          programTitle={programTitle}
          workout={workout}
          pauseKey={pauseKey}
          onSaveVideoTime={onSaveVideoTime}
          onVideoWatchStatus={onVideoWatchStatus}
          onPlayToEnd={end}
          onBack={back}
          onSkip={skip}
          restartVideo={restartVideo}
          isBackButton={!!workout.workoutDescription}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  hide: { display: "none" },
});

export default WorkoutVideoScreen;
