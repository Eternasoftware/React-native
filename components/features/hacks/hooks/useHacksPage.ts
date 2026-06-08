import { useEffect, useState } from "react";
import { LayoutChangeEvent } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import useProgramStore from "@/store/programsStore";
import useSettingsStore from "@/store/settingsStore";
import { ProgramType, WorkoutType } from "@/types/program.type";
import { LayoutVariant } from "@/utils/layout/breakpoints";
import { useShallow } from "zustand/react/shallow";
import { TabScreenNavigation, TabScreenParams } from "@/types/navigation";

type RouteParams = TabScreenParams;

export function useHacksPage(layout: LayoutVariant) {
  const { isOnline, setShowConnectionError, toggleShowNavBar, toggleShowNavigation } =
    useSettingsStore(
      useShallow((s) => ({
        isOnline: s.isOnline,
        setShowConnectionError: s.setShowConnectionError,
        toggleShowNavBar: s.toggleShowNavBar,
        toggleShowNavigation: s.toggleShowNavigation,
      }))
    );

  const { programs } = useProgramStore(
    useShallow((s) => ({
      programs: s.programs,
    }))
  );

  const route = useRoute();
  const navigation = useNavigation() as TabScreenNavigation;
  const params = (route.params || {}) as RouteParams;

  const [hacks, setHacks] = useState<ProgramType[] | null>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [workoutIndex, setWorkoutIndex] = useState(0);
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutType | null>(null);
  const [currentProgram, setCurrentProgram] = useState<ProgramType | null>(null);

  const nextWorkout = (index: number) => {
    if (currentProgram && currentProgram.workouts.length > index) {
      startWorkout(currentProgram, currentProgram.workouts[index]);
    }
  };

  const startWorkout = (program: ProgramType, workout: WorkoutType) => {
    if (isOnline) {
      const index = program.workouts.findIndex((el) => el.guid === workout.guid);
      setWorkoutIndex(index);
      setCurrentProgram(program);
      setCurrentWorkout(workout);
      if (layout === "compact") {
        toggleShowNavigation(false);
      }
      if (params.redirectedFrom) {
        navigation.setParams({ redirectedFrom: undefined });
      }
    } else {
      setShowConnectionError(true);
    }
  };

  const clearWorkout = () => {
    setCurrentWorkout(null);
    if (layout === "compact") {
      toggleShowNavigation(true);
    }
  };

  const openProgram = (item: ProgramType) => {
    setCurrentProgram(item);
    setCurrentWorkout(null);
    navigation.setParams({
      workoutGuid: undefined,
      programGuid: undefined,
      redirectedFrom: undefined,
    });
  };

  const checkParams = () => {
    if (!params.programGuid || !hacks) return;

    const currProgram = hacks.find((el) => el.guid === params.programGuid);
    if (currProgram && params.workoutGuid) {
      const currWorkout = currProgram.workouts.find((el) => el.guid === params.workoutGuid);
      if (currWorkout) {
        startWorkout(currProgram, currWorkout);
      }
    } else if (currProgram) {
      setCurrentWorkout(null);
      setCurrentProgram(currProgram);
    }
    navigation.setParams({
      workoutGuid: undefined,
      programGuid: undefined,
    });
  };

  useEffect(() => {
    if (programs) {
      setHacks(programs.filter((el) => el.isHack));
    }
  }, [programs]);

  useEffect(() => {
    if (currentProgram && hacks) {
      const sameProgram = hacks.find((el) => el.guid === currentProgram.guid);
      if (sameProgram) setCurrentProgram(sameProgram);
    }
    if (currentWorkout && hacks) {
      for (const pr of hacks) {
        const sameWorkout = pr.workouts.find((el) => el.guid === currentWorkout.guid);
        if (sameWorkout) {
          setCurrentWorkout(sameWorkout);
          break;
        }
      }
    }
  }, [hacks]);

  useEffect(() => {
    if (layout === "compact") {
      toggleShowNavigation(true);
    } else {
      toggleShowNavBar(true);
      toggleShowNavigation(false);
    }
  }, [layout]);

  useEffect(() => {
    if (hacks) checkParams();
  }, [params, hacks]);

  useEffect(() => {
    if (layout !== "compact") return;

    const unsubscribe = navigation.addListener(
      "state",
      (e: { data: { state: { index: number; routes: { name: string }[] } } }) => {
        const index = e.data.state.index;
        const activeRoute = e.data.state.routes[index].name;
        if (activeRoute !== route.name) {
          setCurrentProgram(null);
          setCurrentWorkout(null);
        }
      }
    );
    const unsubscribeTabPress = navigation.addListener("tabPress", () => {
      setCurrentProgram(null);
      setCurrentWorkout(null);
    });

    return () => {
      unsubscribeTabPress();
      unsubscribe();
    };
  }, [navigation, route, layout]);

  const handleContentSizeChange = (_contentWidth: number, contentHeight: number) => {
    setIsScrollable(contentHeight > scrollViewHeight);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    setScrollViewHeight(event.nativeEvent.layout.height);
  };

  return {
    hacks,
    currentProgram,
    currentWorkout,
    workoutIndex,
    isScrollable,
    nextWorkout,
    startWorkout,
    clearWorkout,
    openProgram,
    setCurrentProgram,
    setCurrentWorkout,
    handleContentSizeChange,
    handleLayout,
  };
}
