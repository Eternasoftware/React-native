import { useEffect } from "react";
import { Platform } from "react-native";
import { usePathname, useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
import { getPermissionNotificationsWeb } from "@/utils/notifications/scheduler-web";
import type { UserData } from "@/types/users.type";

export type UseShellSessionParams = {
  user: UserData | null;
  isReady: boolean;
  isNetInfo: boolean | null;
  isOnline: boolean | null;
  isNeedToLogin: boolean;
  setIsNeedToLogin: (value: boolean) => void;
  setShowCustomSplash: (value: boolean) => void;
  setShowWebSplashScreen: (value: boolean) => void;
};

async function requestNotificationPermissions() {
  if (Platform.OS === "web") {
    await getPermissionNotificationsWeb();
  } else {
    await Notifications.requestPermissionsAsync();
  }
}

export function useShellSession({
  user,
  isReady,
  isNetInfo,
  isOnline,
  isNeedToLogin,
  setIsNeedToLogin,
  setShowCustomSplash,
  setShowWebSplashScreen,
}: UseShellSessionParams) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user || !isReady) return;

    if (isNeedToLogin) {
      if (pathname && pathname !== "/onboarding") {
        router.replace("/onboarding");
      }
    }
    if (isNetInfo === true || isOnline === true) {
      setTimeout(() => setShowCustomSplash(false), 500);
      setIsNeedToLogin(false);
    }
    if (Platform.OS === "web") {
      setShowWebSplashScreen(false);
    }
    requestNotificationPermissions();
  }, [user, isReady, isNetInfo]);
}
