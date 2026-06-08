import { useRef } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import * as SplashScreen from "expo-splash-screen";
import * as ScreenOrientation from "expo-screen-orientation";
import { onAuthStateChanged, User } from "firebase/auth";
import appsFlyer, { UnifiedDeepLinkData } from "react-native-appsflyer";
import crashlytics from "@react-native-firebase/crashlytics";
import { auth } from "@/firebaseConfig";
import fontsLoader from "@/utils/loaders/fontsLoader";
import useUsersStore from "@/store/usersStore";
import useSettingsStore from "@/store/settingsStore";
import { env } from "@/utils/config/env";
import { useShallow } from "zustand/react/shallow";

type BootstrapOptions = {
  setIsReady: (value: boolean) => void;
  setShowCustomSplash: (value: boolean) => void;
  setIsNetInfo: (value: boolean | null) => void;
  setIsNeedToLogin: (value: boolean) => void;
  handleAppsFlyerDeepLink: (data: UnifiedDeepLinkData) => void;
  onPendingAuthRedirect: (path: string) => void;
};

export function useAppBootstrap({
  setIsReady,
  setShowCustomSplash,
  setIsNetInfo,
  setIsNeedToLogin,
  handleAppsFlyerDeepLink,
  onPendingAuthRedirect,
}: BootstrapOptions) {
  const unsubscribeListenersRef = useRef<(() => void) | null>(null);

  const { fetchLocalization, initScreenWidthListener, setIsOnline } = useSettingsStore(
    useShallow((s) => ({
      fetchLocalization: s.fetchLocalization,
      initScreenWidthListener: s.initScreenWidthListener,
      setIsOnline: s.setIsOnline,
    }))
  );

  const { checkPendingEmail, initUser, loginGuestFirebase, setFirebaseUser } = useUsersStore(
    useShallow((s) => ({
      checkPendingEmail: s.checkPendingEmail,
      initUser: s.initUser,
      loginGuestFirebase: s.loginGuestFirebase,
      setFirebaseUser: s.setFirebaseUser,
    }))
  );

  const loadBaseSettings = async () => {
    try {
      setShowCustomSplash(true);
      SplashScreen.hideAsync();
      initScreenWidthListener();
      await Promise.all([fontsLoader(), fetchLocalization()]);
      setIsReady(true);
    } catch (error) {
      if (__DEV__) console.warn("Error with loadBaseSettings:", error);
    }
  };

  const handleUserInitialization = async (userFirebase: User | null, userId: string | null) => {
    if (userFirebase && userId) {
      setFirebaseUser(userFirebase);
      setIsNeedToLogin(false);
      if (Platform.OS === "android" || Platform.OS === "ios") {
        crashlytics().setUserId(userFirebase.uid);
      }
    } else {
      await loginGuestFirebase();
      setIsNeedToLogin(true);
    }
    const result = await initUser();
    if (!result) {
      setIsNeedToLogin(true);
    }
  };

  const startApp = async () => {
    if (unsubscribeListenersRef.current) {
      unsubscribeListenersRef.current();
    }

    await loadBaseSettings();

    if (Platform.OS !== "web") {
      const state = await NetInfo.fetch();
      setIsNetInfo(state.isConnected);
      appsFlyer.initSdk(
        {
          devKey: env.appsFlyer.devKey,
          appId: env.appsFlyer.appId,
          isDebug: __DEV__,
          onInstallConversionDataListener: true,
          onDeepLinkListener: true,
        },
        () => {
          if (__DEV__) console.log("AppsFlyer init OK");
        },
        (err) => {
          if (__DEV__) console.warn("AppsFlyer init error:", err);
        }
      );
      appsFlyer.onDeepLink(handleAppsFlyerDeepLink);
    }

    const unsubscribe = onAuthStateChanged(auth, async (userFirebase) => {
      const userId = await AsyncStorage.getItem("userId");
      const pendingResult = await checkPendingEmail();

      if (pendingResult.success && pendingResult.path) {
        onPendingAuthRedirect(pendingResult.path);
        const updatedUserId = await AsyncStorage.getItem("userId");
        if (updatedUserId && userFirebase) {
          await handleUserInitialization(userFirebase, updatedUserId);
          return;
        }
      }

      await handleUserInitialization(userFirebase, userId);
    });

    const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
      setIsOnline(state.isInternetReachable);
    });

    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);

    unsubscribeListenersRef.current = () => {
      unsubscribe();
      unsubscribeNetInfo();
    };
  };

  return { startApp, unsubscribeListenersRef };
}
