import { colors } from "@/assets/styles/constants";
import { ProgramType } from "@/types/program.type";
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import TimerIcon from "@icons/common/timer.svg";
import IconRunner from "@icons/common/runner.svg";
import useSettingsStore from "@/store/settingsStore";
import { formatTime } from "@/utils/functions";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import { useShallow } from "zustand/react/shallow";

type ProgramProps = {
  program: ProgramType;
};

const ProgramDescription: React.FC<ProgramProps> = ({ program }) => {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

  const duration = formatTime(program.workouts.reduce((accum, curr) => accum + curr.duration, 0));
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.body}>
          <Text style={styles.about}>
            {localization.t(
              program.isHack
                ? LOCALIZATION_KEYS.TITLE_HACK_DESCR
                : LOCALIZATION_KEYS.TITLE_PROGRAM_DESCR
            )}
          </Text>
          <Text style={styles.description}>{localization.t(program.description)}</Text>
        </View>

        {!program.isHack && (
          <View style={styles.body}>
            <View style={styles.hr}></View>
            <View style={styles.dataContainer}>
              <View style={styles.dataItem}>
                <TimerIcon />
                <Text style={styles.dataText}>{duration}</Text>
              </View>
              <View style={styles.dataItem}>
                <IconRunner />
                <Text style={styles.dataText}>{program.level}</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    maxWidth: 265,
    borderRadius: 5,
    backgroundColor: colors.surface.box,
  },
  content: {
    gap: 16,
  },
  body: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  about: {
    fontFamily: "HelveticaNow-Bold",
    fontSize: 20,
    marginBottom: 8,
    color: colors.text.body,
  },
  description: {
    fontFamily: "HelveticaNow-Regular",
    fontSize: 14,
    color: colors.text.body,
  },
  footer: {},
  hr: {
    backgroundColor: colors.surface.input,
    height: 1,
    flexDirection: "row",
    opacity: 0.5,
  },
  dataContainer: {
    gap: 5,
    paddingVertical: 10,
  },
  dataItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dataText: {
    fontFamily: "HelveticaNow-Light",
    fontSize: 12,
    color: colors.text.body,
  },
});

export default ProgramDescription;
