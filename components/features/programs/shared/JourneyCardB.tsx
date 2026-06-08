import { colors } from "@/assets/styles/constants";
import { ProgramType, WorkoutType } from "@/types/program.type";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, ImageBackground, TouchableOpacity } from "react-native";
import useSettingsStore from "@/store/settingsStore";
import PlayIcon from "@icons/common/play.svg";
import useUsersStore from "@/store/usersStore";
import { useShallow } from "zustand/react/shallow";

type JourneyCardBProps = {
  program: ProgramType;
  onPress: (time: number) => void;
};

const JourneyCardB: React.FC<JourneyCardBProps> = ({ program, onPress }) => {
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

  const [workout, setWorkout] = useState<WorkoutType | null>(null);
  useEffect(() => {
    const searchedWorkout = program.workouts.reduce<WorkoutType | null>((acc, w) => {
      if (!w.statusComplete) {
        if (!acc) {
          return w;
        }
        if (!acc.lastWatchedDate && w.lastWatchedDate) {
          return w;
        }
        if (
          acc.lastWatchedDate &&
          w.lastWatchedDate &&
          new Date(acc.lastWatchedDate) < new Date(w.lastWatchedDate)
        ) {
          return w;
        }
      }

      return acc;
    }, null);

    setWorkout(searchedWorkout || program.workouts[0]);
  }, [program]);

  if (workout)
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.card}
        onPress={() => {
          if (isGuest && !workout.isAvailableForGuest) {
            toggleShowLoginModal(true);
          } else {
            onPress(0);
          }
        }}
      >
        <ImageBackground
          source={{
            uri: program.previewSmall,
          }}
          style={styles.image}
          resizeMode="cover"
        >
          <PlayIcon style={styles.playIcon} />
          <View style={styles.info}>
            <Text style={styles.title}>{localization.t(workout.title)}</Text>
            <Text style={styles.txt}>{localization.t(program.title)}</Text>
          </View>
          <View
            style={[
              styles.completeIndicator,
              {
                width: workout.secondsWatched
                  ? (workout.secondsWatched / workout.duration) * 100 + "%"
                  : "0%",
              },
            ]}
          ></View>
        </ImageBackground>
      </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
  card: {
    width: 230,
    height: 149,
    borderRadius: 5,
    overflow: "hidden",
  },
  image: {
    flex: 1,
    justifyContent: "flex-end",
    borderRadius: 5,
  },
  info: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
  },
  title: {
    color: colors.text.body,
    fontFamily: "HelveticaNow-ExtraBold",
    fontSize: 20,
    textTransform: "uppercase",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  txt: {
    color: colors.text.body,
    fontFamily: "HelveticaNow-Bold",
    fontSize: 10,
    textTransform: "uppercase",
  },
  playIcon: {
    width: 23,
    position: "absolute",
    right: 6,
    top: 6,
    zIndex: 1,
  },
  completeIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 5,
    zIndex: 4,
    backgroundColor: colors.text.inverse,
  },
});

export default JourneyCardB;
