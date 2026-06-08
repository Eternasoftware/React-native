import { useState } from "react";
import { LayoutChangeEvent } from "react-native";
import { useIsCompactLayout } from "@/hooks/useIsCompactLayout";
import useSettingsStore from "@/store/settingsStore";
import { ProgramType, WorkoutType } from "@/types/program.type";
import { useShallow } from "zustand/react/shallow";
import { useProgramFavorites } from "@/components/features/programs/shared/program-detail/hooks/useProgramFavorites";

export type ProgramDetailProps = {
  program: ProgramType;
  close: () => void;
  startWorkout: (program: ProgramType, workout: WorkoutType) => void;
};

export function useProgramDetailExpanded({ program }: ProgramDetailProps) {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

  const { isFavorites, setIsFavorites } = useProgramFavorites(program.guid, program.isFavorite);
  const isCompact = useIsCompactLayout();
  const [isScrollable, setIsScrollable] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);

  const handleContentSizeChange = (contentWidth: number, contentHeight: number) => {
    setIsScrollable(contentHeight > scrollViewHeight);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setScrollViewHeight(height);
  };

  return {
    localization,
    isFavorites,
    setIsFavorites,
    isCompact,
    isScrollable,
    handleContentSizeChange,
    handleLayout,
  };
}
