import { colors, withAlpha } from "@/assets/styles/constants";
import { useIsCompactLayout } from "@/hooks/useIsCompactLayout";
import { WorkoutType } from "@/types/program.type";
import React from "react";
import { View, StyleSheet, Text, ImageBackground, Pressable } from "react-native";
import TimerIcon from "@icons/common/timer.svg";
import LockIcon from "@icons/common/lock.svg";
import PlayIcon from "@icons/common/play.svg";
import CompleteIcon from "@icons/common/complete.svg";
import IconRunner from "@icons/common/runner.svg";
import IconStar from "@icons/common/star.svg";
import useSettingsStore from "@/store/settingsStore";
import useUsersStore from "@/store/usersStore";
import { formatTime } from "@/utils/functions";
import { useShallow } from "zustand/react/shallow";

type WorkoutProps = {
  workout: WorkoutType;
  searchString: string;
  containerStyle?: object;
  onPress: () => void;
};

const SearchWorkoutItem: React.FC<WorkoutProps> = ({
  workout,
  searchString,
  containerStyle = {},
  onPress,
}) => {
  const { localization, screenWidth, toggleShowLoginModal } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
      screenWidth: s.screenWidth,
      toggleShowLoginModal: s.toggleShowLoginModal,
    }))
  );

  const { isGuest } = useUsersStore(
    useShallow((s) => ({
      isGuest: s.isGuest,
    }))
  );

  const points = workout.challenges.reduce((accum, curr) => accum + curr.points, 0);
  const isCompact = useIsCompactLayout();
  const duration = formatTime(workout.duration);

  const splitSentenceBySubstring = (sentence: string, substring: string) => {
    const lowerCaseSentence = sentence.toLowerCase();
    const lowerCaseSubstring = substring.toLowerCase();

    if (!lowerCaseSentence.includes(lowerCaseSubstring)) {
      return { error: "Substring not found in the sentence" };
    }

    const parts = lowerCaseSentence.split(lowerCaseSubstring);
    const result: any = [];
    let startIndex = 0;

    for (let i = 0; i < parts.length; i++) {
      const originalPart = sentence.slice(startIndex, startIndex + parts[i].length);
      result.push(originalPart);
      startIndex += parts[i].length;

      if (i < parts.length - 1) {
        const originalSubstring = sentence.slice(startIndex, startIndex + substring.length);
        result.push(originalSubstring);
        startIndex += substring.length;
      }
    }
    const indices: any = [];
    result.forEach((part: string, index: number) => {
      if (part.toLowerCase() === lowerCaseSubstring) {
        indices.push(index);
      }
    });
    return { result, substringIndices: indices };
  };

  const titleData = splitSentenceBySubstring(localization.t(workout.title), searchString);

  const getTitle = () => {
    if (!titleData?.result?.length) return "";
    return titleData.result.map((item: string, index: number) => (
      <Text
        numberOfLines={1}
        style={[
          styles.name,
          {
            color: titleData.substringIndices.includes(index)
              ? colors.text.body
              : colors.neutral.gray600,
          },
        ]}
        key={index}
      >
        {item}
      </Text>
    ));
  };

  const title = getTitle();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.content,
        containerStyle,
        pressed && styles.pressed,
        !isCompact && {
          marginHorizontal: "auto",
          width: "100%",
          maxWidth: "100%",
        },
      ]}
      onPress={() => {
        if (isGuest && !workout.isAvailableForGuest) {
          toggleShowLoginModal(true);
        } else {
          onPress();
        }
      }}
    >
      <View style={[styles.infoContainer, { maxWidth: screenWidth - 140 }]}>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[styles.name, { maxWidth: screenWidth - 140 - 32 }]}
        >
          {title}
        </Text>
        <View style={styles.info}>
          <View style={styles.infoItem}>
            <TimerIcon />
            <Text style={styles.infoText}>{duration}</Text>
          </View>
          {workout.badge && (
            <View style={styles.infoItem}>
              <IconRunner />
              <Text style={styles.infoText}>{localization.t(workout.badge.title)}</Text>
            </View>
          )}

          <View style={styles.infoItem}>
            <IconStar />
            <Text style={styles.infoText}>{points}+Points</Text>
          </View>
        </View>
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
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    zIndex: 3,
    backgroundColor: colors.surface.app,
    overflow: "hidden",
    height: "100%",
    minHeight: 110,
    maxHeight: 110,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.onCard,
    maxWidth: "100%",
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
  imageContainer: {
    position: "relative",
    width: 140,
    maxWidth: 140,
    minWidth: 140,
    minHeight: 110,
    overflow: "hidden",
    zIndex: 3,
  },
  image: {
    flex: 1,
    width: 140,
    maxWidth: 140,
    minWidth: 140,
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
    maxWidth: "100%",
  },
  info: {
    paddingTop: 6,
    flexDirection: "column",
    gap: 6,
  },
  name: {
    color: colors.text.body,
    fontFamily: "HelveticaNow-Bold",
    fontSize: 16,
    lineHeight: 20,
    minHeight: 20,
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
});

export default SearchWorkoutItem;
