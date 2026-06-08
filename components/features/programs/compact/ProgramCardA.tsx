import { colors } from "@/assets/styles/constants";
import { FavoritesProgram, ProgramType } from "@/types/program.type";
import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Text, ImageBackground, Platform } from "react-native";
import TimerIcon from "@icons/common/timer.svg";
import PlayIcon from "@icons/common/play.svg";
import CompleteIcon from "@icons/common/complete.svg";
import IconRunner from "@icons/common/runner.svg";
import LikeState from "@/components/animations/LikeState";
import useProgramStore from "@/store/programsStore";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Gesture, GestureDetector, State } from "react-native-gesture-handler";
import useSettingsStore from "@/store/settingsStore";
import { formatTime } from "@/utils/functions";
import { scheduleOnRN } from "react-native-worklets";
import { useShallow } from "zustand/react/shallow";

type ProgramProps = {
  program: FavoritesProgram | ProgramType;
  simultaneousHandler: any;
  onPress: () => void;
};

const ProgramCardA: React.FC<ProgramProps> = ({ program, onPress, simultaneousHandler }) => {
  const { isOnline, localization, setShowConnectionError } = useSettingsStore(
    useShallow((s) => ({
      isOnline: s.isOnline,
      localization: s.localization,
      setShowConnectionError: s.setShowConnectionError,
    }))
  );

  const { addProgramToFavorite, removeProgramFromFavorite } = useProgramStore(
    useShallow((s) => ({
      addProgramToFavorite: s.addProgramToFavorite,
      removeProgramFromFavorite: s.removeProgramFromFavorite,
    }))
  );

  const [isFavorites, setIsFavorites] = useState(program.isFavorite);
  const [isOpen, setIsOpen] = useState(false);
  const isMounted = useRef(false);
  const animDuration = 300;
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    if (isFavorites) {
      addProgramToFavorite(program.guid);
    } else {
      removeProgramFromFavorite(program.guid);
    }
  }, [isFavorites]);

  let durationSeconds = "duration" in program && program.duration ? +program.duration : 0;
  if (!durationSeconds && "workouts" in program && program.workouts) {
    durationSeconds = program.workouts.reduce((accum, curr) => accum + curr.duration, 0);
  }
  const duration = formatTime(durationSeconds);
  const tapGesture = Gesture.Tap().onEnd(() => {
    scheduleOnRN(onPress);
  });

  const offset = useSharedValue<number>(0);
  const position = useSharedValue(0);

  const pan = Gesture.Pan()
    .onBegin(() => {})
    .onChange((event) => {
      if (Math.abs(event.translationX) > Math.abs(event.translationY)) {
        if (
          (event.translationX > 20 && event.translationX < 280) ||
          (event.translationX > -280 && event.translationX < -20)
        ) {
          offset.value += event.changeX;
          scheduleOnRN(setIsOpen, false);
        }
      }
    })
    .onFinalize((event) => {
      let targetValue = 0;
      let newPosition = 0;
      let newIsOpen = false;
      if (event.translationX > 20 || event.translationX < -20) {
        if (event.translationX > -180 && event.translationX < 0) {
          if (position.value > 0) {
            targetValue = 0;
            newIsOpen = false;
            newPosition = 0;
          } else {
            targetValue = -54;
            newIsOpen = true;
            newPosition = -54;
          }
        } else if (event.translationX < 180 && event.translationX > 0) {
          if (position.value < 0) {
            targetValue = 0;
            newIsOpen = false;
            newPosition = 0;
          } else {
            targetValue = 54;
            newIsOpen = true;
            newPosition = 54;
          }
        } else if (event.translationX < -180 || event.translationX > 180) {
          if (isOnline) {
            scheduleOnRN(setIsFavorites, !isFavorites);
          } else {
            scheduleOnRN(setShowConnectionError, true);
          }
        }
      }
      position.value = withTiming(
        newPosition,
        {
          duration: animDuration,
        },
        () => scheduleOnRN(setIsOpen, newIsOpen)
      );
      offset.value = withTiming(targetValue, {
        duration: animDuration,
      });
    });
  const scrollGesture = Gesture.Native();

  const animatedStyles = useAnimatedStyle(() => {
    if (isNaN(offset.value) || !isFinite(offset.value)) {
      return { transform: [{ translateX: 0 }] };
    }
    return {
      transform: [{ translateX: offset.value }],
    };
  });

  const leftLikeAnimatedStyle = useAnimatedStyle(() => {
    if (isNaN(position.value) || !isFinite(position.value)) {
      return { zIndex: -1 };
    }
    return {
      zIndex: isOpen && position.value > 0 ? 1 : -1,
    };
  });

  const rightLikeAnimatedStyle = useAnimatedStyle(() => {
    if (isNaN(position.value) || !isFinite(position.value)) {
      return { zIndex: -1 };
    }
    return {
      zIndex: isOpen && position.value < 0 ? 1 : -1,
    };
  });

  const handleLikePress = () => {
    if (isOnline) {
      setIsFavorites(!isFavorites);
    } else {
      setShowConnectionError(true);
    }
  };

  return (
    <View style={[{ zIndex: 3 }, styles.container]}>
      <GestureDetector
        gesture={
          Platform.OS === "web"
            ? Gesture.Race(pan.simultaneousWithExternalGesture(scrollGesture), tapGesture)
            : Gesture.Race(pan.simultaneousWithExternalGesture(simultaneousHandler), tapGesture)
        }
        touchAction="pan-y"
      >
        <Animated.View style={[styles.card, animatedStyles]}>
          <View style={styles.infoContainer}>
            <Text numberOfLines={1} style={styles.name}>
              {localization.t(program.title)}
            </Text>
            <View style={styles.info}>
              <View style={styles.infoItem}>
                <TimerIcon />
                <Text style={styles.infoText}>{duration}</Text>
              </View>
              <View style={styles.infoItem}>
                <IconRunner />
                <Text style={styles.infoText}>{program.level}</Text>
              </View>
            </View>
          </View>
          <View style={styles.imageContainer}>
            <ImageBackground
              source={{
                uri: program.previewSmall,
              }}
              style={styles.image}
              resizeMode="cover"
            >
              {program.progress.statusComplete ? (
                <CompleteIcon style={styles.playIcon} />
              ) : (
                <PlayIcon style={styles.playIcon} />
              )}
            </ImageBackground>
          </View>

          <View
            style={[
              styles.completeIndicator,
              {
                width:
                  (program.progress.countCompletedWorkouts / program.progress.countWorkouts) * 100 +
                  "%",
                backgroundColor: program.progress.statusComplete
                  ? colors.state.progress
                  : colors.text.inverse,
              },
            ]}
          ></View>
        </Animated.View>
      </GestureDetector>
      <Animated.View style={[styles.likeLeft, leftLikeAnimatedStyle]}>
        <LikeState value={isFavorites} onPress={handleLikePress} shadow={false} />
      </Animated.View>
      <Animated.View style={[styles.likeRight, rightLikeAnimatedStyle]}>
        <LikeState value={isFavorites} onPress={handleLikePress} shadow={false} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface.box,
    maxWidth: 546,
    width: "100%",
    marginHorizontal: "auto",
    flex: 1,
    borderRadius: 7,
    maxHeight: 110,
    minHeight: 110,
  },
  card: {
    maxWidth: 546,
    width: "100%",
    flex: 1,
    flexDirection: "row",
    borderRadius: 7,
    zIndex: 3,
    backgroundColor: colors.surface.box,
    overflow: "hidden",
    minHeight: 110,
  },
  completeIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: 5,
    backgroundColor: colors.state.progress,
    zIndex: 4,
  },
  likeLeft: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 54,
    alignItems: "center",
    justifyContent: "center",
    zIndex: -1,
  },
  likeRight: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 54,
    alignItems: "center",
    justifyContent: "center",
    zIndex: -1,
  },
  imageContainer: {
    position: "relative",
    width: 140,
    minHeight: 110,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    overflow: "hidden",
    zIndex: 3,
  },
  image: {
    flex: 1,
  },
  playIcon: {
    minHeight: 45,
    minWidth: 45,
    width: 45,
    height: 45,
    margin: "auto",
    zIndex: 1,
    alignSelf: "center",
  },
  infoContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  info: {
    paddingTop: 8,
    flexDirection: "column",
    gap: 6,
  },
  name: {
    color: colors.text.body,
    fontFamily: "HelveticaNow-Bold",
    fontSize: 14,
    lineHeight: 18,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  infoText: {
    color: colors.text.body,
    fontFamily: "HelveticaNow-Light",
    fontSize: 12,
  },
});

export default ProgramCardA;
