import { colors, withAlpha } from "@/assets/styles/constants";
import { ProgramType } from "@/types/program.type";
import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, ImageBackground } from "react-native";
import TimerIcon from "@icons/common/timer.svg";
import PlayIcon from "@icons/common/play.svg";
import PlayIconSmall from "@icons/player/play.svg";
import useSettingsStore from "@/store/settingsStore";
import LockIcon from "@icons/common/lock.svg";
import useUsersStore from "@/store/usersStore";
import { formatTime } from "@/utils/functions";
import { useShallow } from "zustand/react/shallow";

type JourneyProps = {
  program: ProgramType;
  onPress: () => void;
};

const JourneyCardA: React.FC<JourneyProps> = ({ program, onPress }) => {
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

  const nextWorkout = program.workouts.find((el) => !el.statusComplete);
  if (nextWorkout) {
    const duration = formatTime(nextWorkout.duration);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          if (isGuest && !nextWorkout.isAvailableForGuest) {
            toggleShowLoginModal(true);
          } else {
            onPress();
          }
        }}
        activeOpacity={0.7}
      >
        <View style={styles.imageContainer}>
          <ImageBackground
            resizeMode="contain"
            source={{ uri: nextWorkout.previewSmall }}
            style={styles.image}
          >
            {isGuest && !nextWorkout.isAvailableForGuest ? (
              <View style={styles.lockState}>
                <LockIcon style={styles.lockIcon} />
              </View>
            ) : (
              <PlayIcon style={styles.playIcon} />
            )}
            <View style={styles.newBaner}>
              <Text style={styles.newText}>NEW</Text>
            </View>
            <View
              style={[
                styles.completeIndicator,
                {
                  width:
                    (program.progress.countCompletedWorkouts / program.progress.countWorkouts) *
                      100 +
                    "%",
                },
              ]}
            ></View>
          </ImageBackground>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{localization.t(nextWorkout.title)}</Text>
          <View style={styles.itemContainer}>
            <PlayIconSmall style={styles.iconSmall} />
            <Text style={styles.txt}>{localization.t(program.title)}</Text>
          </View>
          <View style={styles.itemContainer}>
            <TimerIcon style={styles.iconSmall} />
            <Text style={styles.txt}>{duration}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
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
  playIcon: {
    width: 23,
    position: "absolute",
    right: 5,
    bottom: 5,
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
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  iconSmall: {
    width: 10,
    height: 10,
    maxHeight: 10,
    maxWidth: 10,
  },
  txt: {
    color: colors.text.body,
    fontFamily: "HelveticaNow-Light",
    fontSize: 12,
  },
  completeIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 5,
    zIndex: 4,
    backgroundColor: colors.text.inverse,
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
});

export default JourneyCardA;
