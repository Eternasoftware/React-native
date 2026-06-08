import React, { useCallback, useEffect, useRef, useState } from "react";
import { useIsCompactLayout } from "@/hooks/useIsCompactLayout";
import { View, StyleSheet, FlatList, Text, TouchableOpacity, Image } from "react-native";
import { ProgramType, WorkoutType } from "@/types/program.type";
import { colors, withAlpha } from "@/assets/styles/constants";

import ArrowRightIcon from "@icons/common/arrow-right.svg";
import ChevroneRightIcon from "@icons/common/chevrone-white-right.svg";
import WorkoutCardA from "@/components/features/programs/shared/WorkoutCardA";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import useSettingsStore from "@/store/settingsStore";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { scheduleOnRN } from "react-native-worklets";
import { useShallow } from "zustand/react/shallow";
type ProgramCarouselProps = {
  program: ProgramType;
  openProgram: () => void;
  startWorkout: (program: ProgramType, workout: WorkoutType) => void;
};

const ProgramCarousel: React.FC<ProgramCarouselProps> = ({
  program,
  openProgram,
  startWorkout,
}) => {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(0);
  const [showPrev, setShowPrev] = useState<boolean>(false);
  const [showNext, setShowNext] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const navigation: any = useNavigation();
  const route = useRoute();

  const scaleNext = useSharedValue(0);
  const scalePrev = useSharedValue(0);

  const isCompact = useIsCompactLayout();
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0 && !isCompact) {
      setCurrentIndex(viewableItems[0].index);

      const isShowNext =
        viewableItems[viewableItems.length - 1].index < program.workouts.length - 1;

      if (isShowNext) setShowNext(true);

      if (scaleNext && typeof scaleNext.value !== "undefined") {
        scaleNext.value = withTiming(isShowNext ? 1 : 0, { duration: 300 }, (finished) => {
          if (finished && !isShowNext) {
            scheduleOnRN(setShowNext, !!isShowNext);
          }
        });
      }
      const isShowPrev = viewableItems[0].index;
      if (
        scalePrev &&
        typeof scalePrev.value !== "undefined" &&
        scalePrev.value !== (isShowPrev ? 1 : 0)
      ) {
        if (isShowPrev) setShowPrev(true);

        scalePrev.value = withTiming(isShowPrev ? 1 : 0, { duration: 300 }, (finished) => {
          if (finished && !isShowPrev) {
            scheduleOnRN(setShowPrev, !!isShowPrev);
          }
        });
      }
    }
  }).current;

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("state", (e: any) => {
      const index = e.data.state.index;
      const activeRoute = e.data.state.routes[index].name;

      if (activeRoute !== route.name) {
        setIsReady(false);
      } else {
        setIsReady(true);
        if (program.workouts.length > 1) {
          scalePrev.value = withTiming(0, { duration: 500 }, (finished) => {
            if (finished) {
              scheduleOnRN(setShowPrev, false);
            }
          });
          scaleNext.value = withTiming(1, { duration: 500 }, (finished) => {
            if (finished) {
              scheduleOnRN(setShowNext, true);
            }
          });
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigation, route]);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  useFocusEffect(
    useCallback(() => {
      if (program.workouts.length > 1) {
        scalePrev.value = withTiming(0, { duration: 0 }, (finished) => {
          if (finished) {
            scheduleOnRN(setShowPrev, false);
          }
        });
        scaleNext.value = withTiming(1, { duration: 0 }, (finished) => {
          if (finished) {
            scheduleOnRN(setShowNext, true);
          }
        });
      }

      return () => {
        scalePrev.value = 0;
        scaleNext.value = 0;
      };
    }, [])
  );

  const scrollToNextItem = (isNext: boolean) => {
    if (currentIndex !== null && currentIndex < program.workouts.length - 1) {
      let index = currentIndex;
      if (isNext) {
        index = currentIndex + 1;
      } else {
        index = currentIndex ? currentIndex - 1 : 0;
      }

      flatListRef.current?.scrollToIndex({
        index,
        animated: true,
      });
    }
  };

  const animatedStyleNext = useAnimatedStyle(() => ({
    opacity: scaleNext.value,
  }));
  const animatedStylePrev = useAnimatedStyle(() => ({
    opacity: scalePrev.value,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        {program.isNewItem && (
          <View style={styles.newBaner}>
            <Text style={styles.newText}>NEW</Text>
          </View>
        )}
        <Text style={styles.title}>{localization.t(program.title)}</Text>
        <TouchableOpacity style={styles.titleSeeAllBtn} onPress={openProgram} activeOpacity={0.7}>
          <Text style={styles.titleSeeAllText}>See All</Text>
          <ArrowRightIcon />
        </TouchableOpacity>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          ref={flatListRef}
          data={program.workouts}
          initialScrollIndex={0}
          renderItem={({ item }) => (
            <TouchableOpacity activeOpacity={0.7}>
              <WorkoutCardA
                onPress={() => startWorkout(program, item)}
                workout={item}
                showDuration={!program.isHack}
              />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.guid}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.list}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
        />
        {isReady && showNext && (
          <Animated.View
            style={[styles.navButtonContainer, { right: 0, top: 0 }, animatedStyleNext]}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.nextButton}
              onPress={() => scrollToNextItem(true)}
            >
              <LinearGradient
                start={{ x: 1, y: 1 }}
                colors={[colors.surface.splash, withAlpha(colors.surface.overlay, 0)]}
                style={{
                  width: "100%",
                  flex: 1,
                  alignItems: "flex-end",
                }}
              >
                <ChevroneRightIcon style={[styles.chevrone, { marginRight: 15 }]} />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}
        {isReady && showPrev && (
          <Animated.View
            style={[styles.navButtonContainer, { left: 0, top: 0 }, animatedStylePrev]}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.nextButton}
              onPress={() => scrollToNextItem(false)}
            >
              <LinearGradient
                start={{ x: 1, y: 1 }}
                colors={[withAlpha(colors.surface.overlay, 0), colors.surface.splash]}
                style={{
                  width: "100%",
                  flex: 1,
                }}
              >
                <ChevroneRightIcon
                  style={[styles.chevrone, { marginLeft: 15, rotate: "180deg" }]}
                />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    marginBottom: 10,
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  title: {
    fontFamily: "NeueBit-Bold",
    color: colors.text.accent,
    fontSize: 28,
  },
  titleSeeAllText: {
    fontFamily: "Poppins-Medium",
    color: colors.text.body,
    fontSize: 12,
    lineHeight: 16,
  },
  titleSeeAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  listContainer: {
    position: "relative",
  },
  list: {
    gap: 8,
    flexDirection: "row",
  },
  navButtonContainer: {
    position: "absolute",
    top: 31,
    zIndex: 3,
    width: 100,
    height: "100%",
  },
  nextButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    position: "absolute",
    top: 0,
    width: "100%",
    height: "100%",
  },
  newBaner: {
    width: 49,
    height: 19,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.action.primary,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    marginBottom: 4,
  },
  newText: {
    fontFamily: "Poppins-Medium",
    fontSize: 13,
    lineHeight: 16,
  },
  chevrone: {
    minWidth: 9,
    width: 9,
    marginTop: 62,
  },
});

export default React.memo(ProgramCarousel);
