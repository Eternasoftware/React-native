import { colors } from "@/assets/styles/constants";
import ProgramCarousel from "@/components/features/programs/compact/ProgramCarousel";
import ProgramDetail from "@/components/features/programs/compact/ProgramDetail";
import HacksHeader from "@/components/features/hacks/compact/HacksHeader";
import HackWorkoutScreens from "@/components/features/hacks/compact/HackWorkoutScreens";
import { useHacksPage } from "@/components/features/hacks/hooks/useHacksPage";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import { TAB_BAR_OFFSET } from "@/utils/constants/tabs";
import useSettingsStore from "@/store/settingsStore";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { useShallow } from "zustand/react/shallow";

export default function HacksPageCompact() {
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
    openProgram,
    setCurrentProgram,
    handleContentSizeChange,
    handleLayout,
  } = useHacksPage("compact");

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
          <HacksHeader containerStyle={{ paddingHorizontal: 16, paddingTop: 10 }} />
          <ScrollView
            scrollEnabled={isScrollable}
            onContentSizeChange={handleContentSizeChange}
            onLayout={handleLayout}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.descr}>{localization.t(LOCALIZATION_KEYS.DESCR_HACKS)}</Text>
            {hacks?.map((item) => (
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
  descr: {
    fontFamily: "HelveticaNow-Regular",
    color: colors.text.body,
    fontSize: 14,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
});
