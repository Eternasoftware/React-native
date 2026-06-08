import React from "react";
import { View, Text } from "react-native";
import IconFire from "@icons/common/fire.svg";
import IconTimer from "@icons/common/timer.svg";
import { programDetailStyles as styles } from "../styles/programDetail.styles";

type ProgramDetailInfoProps = {
  duration: string;
  level: string;
};

export const ProgramDetailInfo: React.FC<ProgramDetailInfoProps> = ({ duration, level }) => (
  <View style={styles.info}>
    <View style={styles.infoSection}>
      <IconTimer style={styles.infoSectionIcon} />
      <Text style={styles.infoText}>{duration}</Text>
    </View>
    <View style={styles.infoSection}>
      <IconFire style={styles.infoSectionIcon} />
      <Text style={styles.infoText}>{level} </Text>
    </View>
  </View>
);
