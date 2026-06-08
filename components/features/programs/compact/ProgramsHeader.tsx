import React, { useState } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { colors } from "@/assets/styles/constants";

const ProgramsHeader: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLogo}>
          <Image
            source={require("./../../../assets/images/logo-icon-white.png")}
            style={styles.logo}
          ></Image>
          <Text style={styles.title}>Programs</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  headerLogo: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
  title: {
    color: colors.text.body,
    fontFamily: "HelveticaNow-ExtraBold",
    fontSize: 36,
  },
  logo: {
    minHeight: 50,
    minWidth: 50,
    maxHeight: 50,
    maxWidth: 50,
    height: 50,
    width: 50,
  },
});

export default ProgramsHeader;
