import { colors } from "@/assets/styles/constants";
import React from "react";
import { View, StyleSheet } from "react-native";

type ProgressDotsProps = {
  totalDots: number;
  activeDot: number;
};

const ProgressDots: React.FC<ProgressDotsProps> = ({ totalDots, activeDot }) => {
  return (
    <View style={styles.container}>
      <View style={styles.dotsContainer}>
        {[...Array(totalDots)].map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index === activeDot ? styles.activeDot : styles.inactiveDot]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
    alignItems: "center",
  },
  dotsContainer: {
    display: "flex",
    minWidth: 67,
    gap: 4,
    flexDirection: "row",
  },
  dot: {
    borderRadius: 12,
    height: 4,
    width: 20,
  },
  activeDot: {
    backgroundColor: colors.action.primary,
  },
  inactiveDot: {
    backgroundColor: colors.border.onCard,
  },
});

export default ProgressDots;
