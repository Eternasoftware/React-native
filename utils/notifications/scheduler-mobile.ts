import { NOTIFICATION_TYPE } from "../constants/notifications";
import * as Notifications from "expo-notifications";
import { Linking } from "react-native";

export async function getAllScheduledNotifications() {
  const notifications = await Notifications.getAllScheduledNotificationsAsync();
  return notifications;
}

export async function requestPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    await Linking.openSettings();
    return false;
  } else {
    return true;
  }
}

export async function scheduleDailyNotification(title: string, body: string) {
  if (!title || !body || title.trim() === "" || body.trim() === "") {
    console.warn("scheduleDailyNotification: Invalid title or body provided");
    return;
  }

  try {
    await Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_TYPE.DAILY,
      content: {
        title: title.trim(),
        body: body.trim(),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour: 10,
        minute: 0,
        repeats: true,
      },
    });
  } catch (error) {
    console.error("Error scheduling daily notification:", error);
  }
}

export async function scheduleWeeklyNotification(title: string, body: string) {
  if (!title || !body || title.trim() === "" || body.trim() === "") {
    console.warn("scheduleWeeklyNotification: Invalid title or body provided");
    return;
  }

  try {
    await Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_TYPE.WEEKLY,
      content: {
        title: title.trim(),
        body: body.trim(),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        weekday: 1,
        hour: 12,
        minute: 0,
        repeats: true,
      },
    });
  } catch (error) {
    console.error("Error scheduling weekly notification:", error);
  }
}

export async function cancelLocalScheduledNotifications(type: NOTIFICATION_TYPE) {
  await Notifications.cancelScheduledNotificationAsync(type);
}
