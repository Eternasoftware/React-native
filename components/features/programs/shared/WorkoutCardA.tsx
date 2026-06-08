import { colors, withAlpha } from "@/assets/styles/constants";
import { WorkoutType } from "@/types/program.type";
import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, ImageBackground } from "react-native";
import TimerIcon from "@icons/common/timer.svg";
import PlayIcon from "@icons/common/play.svg";
import LikeState from "@/components/animations/LikeState";
import useProgramStore from "@/store/programsStore";
import useSettingsStore from "@/store/settingsStore";
import useUsersStore from "@/store/usersStore";
import LockIcon from "@icons/common/lock.svg";
import { formatTime } from "@/utils/functions";
import { useShallow } from "zustand/react/shallow";

type WorkoutProps = {
  workout: WorkoutType;
  showIsFavorites?: boolean;
  containerStyle?: object;
  showDuration?: boolean;
  onPress: () => void;
};

const WorkoutCardA: React.FC<WorkoutProps> = ({
  workout,
  showIsFavorites = false,
  containerStyle,
  showDuration = true,
  onPress,
}) => {
  const { localization, toggleShowLoginModal } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
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
  const isMounted = useRef(false);
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

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.card, containerStyle]}
      onPress={() => {
        if (isGuest && !workout.isAvailableForGuest) {
          toggleShowLoginModal(true);
        } else {
          onPress();
        }
      }}
    >
      <View style={styles.imageContainer}>
        <ImageBackground
          resizeMode="stretch"
          source={{ uri: workout.previewSmall }}
          style={styles.image}
        >
          {isGuest && !workout.isAvailableForGuest ? (
            <View style={styles.lockState}>
              <LockIcon style={styles.lockIcon} />
            </View>
          ) : (
            <PlayIcon style={styles.playIcon} />
          )}
          <View style={styles.newBaner}>
            <Text style={styles.newText}>NEW</Text>
          </View>
          {showIsFavorites && (
            <View style={styles.like}>
              <LikeState
                value={isFavorites}
                onPress={() => setIsFavorites(!isFavorites)}
                shadow={false}
              />
            </View>
          )}
        </ImageBackground>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{localization.t(workout.title)}</Text>
        {showDuration && (
          <View style={styles.durationContainer}>
            <TimerIcon />
            <Text style={styles.duration}>{duration}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 157,
  },
  imageContainer: {
    position: "relative",
    height: 102,
    borderRadius: 5,
    overflow: "hidden",
  },
  image: {
    flex: 1,
  },
  lockState: {
    backgroundColor: withAlpha(colors.surface.elevated, 0.7),
    minWidth: "100%",
    minHeight: "100%",
    zIndex: 2,
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
  playIcon: {
    width: 23,
    position: "absolute",
    right: 10,
    bottom: 10,
    zIndex: 1,
  },
  newBaner: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 49,
    height: 19,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    backgroundColor: colors.action.primary,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  like: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 40,
    height: 40,
  },
  newText: {
    fontFamily: "Poppins-Medium",
    fontSize: 12,
    lineHeight: 16,
  },
  info: {
    paddingTop: 8,
    gap: 4,
  },
  name: {
    color: colors.text.body,
    fontFamily: "HelveticaNow-Bold",
    fontSize: 14,
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  duration: {
    color: colors.text.body,
    fontFamily: "HelveticaNow-Light",
    fontSize: 12,
  },
});

export default WorkoutCardA;
