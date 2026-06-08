import { colors } from "@/assets/styles/constants";
import { useIsCompactLayout } from "@/hooks/useIsCompactLayout";
import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView, LayoutChangeEvent, Platform } from "react-native";
import NavHeader from "@/components/shared/NavHeader";
import { NotificationsType } from "@/types/users.type";
import Toggle from "@/components/common/Toggle";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import useSettingsStore from "@/store/settingsStore";
import useUsersStore from "@/store/usersStore";
import { NOTIFICATION_TYPE } from "@/utils/constants/notifications";
import {
  cancelLocalScheduledNotifications,
  requestPermissions,
  scheduleDailyNotification,
  scheduleWeeklyNotification,
} from "@/utils/notifications/scheduler-mobile";
import {
  getPermissionNotificationsWeb,
  subscribeToNotificationsWeb,
} from "@/utils/notifications/scheduler-web";
import { toastError } from "@/utils/configs/toast";
import { setDailyWorkoutReminder, setWeeklyWorkoutReminder } from "@/utils/notifications/scheduler";
import { TAB_BAR_OFFSET } from "@/utils/constants/tabs";
import { useShallow } from "zustand/react/shallow";

type NotificationsProps = {
  notifications: NotificationsType;
  updateData: () => void;
  onBack: () => void;
};

const NotificationsScreen: React.FC<NotificationsProps> = ({
  notifications,
  updateData,
  onBack,
}) => {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

  const { updateNotifications, user } = useUsersStore(
    useShallow((s) => ({
      updateNotifications: s.updateNotifications,
      user: s.user,
    }))
  );

  const [toggles, setToggles] = useState(notifications);
  const [isReady, setIsReady] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const isCompact = useIsCompactLayout();
  const [notificationsKey, setNotificationsKey] = useState(0);

  const handleContentSizeChange = (contentWidth: number, contentHeight: number) => {
    setIsScrollable(contentHeight > scrollViewHeight);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setScrollViewHeight(height);
  };

  const dailyNotificationHandler = async (val: boolean) => {
    if (user) await setDailyWorkoutReminder(user.id, val);
    if (Platform.OS === "web") {
      const permission = await getPermissionNotificationsWeb();
      if (!permission) {
        setNotificationsKey((prev) => prev + 1);
        toastError("Please allow notifications on the site.");
        setToggles({ ...toggles, dailyWorkoutReminder: false });
        return;
      } else {
        if (val) subscribeToNotificationsWeb();
      }
    } else {
      if (val) {
        const permission = await requestPermissions();
        if (permission) {
          scheduleDailyNotification(
            localization.t(LOCALIZATION_KEYS.TITLE_NOTIFICATION_DAILY),
            localization.t(LOCALIZATION_KEYS.TXT_NOTIFICATION_DAILY)
          );
        } else {
          setNotificationsKey((prev) => prev + 1);
          return;
        }
      } else {
        cancelLocalScheduledNotifications(NOTIFICATION_TYPE.DAILY);
      }
    }

    setToggles({ ...toggles, dailyWorkoutReminder: val });
  };

  const weeklyNotificationHandler = async (val: boolean) => {
    if (user) await setWeeklyWorkoutReminder(user.id, val);

    if (Platform.OS === "web") {
      const permission = await getPermissionNotificationsWeb();
      if (!permission) {
        setNotificationsKey((prev) => prev + 1);
        toastError("Please allow notifications on the site.");
        setToggles({ ...toggles, weeklyWorkoutReminder: false });
        return;
      } else {
        if (val) subscribeToNotificationsWeb();
      }
    } else {
      if (val) {
        const permission = await requestPermissions();
        if (permission) {
          scheduleWeeklyNotification(
            localization.t(LOCALIZATION_KEYS.TITLE_NOTIFICATION_WEEKLY),
            localization.t(LOCALIZATION_KEYS.TXT_NOTIFICATION_WEEKLY)
          );
        } else {
          setNotificationsKey((prev) => prev + 1);
          return;
        }
      } else {
        cancelLocalScheduledNotifications(NOTIFICATION_TYPE.WEEKLY);
      }
    }
    setToggles({ ...toggles, weeklyWorkoutReminder: val });
  };

  useEffect(() => {
    if (isReady && Platform.OS === "web") {
      updateNotifications(toggles);
    } else {
      updateData();
    }
  }, [toggles]);

  useEffect(() => {
    setIsReady(true);
  }, []);

  return (
    <View style={[styles.container, !isCompact && { paddingHorizontal: 32, paddingTop: 32 }]}>
      <NavHeader
        onBack={onBack}
        text={localization.t(LOCALIZATION_KEYS.TITLE_NOTIFICATION_SETTINGS)}
      ></NavHeader>
      <ScrollView
        scrollEnabled={isScrollable}
        onContentSizeChange={handleContentSizeChange}
        onLayout={handleLayout}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.block}>
            <View style={styles.item}>
              <Text style={styles.title}>
                {localization.t(LOCALIZATION_KEYS.TXT_NOTIFICATION_SETTING_02)}
              </Text>
              <Toggle
                value={toggles.dailyWorkoutReminder}
                onValueChange={dailyNotificationHandler}
                key={notificationsKey}
              />
            </View>
            <View style={styles.item}>
              <Text style={styles.title}>
                {localization.t(LOCALIZATION_KEYS.TXT_NOTIFICATION_SETTING_03)}
              </Text>
              <Toggle
                value={toggles.weeklyWorkoutReminder}
                onValueChange={weeklyNotificationHandler}
                key={notificationsKey}
              />
            </View>
          </View>
        </View>
        <View style={{ height: TAB_BAR_OFFSET }}></View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.splash,
  },
  content: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 16,
    maxWidth: 578,
    width: "100%",
    marginHorizontal: "auto",
  },
  block: {
    backgroundColor: colors.surface.box,
    padding: 8,
    borderRadius: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 53,
  },
  title: {
    fontFamily: "HelveticaNow-Bold",
    fontSize: 14,
    color: colors.text.body,
    paddingHorizontal: 10,
    flex: 1,
  },
});

export default React.memo(NotificationsScreen);
