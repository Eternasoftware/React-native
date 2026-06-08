import React from "react";
import { useIsCompactLayout } from "@/hooks/useIsCompactLayout";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ArrowBack from "@icons/common/arrow-back.svg";
import { colors } from "@/assets/styles/constants";

type WorkoutNavHeaderProps = {
  text: string;
  back: () => void;
  isBack?: boolean;
  children?: React.ReactNode;
};

const WorkoutNavHeader: React.FC<WorkoutNavHeaderProps> = ({
  text,
  back,
  isBack = true,
  children,
}) => {
  const isCompact = useIsCompactLayout();
  return (
    <View style={[styles.container, !isCompact && styles.containerWeb]}>
      {isBack ? (
        <TouchableOpacity
          style={[{ paddingLeft: isCompact ? 16 : 24, marginRight: 24 }]}
          onPress={back}
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer]}>
            <ArrowBack style={styles.icon} />
          </View>
        </TouchableOpacity>
      ) : (
        <View style={[styles.iconContainer, { width: 56 }]}></View>
      )}

      <View style={[styles.header, { paddingRight: isBack ? 40 : 0 }]}>
        <Text numberOfLines={2} style={[styles.text, { textAlign: isBack ? "left" : "center" }]}>
          {text}
        </Text>
      </View>
      <View>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 16,
    paddingVertical: 14,
    minHeight: 80,
    width: "100%",
    justifyContent: "space-between",
  },
  containerWeb: {
    paddingRight: 24,
    minHeight: 106,
  },
  header: {
    flex: 1,
  },
  text: {
    color: colors.text.body,
    fontFamily: "HelveticaNow-Black",
    fontSize: 24,
    textTransform: "uppercase",
    lineHeight: 28,
  },
  bonusText: {
    color: colors.text.accent,
    fontFamily: "HelveticaNow-Black",
    fontSize: 20,
  },
  icon: {
    width: 24,
    height: 24,
  },
  iconContainer: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  children: {
    position: "absolute",
    top: 20,
    bottom: 0,
    right: 16,
  },
});

export default WorkoutNavHeader;
