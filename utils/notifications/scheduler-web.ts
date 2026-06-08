import NotificationsAPI from "@utils/api/notifications";
import { env } from "@/utils/config/env";

export async function getExistingSubscription() {
  try {
    let registration = await navigator.serviceWorker.ready;
    return registration.pushManager.getSubscription();
  } catch (error) {
    console.log(error);
  }
}

export async function unsubscribeNotificationsWeb() {
  if ("Notification" in window && "serviceWorker" in navigator) {
    const existingSubscription = await getExistingSubscription();
    if (existingSubscription) {
      await NotificationsAPI.deleteNotifications(existingSubscription.endpoint);
      await existingSubscription.unsubscribe();
      return true;
    }
    return false;
  }
}

export async function getPermissionNotificationsWeb() {
  if ("Notification" in window && "serviceWorker" in navigator) {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }
}

export async function subscribeToNotificationsWeb() {
  if ("Notification" in window && "serviceWorker" in navigator) {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const registration = await navigator.serviceWorker.register("/sw.js");

      if (!registration.active) {
        console.error("No active Service Worker found.");
        return;
      }

      let activeSubscription = await registration.pushManager.getSubscription();
      if (!activeSubscription) {
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: env.vapidPublicKey,
        });

        await NotificationsAPI.setNotificationsData(subscription);
        return true;
      }
    }

    return false;
  }
}
