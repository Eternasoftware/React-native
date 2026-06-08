import React from "react";
import useSettingsStore from "@/store/settingsStore";
import { Pressable, StyleSheet, Text, View } from "react-native";
import ArrowForwardIcon from "@icons/common/arrow-forward.svg";
import { colors } from "@/assets/styles/constants";
import { useShallow } from "zustand/react/shallow";

type ActionCardProps = {
  onPress: () => void;
  title: string;
  flex?: number;
  minWidth?: number;
  children: React.ReactNode;
};

const ActionCard: React.FC<ActionCardProps> = ({
  onPress,
  title,
  flex = 1,
  minWidth = 120,
  children,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        styles.blockHeightMobile,
        {
          flex,
          minWidth,
        },
      ]}
    >
      <View style={[styles.cardHeader, styles.cardHeaderMobile]}>
        <Text numberOfLines={1} style={styles.cardHeaderText}>
          {title}
        </Text>
        <ArrowForwardIcon style={styles.arrow} />
      </View>

      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  blockHeightMobile: {
    height: 116,
    overflow: "hidden",
  },
  card: {
    gap: 5,
    backgroundColor: colors.surface.box,
    borderRadius: 5,
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  cardHeaderMobile: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  cardHeaderText: {
    color: colors.text.body,
    fontFamily: "HelveticaNow-ExtraBold",
    fontSize: 12,
    textTransform: "uppercase",
  },
  arrow: {
    width: 10,
    height: 10,
    minWidth: 10,
    minHeight: 10,
    marginLeft: 10,
  },
});

export default React.memo(ActionCard);
