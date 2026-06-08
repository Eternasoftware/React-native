import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { colors } from "@/assets/styles/constants";
import { formatDate } from "@/utils/functions";

const ProgramsHeader: React.FC = () => {
  const date = formatDate(new Date());
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.date}>{date}</Text>
        <Text style={styles.title}>Programs</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  header: {
    gap: 7,
  },

  title: {
    color: colors.text.body,
    fontFamily: "HelveticaNow-ExtBlk",
    fontSize: 24,
  },
  date: {
    color: colors.text.body,
    fontFamily: "HelveticaNow-Medium",
    fontSize: 12,
  },
});

export default ProgramsHeader;
