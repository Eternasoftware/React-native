import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import VideoPlayer from "@/components/shared/VideoPlayer";
import { WorkoutType, ProgramType } from "@/types/program.type";
import { colors } from "@/assets/styles/constants";

import useSettingsStore from "@/store/settingsStore";
import NavHeader from "@/components/shared/NavHeader";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import { useShallow } from "zustand/react/shallow";
type WorkoutVideoScreenProps = {
  pauseKey?: number;
  workout: WorkoutType;
  back: () => void;
  skip: () => void;
  end: () => void;
  onSaveVideoTime?: (time: number) => void;
  restartVideo?: boolean;
};

const WorkoutVideoScreen: React.FC<WorkoutVideoScreenProps> = ({
  pauseKey = 0,
  workout,
  back,
  skip,
  end,
  onSaveVideoTime = () => {},
  restartVideo = false,
}) => {
  const { localization, toggleShowNavigation } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
      toggleShowNavigation: s.toggleShowNavigation,
    }))
  );
  const [showHeader, setShowHeader] = useState<boolean>(true);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isPlayedToEnd, setIsPlayedToEnd] = useState(false);

  useEffect(() => {
    setIsReady(true);
    toggleShowNavigation(false);
  }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.playerHeader, !showHeader && styles.hide]}>
        <NavHeader onBack={back} text={localization.t(workout.title)} buttonShadow={false}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.skipButton}
            onPress={() => {
              if (isPlayedToEnd) {
                end();
              } else {
                skip();
              }
            }}
          >
            <Text style={styles.skipText}>{localization.t(LOCALIZATION_KEYS.BTN_SKIP_VIDEO)}</Text>
          </TouchableOpacity>
        </NavHeader>
      </View>
      <View style={styles.playerContainer}>
        {isReady && (
          <VideoPlayer
            startTime={workout.secondsWatched || 0}
            pauseKey={pauseKey}
            source={workout.video}
            onSaveVideoTime={onSaveVideoTime}
            onHidePanel={() => setShowHeader(false)}
            onShowPanel={() => setShowHeader(true)}
            onPlayToEnd={(preventRun: boolean) => {
              if (preventRun) {
                setIsPlayedToEnd(preventRun);
              } else {
                end();
              }
            }}
            rounded={14}
            restartVideo={restartVideo}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
    position: "relative",
    paddingHorizontal: 32,
    paddingTop: 32,
    paddingBottom: 22,
  },
  hide: { display: "none" },
  playerHeader: {
    minHeight: 80,
  },
  playerContainer: {
    flex: 1,
    backgroundColor: colors.surface.splash,
  },
  skipButton: {
    backgroundColor: colors.surface.alt,
    alignItems: "center",
    alignSelf: "flex-end",
    padding: 12,
    borderRadius: 8,
    marginRight: 16,
  },
  skipText: {
    color: colors.text.body,
    fontSize: 16,
    lineHeight: 18,
  },
});

export default WorkoutVideoScreen;
