import { colors } from "@/assets/styles/constants";
import { ProgramType } from "@/types/program.type";
import React from "react";
import { View, StyleSheet, Text, ImageBackground, TouchableOpacity } from "react-native";
import useSettingsStore from "@/store/settingsStore";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import { useShallow } from "zustand/react/shallow";

type TryProgramProps = {
  program: ProgramType;
  onPress: () => void;
};

const TryProgramCardA: React.FC<TryProgramProps> = ({ program, onPress }) => {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

  return (
    <TouchableOpacity activeOpacity={0.7} style={styles.card} onPress={onPress}>
      <ImageBackground
        source={{
          uri: program.previewSmall,
        }}
        style={styles.image}
        resizeMode="cover"
      >
        <View style={styles.info}>
          <Text numberOfLines={1} style={styles.title}>
            {localization.t(program.title)}
          </Text>
          <Text style={styles.txt}>
            {program.workouts.length} {localization.t(LOCALIZATION_KEYS.TXT_EPIZODES)}
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 230,
    height: 160,
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
  },
});

export default TryProgramCardA;
