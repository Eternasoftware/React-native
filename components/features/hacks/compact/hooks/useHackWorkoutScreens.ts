import { useEffect, useState } from "react";
import { Platform, BackHandler } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import * as ScreenOrientation from "expo-screen-orientation";
import { useIsCompactLayout } from "@/hooks/useIsCompactLayout";
import useSettingsStore from "@/store/settingsStore";
import { TABS } from "@/utils/constants/common";
import { useShallow } from "zustand/react/shallow";

type UseHackWorkoutScreensParams = {
  back: () => void;
};

export function useHackWorkoutScreens({ back }: UseHackWorkoutScreensParams) {
  const { activeTab } = useSettingsStore(
    useShallow((s) => ({
      activeTab: s.activeTab,
    }))
  );

  const isCompact = useIsCompactLayout();
  const [pauseKey, setPauseKey] = useState(0);
  const [restartVideo, setRestartVideo] = useState(false);
  const [levels, setLevels] = useState<number[]>([0]);
  const offset = useSharedValue(0);

  useEffect(() => {
    if (Platform.OS === "web" && !isCompact && activeTab !== TABS.HACKS) {
      back();
    }
  }, [activeTab]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      back();
      return true;
    });

    return () => backHandler.remove();
  }, []);

  const handleNextScreen = async (index: number) => {
    setPauseKey(Date.now());
    if (offset.value < 1) {
      offset.value += 1;
      setLevels((prev) => [...prev, index]);
    }
    if (index !== 0) {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    }
  };

  const handleBackScreen = (index: number) => {
    if (offset.value > 0) {
      offset.value = index - 1;
      setTimeout(() => setLevels((prev) => [...prev.slice(0, index)]), 300);
    }
  };

  const handleCompleteHackBack = () => {
    handleBackScreen(1);
    setRestartVideo(true);
    setTimeout(() => setRestartVideo(false), 100);
  };

  const handleVideoSkipWeb = () => {
    if (Platform.OS === "web" && document.pictureInPictureElement) {
      document.exitPictureInPicture();
    }
    setPauseKey(pauseKey + 1);
    handleNextScreen(1);
  };

  return {
    isCompact,
    offset,
    levels,
    pauseKey,
    restartVideo,
    handleNextScreen,
    handleCompleteHackBack,
    handleVideoSkipWeb,
  };
}
