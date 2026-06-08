import { useEffect, useState } from "react";
import { LayoutChangeEvent, Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useProgramStore from "@/store/programsStore";
import useSettingsStore from "@/store/settingsStore";
import useUsersStore from "@/store/usersStore";
import { ProgramType, SaveProgramResult, WorkoutType } from "@/types/program.type";
import { categoryTabs } from "@/utils/constants/programs";
import { extractVideoName, getCategoryByAge } from "@/utils/functions";
import { logEvent } from "@/utils/configs/analytics";
import { FirebaseEvents } from "@/utils/constants/firebase-events";
import { LayoutVariant } from "@/utils/layout/breakpoints";
import { useShallow } from "zustand/react/shallow";
import { TabScreenNavigation, TabScreenParams } from "@/types/navigation";

type RouteParams = TabScreenParams;

export function useProgramsPage(layout: LayoutVariant) {
  const {
    isOnline,
    setShowConnectionError,
    toggleShowNavBar,
    toggleShowNavigation,
    toggleShowRateUsModal,
  } = useSettingsStore(
    useShallow((s) => ({
      isOnline: s.isOnline,
      setShowConnectionError: s.setShowConnectionError,
      toggleShowNavBar: s.toggleShowNavBar,
      toggleShowNavigation: s.toggleShowNavigation,
      toggleShowRateUsModal: s.toggleShowRateUsModal,
    }))
  );

  const { user } = useUsersStore(
    useShallow((s) => ({
      user: s.user,
    }))
  );

  const { programs: programsData, saveResult } = useProgramStore(
    useShallow((s) => ({
      programs: s.programs,
      saveResult: s.saveResult,
    }))
  );

  const route = useRoute();
  const navigation = useNavigation() as TabScreenNavigation;
  const router = useRouter();
  const params = (route.params || {}) as RouteParams;

  const [programs, setPrograms] = useState<ProgramType[] | null>(null);
  const [filteredProgram, setFilteredProgram] = useState<ProgramType[] | null>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [activeBtnIndex, setActiveBtnIndex] = useState<number | null>(null);
  const [workoutIndex, setWorkoutIndex] = useState(0);
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutType | null>(null);
  const [currentProgram, setCurrentProgram] = useState<ProgramType | null>(null);
  const [isStartFromDetail, setIsStartFromDetail] = useState(false);
  const [redirectedFrom, setRedirectedFrom] = useState<string | null>(null);

  const handleFilter = (category?: string) => {
    if (programs) {
      setFilteredProgram(
        category ? programs.filter((el) => el.category.includes(category)) : programs
      );
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
      logEvent(FirebaseEvents.START_WATCHING_VIDEO, {
        program_guid: program.guid,
        program_title: program.title,
        workout_guid: workout.guid,
        workout_title: workout.title,
        video_name: extractVideoName(workout.video, 100),
      });
      if (params.redirectedFrom) {
        navigation.setParams({ redirectedFrom: undefined });
      }
    } else {
      setShowConnectionError(true);
    }
  };

  const nextWorkout = (index: number) => {
    if (currentProgram && currentProgram.workouts.length > index) {
      startWorkout(currentProgram, currentProgram.workouts[index]);
    }
  };

  const checkParams = () => {
    if (params.programGuid && programs) {
      const currProgram = programs.find((el) => el.guid === params.programGuid);
      if (currProgram && params.workoutGuid) {
        const currWorkout = currProgram.workouts.find((el) => el.guid === params.workoutGuid);
        if (currWorkout) startWorkout(currProgram, currWorkout);
      } else if (currProgram) {
        setCurrentWorkout(null);
        setCurrentProgram(currProgram);
      }
      navigation.setParams({
        workoutGuid: undefined,
        programGuid: undefined,
      });
    }
    if (params.redirectedFrom) {
      setRedirectedFrom(params.redirectedFrom);
    }
  };

  const checkRateUsModalNeeded = async (saveDto: SaveProgramResult) => {
    try {
      const askedForReviewCount = await AsyncStorage.getItem("askedForReviewCount");
      if (askedForReviewCount && +askedForReviewCount >= 2) return;

      const magicMinutesProgram = programs?.[0];
      if (
        magicMinutesProgram &&
        saveDto.programGuid === magicMinutesProgram.guid &&
        magicMinutesProgram.progress.countCompletedWorkouts === 1
      ) {
        setTimeout(() => toggleShowRateUsModal(true), 1000);
        return;
      }

      let completedWorkoutsCount = 0;
      programs?.forEach((program) => {
        completedWorkoutsCount += +program.progress?.countCompletedWorkouts || 0;
      });
      if (completedWorkoutsCount >= 2) {
        setTimeout(() => toggleShowRateUsModal(true), 1000);
      }
    } catch (error) {
      if (__DEV__) console.error("Failed to rate:", error);
    }
  };

  const completeHandler = async (dataToSave: SaveProgramResult) => {
    if (layout === "compact" && (Platform.OS === "ios" || Platform.OS === "android")) {
      await checkRateUsModalNeeded(dataToSave);
    }
    if (
      currentProgram &&
      currentProgram.progress.countCompletedWorkouts === currentProgram.progress.countWorkouts - 1
    ) {
      logEvent(FirebaseEvents.COMPLETE_PROGRAM, {
        program_guid: currentProgram.guid,
        program_title: currentProgram.title,
        workout_guid: currentWorkout?.guid || "",
        workout_title: currentWorkout?.title || "",
      });
    }
    await saveResult({ ...dataToSave, challenges: dataToSave.challenges || [] });
  };

  useEffect(() => {
    if (programsData) {
      setPrograms(programsData.filter((el) => !el.isHack));
    }
  }, [programsData]);

  useEffect(() => {
    if (currentProgram && programs) {
      const sameProgram = programs.find((el) => el.guid === currentProgram.guid);
      if (sameProgram) setCurrentProgram(sameProgram);
    }
    if (currentWorkout && programs) {
      for (const pr of programs) {
        const sameWorkout = pr.workouts.find((el) => el.guid === currentWorkout.guid);
        if (sameWorkout) {
          setCurrentWorkout(sameWorkout);
          break;
        }
      }
    }
    const category = getCategoryByAge(user?.trainingScore || 25);
    setActiveBtnIndex(categoryTabs.findIndex((tab) => tab.label === category));
    handleFilter(category);
  }, [programs]);

  useEffect(() => {
    if (layout === "compact") {
      toggleShowNavigation(true);
    } else {
      toggleShowNavBar(true);
      toggleShowNavigation(false);
    }
  }, [layout]);

  useEffect(() => {
    if (layout === "compact" && programs) {
      checkParams();
    }
  }, [params, programs, layout]);

  useEffect(() => {
    if (layout === "expanded") {
      checkParams();
    }
  }, [params, layout]);

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

  const openProgram = (item: ProgramType, fromDetail = false) => {
    setCurrentProgram(item);
    setCurrentWorkout(null);
    if (fromDetail) setIsStartFromDetail(true);
    navigation.setParams({
      workoutGuid: undefined,
      programGuid: undefined,
      redirectedFrom: undefined,
    });
  };

  const backFromWorkout = () => {
    if (layout === "expanded") {
      if (isStartFromDetail) {
        setCurrentWorkout(null);
      } else if (redirectedFrom) {
        setCurrentWorkout(null);
        setCurrentProgram(null);
        router.push("/");
      } else {
        setCurrentProgram(null);
      }
      return;
    }
    setCurrentWorkout(null);
    toggleShowNavigation(true);
  };

  return {
    filteredProgram,
    activeBtnIndex,
    currentProgram,
    currentWorkout,
    workoutIndex,
    isScrollable,
    handleFilter,
    startWorkout,
    nextWorkout,
    completeHandler,
    openProgram,
    setCurrentProgram,
    setCurrentWorkout,
    backFromWorkout,
    handleContentSizeChange,
    handleLayout,
  };
}
