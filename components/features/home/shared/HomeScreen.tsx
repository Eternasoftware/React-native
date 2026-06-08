import { colors } from "@/assets/styles/constants";
import { useIsCompactLayout } from "@/hooks/useIsCompactLayout";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Platform, LayoutChangeEvent } from "react-native";
import { UserData } from "@/types/users.type";
import UserActionsBar from "@/components/features/home/shared/actions-bar/UserActionsBar";
import ContinueProgramsList from "@/components/features/programs/shared/ContinueProgramsList";
import useProgramStore from "@/store/programsStore";
import { ProgramType, WorkoutType } from "@/types/program.type";
import BannerCarouselWeb from "@/components/features/home/expanded/BannerCarouselWeb";
import UserHeader from "@/components/features/home/compact/UserHeader";
import UserHeaderWeb from "@/components/features/home/expanded/UserHeaderWeb";
import useSettingsStore from "@/store/settingsStore";
import SearchResultList from "./SearchResultList";
import SearchResultListWeb from "@/components/features/home/expanded/SearchResultListWeb";
import { useNavigation, useRoute } from "@react-navigation/native";
import { debounce } from "lodash";
import { TAB_BAR_OFFSET } from "@/utils/constants/tabs";
import { useShallow } from "zustand/react/shallow";

type HomeProps = {
  user: UserData;
};

const HomeScreen: React.FC<HomeProps> = ({ user }) => {
  const { localization, screenWidth } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
      screenWidth: s.screenWidth,
    }))
  );

  const { programs } = useProgramStore(
    useShallow((s) => ({
      programs: s.programs,
    }))
  );

  const isCompact = useIsCompactLayout();
  const [isReady, setIsReady] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [filteredWorkouts, setFilteredWorkouts] = useState<WorkoutType[]>([]);
  const [isScrollable, setIsScrollable] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const route = useRoute();

  const programsToContinue: ProgramType[] = [];
  const navigation = useNavigation<any>();
  const locale = localization.locale in localization.translations ? localization.locale : "en";

  programs?.forEach((el) => {
    if (!el.isHack && !el.progress.statusComplete) {
      const completeWorkout = el.workouts.find((w) => w.statusComplete || w.secondsWatched);
      if (completeWorkout) programsToContinue.push(el);
    }
  });

  if (
    !programsToContinue.length &&
    programs &&
    !programs[0].progress.statusComplete &&
    !programs[0].isHack
  )
    programsToContinue.push(programs[0]);

  const handleContentSizeChange = (contentWidth: number, contentHeight: number) => {
    setIsScrollable(contentHeight > scrollViewHeight);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setScrollViewHeight(height);
  };

  const searchWorkouts = (textVal: string) => {
    if (!textVal || textVal.trim() === "") {
      setFilteredWorkouts([]);
      setSearchString("");
      return;
    }
    if (programs) {
      const data = [];
      for (let program of programs) {
        for (let workout of program.workouts) {
          if (
            localization.translations[locale][workout.title] &&
            localization.translations[locale][workout.title]
              .toLowerCase()
              .includes(textVal.toLowerCase())
          )
            data.push(workout);
        }
      }
      setSearchString(textVal);
      setFilteredWorkouts(data);
      setShowSearch(true);
    }
  };

  const debouncedSearch = debounce(searchWorkouts, 300);

  const searchCancelHandler = () => {
    setFilteredWorkouts([]);
    setSearchString("");
    setShowSearch(false);
  };

  useEffect(() => {
    setIsReady(true);
  }, []);

  const handleSearchItemPress = (workoutGuid?: string) => {
    const program = programs?.find((program) => {
      for (let workout of program.workouts) {
        if (workout.guid === workoutGuid) {
          return program;
        }
      }
    });
    searchCancelHandler();
    if (program) {
      if (program.isHack) {
        navigation.navigate("hacks", {
          programGuid: program?.guid,
          workoutGuid,
        });
      } else {
        navigation.navigate("programs", {
          programGuid: program?.guid,
          workoutGuid,
        });
      }
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("state", (e: any) => {
      const index = e.data.state.index;
      const activeRoute = e.data.state.routes[index].name;
      if (activeRoute !== route.name) {
        searchCancelHandler();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigation, route]);

  if (user && isReady) {
    return (
      <View style={styles.container}>
        <View style={[{ zIndex: 3 }, !isCompact && { paddingHorizontal: 32, paddingTop: 32 }]}>
          {isCompact && screenWidth > 0 ? (
            <UserHeader
              name={user.name}
              onCancel={searchCancelHandler}
              onSearch={debouncedSearch}
              onFocus={() => setShowSearch(true)}
            />
          ) : (
            <UserHeaderWeb
              name={user.name}
              value={searchString}
              onSearch={debouncedSearch}
              onFocus={() => setShowSearch(true)}
            />
          )}
        </View>
        {showSearch && !isCompact && (
          <SearchResultListWeb
            workouts={filteredWorkouts}
            searchString={searchString}
            containerStyles={[styles.searchBlockWeb]}
            onPress={handleSearchItemPress}
          />
        )}
        {showSearch && isCompact && (
          <SearchResultList
            workouts={filteredWorkouts}
            searchString={searchString}
            containerStyles={[styles.searchBlock]}
            onPress={handleSearchItemPress}
          />
        )}

        <ScrollView
          scrollEnabled={isScrollable}
          onContentSizeChange={handleContentSizeChange}
          onLayout={handleLayout}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.scrollContent, !isCompact && { padding: 16 }]}>
            <View style={styles.content}>
              <View style={styles.carouselBlock}>
                <BannerCarouselWeb />
              </View>
              <View style={styles.userActionsBlock}>
                <UserActionsBar points={user.points} lastAchievement={user.achievements?.[0]} />
              </View>

              {!!programsToContinue?.length && (
                <ContinueProgramsList programs={programsToContinue} />
              )}
            </View>
          </View>
          <View style={{ height: TAB_BAR_OFFSET }}></View>
        </ScrollView>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.splash,
  },
  scrollContent: {
    flex: 1,
    paddingBottom: Platform.OS === "android" ? 40 : 0,
    width: "100%",
    marginHorizontal: "auto",
  },
  content: {
    flex: 1,
    position: "relative",
  },
  carouselBlock: {
    maxWidth: "100%",
    width: "100%",
  },
  userActionsBlock: {
    width: "100%",
    maxWidth: 460,
  },
  searchBlock: {
    position: "absolute",
    paddingTop: 104,
    top: 0,
    left: 0,
    minHeight: "100%",
    height: "100%",
    width: "100%",
    flex: 1,
    zIndex: 2,
  },
  searchBlockWeb: {
    position: "absolute",
    top: 125,
    right: 48,
    maxHeight: 663,
    width: 414,
    zIndex: 3,
  },
});
export default React.memo(HomeScreen);
