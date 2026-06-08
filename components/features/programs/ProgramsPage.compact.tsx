import { colors } from "@/assets/styles/constants";

import ProgramCarousel from "@/components/features/programs/compact/ProgramCarousel";
import ProgramDetail from "@/components/features/programs/compact/ProgramDetail";
import ProgramsHeader from "@/components/features/programs/compact/ProgramsHeader";
import WorkoutScreens from "@/components/features/programs/compact/workout/WorkoutScreens";
import CategoryList from "@/components/features/programs/shared/categories/CategoryList";
import { useProgramsPage } from "@/components/features/programs/hooks/useProgramsPage";
import { SaveProgramResult } from "@/types/program.type";
import { TAB_BAR_OFFSET } from "@/utils/constants/tabs";
import * as ScreenOrientation from "expo-screen-orientation";
import { View, StyleSheet, ScrollView } from "react-native";

export default function ProgramsPageCompact() {
  const {
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
    backFromWorkout,
    handleContentSizeChange,
    handleLayout,
  } = useProgramsPage("compact");

  return (
    <View style={styles.container}>
      {currentProgram && currentWorkout && (
        <WorkoutScreens
          key={currentWorkout.guid}
          programName={currentProgram.title}
          programGuid={currentProgram.guid}
          workout={currentWorkout}
          nextWorkout={currentProgram.workouts[workoutIndex + 1]}
          isLastWorkout={workoutIndex === currentProgram.workouts.length - 1}
          onNextWorkout={() => nextWorkout(workoutIndex + 1)}
          back={() => {
            backFromWorkout();
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
          }}
          onComplete={(data: SaveProgramResult) => completeHandler(data)}
        />
      )}

      {currentProgram && !currentWorkout && (
        <ProgramDetail
          program={currentProgram}
          close={() => setCurrentProgram(null)}
          startWorkout={startWorkout}
        />
      )}

      {!currentProgram && (
        <View style={styles.container}>
          <ProgramsHeader />
          <CategoryList
            activeBtnIndex={activeBtnIndex}
            style={{ paddingHorizontal: 16 }}
            onPress={(category) => handleFilter(category)}
          />
          <ScrollView
            scrollEnabled={isScrollable}
            onContentSizeChange={handleContentSizeChange}
            onLayout={handleLayout}
            style={styles.list}
            showsVerticalScrollIndicator={false}
          >
            {filteredProgram?.map((item) => (
              <View key={item.guid} style={{ marginBottom: 24 }}>
                <ProgramCarousel
                  program={item}
                  openProgram={() => openProgram(item)}
                  startWorkout={startWorkout}
                />
              </View>
            ))}
            <View style={{ height: TAB_BAR_OFFSET }} />
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.splash,
  },
  list: {
    paddingTop: 24,
  },
});
