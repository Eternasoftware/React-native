import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSharedValue } from "react-native-reanimated";
import useSettingsStore from "@/store/settingsStore";
import useUsersStore from "@/store/usersStore";
import { PROFILE_SCREENS } from "@/utils/constants/home";
import { NotificationsType } from "@/types/users.type";
import { getAllScheduledNotifications } from "@/utils/notifications/scheduler-mobile";
import { NOTIFICATION_TYPE } from "@/utils/constants/notifications";
import { useShallow } from "zustand/react/shallow";
import { TabScreenNavigation, TabScreenParams } from "@/types/navigation";

export function useProfilePage() {
  const { toggleShowNavigation } = useSettingsStore(
    useShallow((s) => ({
      toggleShowNavigation: s.toggleShowNavigation,
    }))
  );

  const { user } = useUsersStore(
    useShallow((s) => ({
      user: s.user,
    }))
  );

  const route = useRoute();
  const navigation = useNavigation() as TabScreenNavigation;
  const params = (route.params || {}) as TabScreenParams;
  const offset = useSharedValue(0);
  const isCooldown = useRef<boolean>(false);

  const [levels, setLevels] = useState<string[]>([PROFILE_SCREENS.PROFILE]);
  const [notificationsObj, setNotificationsObj] = useState<NotificationsType>(
    user && Platform.OS === "web"
      ? user.notifications
      : {
          generalNotification: false,
          dailyWorkoutReminder: false,
          weeklyWorkoutReminder: false,
          salesAndPromotion: false,
          newBlogPosts: false,
        }
  );

  useEffect(() => {
    if (params.linkTo === PROFILE_SCREENS.PROFILE) {
      offset.value = 1;
      setLevels([PROFILE_SCREENS.PROFILE]);
      navigation.setParams({ linkTo: undefined });
      toggleShowNavigation(true);
    }
  }, [params.linkTo]);

  const handleNextScreen = (screen: string) => {
    if (isCooldown.current) return;

    if (offset.value < 3) {
      setLevels((prev) => [...prev, screen]);
      offset.value += 1;
    }

    isCooldown.current = true;
    setTimeout(() => {
      isCooldown.current = false;
    }, 500);
  };

  const handleBackScreen = (toFirst?: boolean) => {
    if (isCooldown.current) return;

    if (toFirst) {
      offset.value = 0;
      setTimeout(() => setLevels([PROFILE_SCREENS.PROFILE]), 500);
      isCooldown.current = true;
      setTimeout(() => {
        isCooldown.current = false;
      }, 500);
      return;
    }
    if (offset.value > 0) {
      offset.value -= 1;
      setTimeout(() => setLevels((prev) => [...prev.slice(0, -1)]), 500);
      isCooldown.current = true;
      setTimeout(() => {
        isCooldown.current = false;
      }, 500);
    }
  };

  const fillNotificationObj = async () => {
    if (Platform.OS === "web") {
      if (user) setNotificationsObj(user.notifications);
    } else {
      const scheduledNotifications = await getAllScheduledNotifications();
      let dailyWorkoutReminder = false;
      let weeklyWorkoutReminder = false;
      if (scheduledNotifications.length) {
        scheduledNotifications.forEach((el) => {
          if (el.identifier === NOTIFICATION_TYPE.DAILY) dailyWorkoutReminder = true;
          if (el.identifier === NOTIFICATION_TYPE.WEEKLY) weeklyWorkoutReminder = true;
        });
      }

      setNotificationsObj((prev) => ({
        ...prev,
        dailyWorkoutReminder,
        weeklyWorkoutReminder,
      }));
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("state", (e) => {
      const index = e.data.state.index;
      const activeRoute = e.data.state.routes[index].name;

      if (activeRoute !== route.name) {
        handleBackScreen(true);
      }
    });
    const unsubscribeTabPress = navigation.addListener("tabPress", () => {
      handleBackScreen(true);
    });

    return () => {
      unsubscribeTabPress();
      unsubscribe();
    };
  }, [navigation, route]);

  useEffect(() => {
    fillNotificationObj();
  }, [user]);

  useEffect(() => {
    if (params.linkTo === PROFILE_SCREENS.ACHIEVEMENTS) {
      offset.value = 1;
      setLevels([PROFILE_SCREENS.PROFILE, PROFILE_SCREENS.ACHIEVEMENTS]);
      navigation.setParams({ linkTo: undefined });
      toggleShowNavigation(true);
    }
  }, [params.linkTo]);

  return {
    user,
    offset,
    levels,
    notificationsObj,
    fillNotificationObj,
    handleNextScreen,
    handleBackScreen,
  };
}
