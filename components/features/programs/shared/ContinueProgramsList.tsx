import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { ProgramType } from "@/types/program.type";
import { colors } from "@/assets/styles/constants";
import useSettingsStore from "@/store/settingsStore";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import { useNavigation } from "@react-navigation/native";
import { HOME_SCREENS } from "@/utils/constants/home";
import JourneyCardB from "./JourneyCardB";
import { useShallow } from "zustand/react/shallow";

type ContinueProgramsListProps = {
  programs: ProgramType[];
};

const ContinueProgramsList: React.FC<ContinueProgramsListProps> = ({ programs }) => {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

  const [isStartJourney, setIsStartJourney] = useState(false);

  useEffect(() => {
    if (programs.length === 1) {
      const completeWorkout = programs[0].workouts.find(
        (w) => w.statusComplete || w.secondsWatched
      );
      setIsStartJourney(!completeWorkout);
    }
  }, [programs]);
  const navigation = useNavigation<any>();

  const handlePress = (program: ProgramType) => {
    const workout = program.workouts.find((el) => !el.statusComplete);
    navigation.navigate("programs", {
      programGuid: program.guid,
      workoutGuid: workout?.guid,
      redirectedFrom: HOME_SCREENS.HOME,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          {isStartJourney
            ? localization.t(LOCALIZATION_KEYS.TITLE_START_JOURNEY)
            : localization.t(LOCALIZATION_KEYS.TITLE_CONTINUE_JOURNEY)}
        </Text>
      </View>
      <FlatList
        data={programs}
        renderItem={({ item }) => (
          <JourneyCardB program={item} onPress={() => handlePress(item)} key={item.guid} />
        )}
        keyExtractor={(item) => item.guid}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  titleContainer: {
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  title: {
    fontFamily: "HelveticaNow-Bold",
    color: colors.text.body,
    fontSize: 24,
  },
  titleSeeAllText: {
    fontFamily: "Poppins-Medium",
    color: colors.text.body,
    fontSize: 12,
    lineHeight: 14,
    marginBottom: 10,
  },
  titleSeeAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  list: {
    gap: 8,
    flexDirection: "row",
    paddingHorizontal: 16,
  },
});

export default ContinueProgramsList;
