import { colors } from "@/assets/styles/constants";
import ProgramCarousel from "@/components/features/programs/expanded/ProgramCarousel";
import ProgramDetail from "@/components/features/programs/expanded/ProgramDetail";
import HacksHeader from "@/components/features/hacks/compact/HacksHeader";
import HackWorkoutScreens from "@/components/features/hacks/compact/HackWorkoutScreens";
import { useHacksPage } from "@/components/features/hacks/hooks/useHacksPage";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import useSettingsStore from "@/store/settingsStore";
import "@assets/styles/theme.css";
import "@assets/styles/style.css";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { useShallow } from "zustand/react/shallow";

export default function HacksPageExpanded() {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

  const {
    hacks,
    currentProgram,
    currentWorkout,
    workoutIndex,
    isScrollable,
    nextWorkout,
    startWorkout,
    clearWorkout,
    setCurrentProgram,
    setCurrentWorkout,
    handleContentSizeChange,
    handleLayout,
  } = useHacksPage("expanded");

  return (
    <View style={styles.container}>
      {currentProgram && currentWorkout && (
        <HackWorkoutScreens
          key={currentWorkout.guid}
          nextWorkout={currentProgram.workouts[workoutIndex + 1]}
          workout={currentWorkout}
          isLastWorkout={workoutIndex === currentProgram.workouts.length - 1}
          onNextWorkout={() => nextWorkout(workoutIndex + 1)}
          back={clearWorkout}
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
              <HacksHeader />
              <Text style={styles.descr}>{localization.t(LOCALIZATION_KEYS.DESCR_HACKS)}</Text>
              <View style={styles.list}>
                {hacks?.map((item) => (
                  <View key={item.guid} style={{ marginBottom: 32 }}>
                    <ProgramCarousel
                      program={item}
                      openProgram={() => {
                        setCurrentProgram(item);
                        setCurrentWorkout(null);
                      }}
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
  descr: {
    fontFamily: "HelveticaNow-Regular",
    color: colors.text.body,
    fontSize: 14,
    paddingVertical: 24,
  },
});
