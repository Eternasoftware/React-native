import AsyncStorage from "@react-native-async-storage/async-storage";
import { NOTIFICATION_TYPE } from "../constants/notifications";
import { getNotificationRefTime } from "../functions";
import { STORAGE_KEYS } from "../constants/common";
import { getPermissionNotificationsWeb, subscribeToNotificationsWeb } from "./scheduler-web";
import { Platform } from "react-native";
import {
  requestPermissions,
  scheduleDailyNotification,
  scheduleWeeklyNotification,
} from "./scheduler-mobile";
import { LOCALIZATION_KEYS } from "../constants/localization";
import UsersAPI from "@utils/api/users";

export const setDailyWorkoutReminder = async (userId: string, val: boolean) => {
  const key = `${STORAGE_KEYS.NOTIFICATION_DATA}-${userId}`;
  const notificationData = await AsyncStorage.getItem(key);
  const now = Date.now();
  if (val) {
    if (notificationData) {
      const data = await JSON.parse(notificationData);
      if (data.dailyWorkoutReminder && data.dailyWorkoutReminder.length) {
        const lastElIndex = data.dailyWorkoutReminder.length - 1;
        if (data.dailyWorkoutReminder[lastElIndex].disableDate)
          data.dailyWorkoutReminder.push({
            enableDate: now,
          });
      } else {
        data.dailyWorkoutReminder = [
          {
            enableDate: now,
          },
        ];
      }
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } else {
      const data = {
        dailyWorkoutReminder: [
          {
            enableDate: now,
          },
        ],
      };
      await AsyncStorage.setItem(key, JSON.stringify(data));
    }
  } else {
    if (notificationData) {
      const data = await JSON.parse(notificationData);

      if (data.dailyWorkoutReminder && data.dailyWorkoutReminder.length) {
        const lastElIndex = data.dailyWorkoutReminder.length - 1;
        const todayRefTime = getNotificationRefTime(NOTIFICATION_TYPE.DAILY);
        if (
          +data.dailyWorkoutReminder[lastElIndex].enableDate < +todayRefTime &&
          now > +todayRefTime
        ) {
          data.dailyWorkoutReminder[lastElIndex].disableDate = now;
        } else {
          data.dailyWorkoutReminder.pop();
        }
      }

      await AsyncStorage.setItem(key, JSON.stringify(data));
    }
  }
};

export const setWeeklyWorkoutReminder = async (userId: string, val: boolean) => {
  const key = `${STORAGE_KEYS.NOTIFICATION_DATA}-${userId}`;
  const notificationData = await AsyncStorage.getItem(key);
  const now = Date.now();
  if (val) {
    if (notificationData) {
      const data = await JSON.parse(notificationData);
      if (data.weeklyWorkoutReminder && data.weeklyWorkoutReminder.length) {
        const lastElIndex = data.weeklyWorkoutReminder.length - 1;
        if (data.weeklyWorkoutReminder[lastElIndex].disableDate)
          data.weeklyWorkoutReminder.push({
            enableDate: now,
          });
      } else {
        data.weeklyWorkoutReminder = [
          {
            enableDate: now,
          },
        ];
      }
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } else {
      const data = {
        weeklyWorkoutReminder: [
          {
            enableDate: now,
          },
        ],
      };
      await AsyncStorage.setItem(key, JSON.stringify(data));
    }
  } else {
    if (notificationData) {
      const data = await JSON.parse(notificationData);

      if (data.weeklyWorkoutReminder && data.weeklyWorkoutReminder.length) {
        const lastElIndex = data.weeklyWorkoutReminder.length - 1;
        const todayRefTime = getNotificationRefTime(NOTIFICATION_TYPE.WEEKLY);
        if (
          +data.weeklyWorkoutReminder[lastElIndex].enableDate < +todayRefTime &&
          now > +todayRefTime
        ) {
          data.weeklyWorkoutReminder[lastElIndex].disableDate = now;
        } else {
          data.weeklyWorkoutReminder.pop();
        }
      }

      await AsyncStorage.setItem(key, JSON.stringify(data));
    }
  }
};

export const enableLocalNotifications = async (userId: string, localization: any) => {
  await setDailyWorkoutReminder(userId, true);
  await setWeeklyWorkoutReminder(userId, true);

  if (Platform.OS === "web") {
    const permission = await getPermissionNotificationsWeb();
    if (permission) {
      await subscribeToNotificationsWeb();
    } else {
      return;
    }
  } else {
    const permission = await requestPermissions();
    if (permission) {
      const dailyTitle =
        localization?.t?.(LOCALIZATION_KEYS.TITLE_NOTIFICATION_DAILY) ||
        "Your Daily Workout Is Ready!";
      const dailyBody =
        localization?.t?.(LOCALIZATION_KEYS.TXT_NOTIFICATION_DAILY) ||
        "Get ready for a new great challenge to improve your skills";
      const weeklyTitle =
        localization?.t?.(LOCALIZATION_KEYS.TITLE_NOTIFICATION_WEEKLY) ||
        "Your Weekly Workout Is Ready!";
      const weeklyBody =
        localization?.t?.(LOCALIZATION_KEYS.TXT_NOTIFICATION_WEEKLY) ||
        "Don't miss an opportunity to train and get better";

      await scheduleDailyNotification(dailyTitle, dailyBody);
      await scheduleWeeklyNotification(weeklyTitle, weeklyBody);
    } else {
      return;
    }
  }

  await UsersAPI.updateNotifications({
    generalNotification: false,
    dailyWorkoutReminder: true,
    weeklyWorkoutReminder: true,
    salesAndPromotion: false,
    newBlogPosts: false,
  });
};
