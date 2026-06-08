import { colors, withAlpha } from "@/assets/styles/constants";
import { WorkoutType } from "@/types/program.type";
import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Text, ImageBackground, Platform } from "react-native";
import TimerIcon from "@icons/common/timer.svg";
import PlayIcon from "@icons/common/play.svg";
import LockIcon from "@icons/common/lock.svg";
import CompleteIcon from "@icons/common/complete.svg";
import IconRunner from "@icons/common/runner.svg";
import IconStar from "@icons/common/star.svg";
import LikeState from "@/components/animations/LikeState";
import useProgramStore from "@/store/programsStore";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import useSettingsStore from "@/store/settingsStore";
import useUsersStore from "@/store/usersStore";
import { formatTime } from "@/utils/functions";
import TextTicker from "react-native-text-ticker";
import { scheduleOnRN } from "react-native-worklets";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import { useShallow } from "zustand/react/shallow";

type WorkoutProps = {
  workout: WorkoutType;
  simultaneousHandler: any;
  hideDetail?: boolean;
  onPress: () => void;
};

const WorkoutCardB: React.FC<WorkoutProps> = ({
  workout,
  onPress,
  hideDetail = false,
  simultaneousHandler,
}) => {
  const { isOnline, localization, setShowConnectionError, toggleShowLoginModal } = useSettingsStore(
    useShallow((s) => ({
      isOnline: s.isOnline,
      localization: s.localization,
      setShowConnectionError: s.setShowConnectionError,
      toggleShowLoginModal: s.toggleShowLoginModal,
    }))
  );

  const { isGuest } = useUsersStore(
    useShallow((s) => ({
      isGuest: s.isGuest,
    }))
  );

  const { addWorkoutToFavorite, removeWorkoutFromFavorite } = useProgramStore(
    useShallow((s) => ({
      addWorkoutToFavorite: s.addWorkoutToFavorite,
      removeWorkoutFromFavorite: s.removeWorkoutFromFavorite,
    }))
  );

  const [isFavorites, setIsFavorites] = useState(workout.isFavorite);
  const [isOpen, setIsOpen] = useState(false);
  const isMounted = useRef(false);
  const animDuration = 300;
  const duration = formatTime(workout.duration);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    if (isFavorites) {
      addWorkoutToFavorite(workout.guid);
    } else {
      removeWorkoutFromFavorite(workout.guid);
    }
  }, [isFavorites]);

  const points =
    workout.challenges.reduce((accum, curr) => accum + curr.points, 0) || workout.points || 0;

  const tapGesture = Gesture.Tap().onEnd(() => {
    if (isGuest && !workout.isAvailableForGuest) {
      scheduleOnRN(toggleShowLoginModal, true);
    } else {
      scheduleOnRN(onPress);
    }
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
    <View style={[{ zIndex: 0 }, styles.container]}>
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
            {hideDetail ? (
              <Text style={styles.name}>{localization.t(workout.title)}</Text>
            ) : (
              <TextTicker
                numberOfLines={hideDetail ? 1 : 3}
                style={styles.name}
                duration={5000}
                loop
                bounce
                scroll={false}
                repeatSpacer={30}
                marqueeDelay={1000}
              >
                {localization.t(workout.title)}
              </TextTicker>
            )}

            {!hideDetail && (
              <View style={styles.info}>
                <View style={styles.infoItem}>
                  <TimerIcon />
                  <Text style={styles.infoText}>{duration}</Text>
                </View>
                {workout.badge && (
                  <View style={styles.infoItem}>
                    <IconRunner />
                    <Text numberOfLines={1} style={styles.infoText}>
                      {localization.t(workout.badge.title)}
                    </Text>
                  </View>
                )}
                {!!points && (
                  <View style={styles.infoItem}>
                    <IconStar />
                    <Text style={styles.infoText}>
                      {points}+ {localization.t(LOCALIZATION_KEYS.TXT_W_CARD_B)}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
          <View style={styles.imageContainer}>
            <ImageBackground
              source={{
                uri: workout.previewSmall,
              }}
              style={styles.image}
              resizeMode="cover"
            >
              {isGuest && !workout.isAvailableForGuest && (
                <View style={styles.lockState}>
                  <LockIcon style={styles.lockIcon} />
                </View>
              )}
              {workout.statusComplete && !workout.hideCompleteStatus && (
                <CompleteIcon style={styles.playIcon} />
              )}
              {((isGuest && workout.isAvailableForGuest) || !isGuest) &&
                (!workout.statusComplete || workout.hideCompleteStatus) && (
                  <PlayIcon style={styles.playIcon} />
                )}
            </ImageBackground>
          </View>
          {workout.statusComplete && !workout.hideCompleteStatus && (
            <View style={styles.completeIndicator}></View>
          )}
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
    flex: 1,
    marginHorizontal: "auto",
    borderRadius: 7,
    minHeight: 110,
    position: "relative",
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
    height: "100%",
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
  lockState: {
    backgroundColor: withAlpha(colors.surface.elevated, 0.7),
    minWidth: "100%",
    minHeight: "100%",
    zIndex: 1,
  },
  lockIcon: {
    minHeight: 24,
    minWidth: 24,
    width: 24,
    height: 24,
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
    fontFamily: "HelveticaNow-ExtraBold",
    fontSize: 14,
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

export default WorkoutCardB;
