import { useEffect, useRef, useState } from "react";
import { Platform, BackHandler } from "react-native";
import { useKeepAwake } from "expo-keep-awake";
import { useIsCompactLayout } from "@/hooks/useIsCompactLayout";
import useProgramStore from "@/store/programsStore";
import useSettingsStore from "@/store/settingsStore";
import useUsersStore from "@/store/usersStore";
import { TABS } from "@/utils/constants/common";
import { SaveProgramResult, WorkoutType } from "@/types/program.type";
import { logEvent } from "@/utils/configs/analytics";
import { FirebaseEvents } from "@/utils/constants/firebase-events";
import { extractVideoName } from "@/utils/functions";
import { useShallow } from "zustand/react/shallow";
import { useWorkoutChallenge } from "./useWorkoutChallenge";
import { useWorkoutNavigation } from "./useWorkoutNavigation";
import { useWorkoutShare } from "./useWorkoutShare";

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

export function useWorkoutScreens({
  programGuid,
  programName,
  workout,
  nextWorkout,
  isLastWorkout,
  onNextWorkout,
  back,
  onComplete,
}: WorkoutScreensProps) {
  const { activeTab, isOnline, localization, setShowConnectionError } = useSettingsStore(
    useShallow((s) => ({
      activeTab: s.activeTab,
      isOnline: s.isOnline,
      localization: s.localization,
      setShowConnectionError: s.setShowConnectionError,
    }))
  );

  const { fetchUser, user } = useUsersStore(
    useShallow((s) => ({
      fetchUser: s.fetchUser,
      user: s.user,
    }))
  );

  const { saveVideoTime } = useProgramStore(
    useShallow((s) => ({
      saveVideoTime: s.saveVideoTime,
    }))
  );

  const isCompact = useIsCompactLayout();
  const [restartVideo, setRestartVideo] = useState(false);
  const [isBadgeAlreadyReceived, setIsBadgeAlreadyReceived] = useState(false);
  const [isVideoFullyWatched, setIsVideoFullyWatched] = useState(true);

  const completeWorkoutWithoutChallengesRef = useRef<() => void>(() => {});

  const navigation = useWorkoutNavigation({
    workout,
    onWorkoutWithoutChallengesAdvance: () => completeWorkoutWithoutChallengesRef.current(),
  });

  const challenge = useWorkoutChallenge({
    workout,
    programGuid,
    programName,
    isOnline: isOnline ?? false,
    isVideoFullyWatched,
    setShowConnectionError,
    onComplete,
    fetchUser,
    back,
    handleNextScreen: navigation.handleNextScreen,
    handleBackScreen: navigation.handleBackScreen,
  });

  completeWorkoutWithoutChallengesRef.current = challenge.completeWorkoutWithoutChallenges;

  const share = useWorkoutShare({
    programName,
    workout,
    localization,
    challengeTime: challenge.challengeTime,
  });

  useKeepAwake();

  useEffect(() => {
    if (Platform.OS === "web" && !isCompact && activeTab !== TABS.PROGRAMS) {
      back();
    }
  }, [activeTab]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      back();
      return true;
    });
    if (user && workout.badge) {
      const sameBadge = user.achievements.find((el) => el.title === workout.badge.title);
      setIsBadgeAlreadyReceived(!!sameBadge);
    }
    return () => backHandler.remove();
  }, []);

  const completeVideo = async () => {
    logEvent(FirebaseEvents.COMPLETE_WATCHING_VIDEO, {
      program_guid: programGuid,
      program_title: programName,
      workout_guid: workout.guid,
      workout_title: workout.title,
      video_name: extractVideoName(workout.video, 100),
    });
    navigation.handleNextScreen(2);
  };

  const logSkipVideo = () => {
    logEvent(FirebaseEvents.SKIP_WATCHING_VIDEO, {
      program_guid: programGuid,
      program_title: programName,
      workout_guid: workout.guid,
      workout_title: workout.title,
      video_name: extractVideoName(workout.video, 100),
    });
  };

  const handleVideoBack = () => {
    if (workout.workoutDescription) {
      navigation.handleBackScreen(1);
    } else {
      back();
    }
  };

  const handleVideoSkipCompact = () => {
    logSkipVideo();
    navigation.handleNextScreen(2);
  };

  const handleVideoSkipWeb = () => {
    logSkipVideo();
    if (Platform.OS === "web" && document.pictureInPictureElement) {
      document.exitPictureInPicture();
    }
    navigation.setPauseKey((prev) => prev + 1);
    if (workout.challenges.length) {
      navigation.handleNextScreen(2);
    } else {
      back();
    }
  };

  const handleSaveVideoTime = (time: number) => {
    saveVideoTime({
      workoutGuid: workout.guid,
      secondsWatched: Math.floor(time),
    });
  };

  const handleCompleteHackBack = () => {
    navigation.handleBackScreen(2);
    setRestartVideo(true);
    setTimeout(() => setRestartVideo(false), 100);
  };

  return {
    workout,
    nextWorkout,
    isLastWorkout,
    onNextWorkout,
    back,
    isCompact,
    offset: navigation.offset,
    levels: navigation.levels,
    pauseKey: navigation.pauseKey,
    restartVideo,
    challengeIndex: challenge.challengeIndex,
    challengeTime: challenge.challengeTime,
    points: challenge.points,
    isInterrupted: challenge.isInterrupted,
    isFlowCount: navigation.isFlowCount,
    isCongrats: navigation.isCongrats,
    isBadgeAlreadyReceived,
    isShareModalVisible: share.isShareModalVisible,
    setIsShareModalVisible: share.setIsShareModalVisible,
    shareType: share.shareType,
    shareData: share.shareData,
    handleNextScreen: navigation.handleNextScreen,
    handleBackScreen: navigation.handleBackScreen,
    completeVideo,
    handleVideoBack,
    handleVideoSkipCompact,
    handleVideoSkipWeb,
    handleSaveVideoTime,
    setIsVideoFullyWatched,
    skipChallengeDescription: navigation.skipChallengeDescription,
    startChallenge: challenge.startChallenge,
    handleCompleteHackBack,
    stop: challenge.stop,
    handlePickerSkip: challenge.handlePickerSkip,
    handlePickerNext: challenge.handlePickerNext,
    handleButtonSkip: challenge.handleButtonSkip,
    handleButtonNext: challenge.handleButtonNext,
    retryWorkout: challenge.retryWorkout,
    handleResultNext: challenge.handleResultNext,
    openWorkoutShare: share.openWorkoutShare,
    openBadgeShare: share.openBadgeShare,
  };
}
