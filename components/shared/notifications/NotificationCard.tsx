import React from "react";
import { View, Text, StyleSheet } from "react-native";
import BoxIcon from "@icons/common/box.svg";
import { colors } from "@/assets/styles/constants";
import { NOTIFICATION_TYPE } from "@/utils/constants/notifications";
import useSettingsStore from "@/store/settingsStore";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import { useShallow } from "zustand/react/shallow";

type Notification = {
  type: NOTIFICATION_TYPE;
};

const NotificationCard: React.FC<Notification> = ({ type }) => {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

  const notification = {
    title:
      type === NOTIFICATION_TYPE.DAILY
        ? localization.t(LOCALIZATION_KEYS.TITLE_NOTIFICATION_DAILY)
        : localization.t(LOCALIZATION_KEYS.TITLE_NOTIFICATION_WEEKLY),
    text:
      type === NOTIFICATION_TYPE.DAILY
        ? localization.t(LOCALIZATION_KEYS.TXT_NOTIFICATION_DAILY)
        : localization.t(LOCALIZATION_KEYS.TXT_NOTIFICATION_WEEKLY),
  };
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <BoxIcon style={styles.icon} />
      </View>

      <View style={styles.cardContent}>
        <Text numberOfLines={1} style={[styles.title]}>
          {notification.title}
        </Text>
        <Text numberOfLines={1} style={[styles.text]}>
          {notification.text}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface.elevated,
    borderRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    gap: 13,
  },
  cardContent: {
    justifyContent: "center",
    flex: 1,
    gap: 5,
  },
  iconContainer: {
    padding: 10,
    borderRadius: 100,
    backgroundColor: colors.border.onCard,
    alignSelf: "flex-start",
  },
  icon: {
    width: 24,
    height: 24,
  },
  title: {
    color: colors.text.accent,
    fontFamily: "HelveticaNow-ExtraBold",
    fontSize: 14,
    textTransform: "uppercase",
  },
  text: {
    color: colors.text.body,
    fontFamily: "HelveticaNow-LightIta",
    fontSize: 12,
  },
});

export default NotificationCard;
