import { colors } from "@/assets/styles/constants";

import ProgramCarousel from "@/components/features/programs/expanded/ProgramCarousel";
import ProgramDetail from "@/components/features/programs/expanded/ProgramDetail";
import WorkoutScreens from "@/components/features/programs/compact/workout/WorkoutScreens";
import CategoryList from "@/components/features/programs/shared/categories/CategoryList";
import { useProgramsPage } from "@/components/features/programs/hooks/useProgramsPage";
import { SaveProgramResult } from "@/types/program.type";
import "@assets/styles/theme.css";
import "@assets/styles/style.css";
import { View, StyleSheet, ScrollView } from "react-native";

export default function ProgramsPageExpanded() {
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
  } = useProgramsPage("expanded");

  return (
    <View style={styles.container}>
      {currentProgram && currentWorkout && (
        <WorkoutScreens
          key={currentWorkout.guid}
          programGuid={currentProgram.guid}
          programName={currentProgram.title}
          workout={currentWorkout}
          isLastWorkout={workoutIndex === currentProgram.workouts.length - 1}
          onNextWorkout={() => nextWorkout(workoutIndex + 1)}
          back={backFromWorkout}
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
          <ScrollView
            scrollEnabled={isScrollable}
            onContentSizeChange={handleContentSizeChange}
            onLayout={handleLayout}
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.content, styles.contentPadded]}>
              <CategoryList
                activeBtnIndex={activeBtnIndex}
                style={{ paddingVertical: 32 }}
                onPress={(category) => handleFilter(category)}
              />
              <View style={styles.list}>
                {filteredProgram?.map((item) => (
                  <View key={item.guid} style={{ marginBottom: 32 }}>
                    <ProgramCarousel
                      program={item}
                      openProgram={() => openProgram(item, true)}
                      startWorkout={startWorkout}
                    />
                  </View>
                ))}
              </View>
            </View>
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
  content: {
    flex: 1,
    maxWidth: 850,
    marginHorizontal: "auto",
    width: "100%",
  },
  contentPadded: {
    padding: 32,
  },
  list: {
    paddingTop: 10,
  },
});
