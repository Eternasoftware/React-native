import { useEffect } from "react";
import { BackHandler } from "react-native";
import useSettingsStore from "@/store/settingsStore";
import { ProgramType, WorkoutType } from "@/types/program.type";
import { formatTime } from "@/utils/functions";
import { useShallow } from "zustand/react/shallow";
import { useProgramFavorites } from "@/components/features/programs/shared/program-detail/hooks/useProgramFavorites";
import { getProgramTotalDuration } from "@/components/features/programs/shared/program-detail/utils/getProgramTotalDuration";
import { useProgramDetailScroll } from "./useProgramDetailScroll";

export type ProgramDetailProps = {
  program: ProgramType;
  close: () => void;
  startWorkout: (program: ProgramType, workout: WorkoutType) => void;
};

export function useProgramDetail({ program, close }: ProgramDetailProps) {
  const { isOnline, localization, setShowConnectionError, toggleShowNavigation } = useSettingsStore(
    useShallow((s) => ({
      isOnline: s.isOnline,
      localization: s.localization,
      setShowConnectionError: s.setShowConnectionError,
      toggleShowNavigation: s.toggleShowNavigation,
    }))
  );

  const { isFavorites, setIsFavorites } = useProgramFavorites(program.guid, program.isFavorite);
  const scroll = useProgramDetailScroll(program);

  const duration = formatTime(getProgramTotalDuration(program.workouts));

  useEffect(() => {
    toggleShowNavigation(true);
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      close();
      return true;
    });

    return () => backHandler.remove();
  }, []);

  const handleLikePress = () => {
    if (isOnline) {
      setIsFavorites(!isFavorites);
    } else {
      setShowConnectionError(true);
    }
  };

  return {
    localization,
    duration,
    isFavorites,
    handleLikePress,
    ...scroll,
  };
}
