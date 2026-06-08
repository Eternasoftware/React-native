import { colors } from "@/assets/styles/constants";

import { useIsCompactLayout } from "@/hooks/useIsCompactLayout";
import { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, LayoutChangeEvent } from "react-native";
import NavHeader from "@/components/shared/NavHeader";
import useProgramStore from "@/store/programsStore";
import WorkoutCardB from "@/components/features/programs/compact/WorkoutCardB";
import ProgramCardA from "@/components/features/programs/compact/ProgramCardA";
import { useNavigation } from "@react-navigation/native";
import useSettingsStore from "@/store/settingsStore";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { FavoritesProgram, ProgramType } from "@/types/program.type";
import { TAB_BAR_OFFSET } from "@/utils/constants/tabs";
import Animated from "react-native-reanimated";
import { useShallow } from "zustand/react/shallow";

type FavoritesProps = {
  onBack: () => void;
};
const FavoritesScreen: React.FC<FavoritesProps> = ({ onBack }) => {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

  const { favorites, programs } = useProgramStore(
    useShallow((s) => ({
      favorites: s.favorites,
      programs: s.programs,
    }))
  );

  const [currentButton, setCurrentButton] = useState(0);
  const [isScrollable, setIsScrollable] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const isCompact = useIsCompactLayout();
  const tabs = [
    localization.t(LOCALIZATION_KEYS.BTN_FAVORITES_PROGRAMS),
    localization.t(LOCALIZATION_KEYS.BTN_FAVORITES_WORKOUTS),
  ];
  const [favoriteProgramNodes, setFavoriteProgramNodes] = useState<React.ReactNode | null>(null);
  const [favoriteWorkoutNodes, setFavoriteWorkoutNodes] = useState<React.ReactNode | null>(null);

  const navigation = useNavigation<any>();

  const handlePress = (program: FavoritesProgram | ProgramType, workoutGuid?: string) => {
    navigation.navigate(program.isHack ? "hacks" : "programs", {
      programGuid: program.guid,
      workoutGuid,
    });
  };

  const scrollGesture = Gesture.Native();

  const handleContentSizeChange = (contentWidth: number, contentHeight: number) => {
    setIsScrollable(contentHeight > scrollViewHeight);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setScrollViewHeight(height);
  };

  const handleContainerLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setContainerHeight(height);
  };

  useEffect(() => {
    let favirotePrograms = null;
    let workouts = null;
    if (favorites) {
      if (favorites.programs.length) {
        favirotePrograms = favorites.programs.map((program: any) => (
          <ProgramCardA
            program={program}
            key={program.guid}
            onPress={() => {
              handlePress(program);
            }}
            simultaneousHandler={scrollGesture}
          />
        ));
      }
      if (favorites.workouts.length) {
        workouts = favorites.workouts.map((workout) => (
          <WorkoutCardB
            workout={workout}
            key={workout.guid}
            onPress={() => {
              if (programs) {
                const currProgram = programs.find((p) => workout.programGuid === p.guid);
                if (currProgram) handlePress(currProgram, workout.guid);
              }
            }}
            simultaneousHandler={scrollGesture}
          />
        ));
      }
    }
    setFavoriteProgramNodes(favirotePrograms);
    setFavoriteWorkoutNodes(workouts);
  }, [favorites]);

  return (
    <View style={[styles.container, !isCompact && { paddingHorizontal: 32, paddingTop: 32 }]}>
      <NavHeader
        onBack={onBack}
        text={localization.t(LOCALIZATION_KEYS.TITLE_FAVORITES)}
      ></NavHeader>
      <View style={{ flex: 1 }} onLayout={handleContainerLayout}>
        <GestureDetector gesture={scrollGesture}>
          <Animated.ScrollView
            scrollEnabled={isScrollable}
            onContentSizeChange={handleContentSizeChange}
            onLayout={handleLayout}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              <View style={styles.buttonsContainer}>
                {tabs.map((el, index) => (
                  <TouchableOpacity
                    activeOpacity={1}
                    style={[
                      styles.button,
                      currentButton === index ? styles.mainButton : styles.regularButton,
                    ]}
                    onPress={() => setCurrentButton(index)}
                    key={index}
                  >
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.buttonText,
                        {
                          color:
                            currentButton === index ? colors.surface.card : colors.surface.input,
                        },
                      ]}
                    >
                      {el}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {currentButton === 0 && (
                <View style={{ flex: 1 }}>
                  {favoriteProgramNodes ? (
                    <View style={styles.list}>
                      {favoriteProgramNodes}
                      <View
                        style={{
                          height: TAB_BAR_OFFSET,
                        }}
                      ></View>
                    </View>
                  ) : (
                    <View
                      style={[
                        styles.emptyBlock,
                        { minHeight: containerHeight - 76 - TAB_BAR_OFFSET },
                      ]}
                    >
                      <Text style={styles.subText}>
                        {localization.t(LOCALIZATION_KEYS.TXT_FAVORITES_PROGRAM_EMPTY)}
                      </Text>
                    </View>
                  )}
                </View>
              )}
              {currentButton === 1 && (
                <View style={{ flex: 1 }}>
                  {favoriteWorkoutNodes ? (
                    <View style={styles.list}>
                      {favoriteWorkoutNodes}
                      <View
                        style={{
                          height: TAB_BAR_OFFSET,
                        }}
                      ></View>
                    </View>
                  ) : (
                    <View
                      style={[
                        styles.emptyBlock,
                        { minHeight: containerHeight - 76 - TAB_BAR_OFFSET },
                      ]}
                    >
                      <Text style={styles.subText}>
                        {localization.t(LOCALIZATION_KEYS.TXT_FAVORITES_WORKOUT_EMPTY)}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </Animated.ScrollView>
        </GestureDetector>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.splash,
  },
  content: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 24,
    maxWidth: 578,
    width: "100%",
    marginHorizontal: "auto",
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  button: {
    height: 32,
    borderRadius: 8,
    flex: 1,
    justifyContent: "center",
  },
  buttonText: {
    textAlign: "center",
    fontFamily: "HelveticaNow-Bold",
    fontSize: 14,
    paddingHorizontal: 8,
  },
  mainButton: {
    backgroundColor: colors.surface.input,
  },
  regularButton: {
    backgroundColor: colors.border.onCard,
  },
  list: {
    gap: 10,
    flex: 1,
  },
  hr: {
    borderColor: colors.border.default,
    borderWidth: 1,
    height: 2,
  },
  emptyBlock: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  subText: {
    fontSize: 18,
    fontFamily: "HelveticaNow-MedIta",
    color: colors.text.muted,
    lineHeight: 26,
    maxWidth: 254,
    textAlign: "center",
  },
});

export default FavoritesScreen;
