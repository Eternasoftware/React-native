import { useState } from "react";
import { Href, useRouter } from "expo-router";
import { configureReanimatedLogger } from "react-native-reanimated";
import useUsersStore from "@/store/usersStore";
import useSettingsStore from "@/store/settingsStore";
import { useAppBootstrap } from "@/hooks/useAppBootstrap";
import useDeepLinkHandler from "@/hooks/useDeepLinkHandler";
import { useIsCompactLayout } from "@/hooks/useIsCompactLayout";
import { useShallow } from "zustand/react/shallow";
import { useShellOrientation } from "@/components/features/shell/hooks/useShellOrientation";
import { useShellStartup } from "@/components/features/shell/hooks/useShellStartup";
import { useShellSplash } from "@/components/features/shell/hooks/useShellSplash";
import {
  useShellSession,
  type UseShellSessionParams,
} from "@/components/features/shell/hooks/useShellSession";

configureReanimatedLogger({ strict: true });

export function useRootLayout() {
  const {
    isFullScreen,
    isNeedToLogin,
    isOnline,
    orientation,
    setIsNeedToLogin,
    setShowConnectionError,
    showConnectionError,
    showLoginModal,
    showNavBar,
    showRateUsModal,
    toggleShowLoginModal,
    toggleShowRateUsModal,
    localization,
  } = useSettingsStore(
    useShallow((s) => ({
      isFullScreen: s.isFullScreen,
      isNeedToLogin: s.isNeedToLogin,
      isOnline: s.isOnline,
      orientation: s.orientation,
      setIsNeedToLogin: s.setIsNeedToLogin,
      setShowConnectionError: s.setShowConnectionError,
      showConnectionError: s.showConnectionError,
      showLoginModal: s.showLoginModal,
      showNavBar: s.showNavBar,
      showRateUsModal: s.showRateUsModal,
      toggleShowLoginModal: s.toggleShowLoginModal,
      toggleShowRateUsModal: s.toggleShowRateUsModal,
      localization: s.localization,
    }))
  );

  const { user } = useUsersStore(
    useShallow((s) => ({
      user: s.user,
    }))
  );

  const [isReady, setIsReady] = useState(false);
  const [isNetInfo, setIsNetInfo] = useState<boolean | null>(null);
  const { showCustomSplash, setShowCustomSplash, showWebSplashScreen, setShowWebSplashScreen } =
    useShellSplash();

  const router = useRouter();
  const { handleDeepLink, handleAppsFlyerDeepLink } = useDeepLinkHandler();
  const isCompact = useIsCompactLayout();

  const { startApp, unsubscribeListenersRef } = useAppBootstrap({
    setIsReady,
    setShowCustomSplash,
    setIsNetInfo,
    setIsNeedToLogin,
    handleAppsFlyerDeepLink,
    onPendingAuthRedirect: (path) => router.replace(path as Href),
  });

  useShellStartup({ startApp, handleDeepLink, unsubscribeListenersRef });
  useShellOrientation();
  const shellSessionParams: UseShellSessionParams = {
    user,
    isReady,
    isNetInfo,
    isOnline,
    isNeedToLogin,
    setIsNeedToLogin,
    setShowCustomSplash,
    setShowWebSplashScreen,
  };
  useShellSession(shellSessionParams);

  return {
    isFullScreen,
    isOnline,
    localization,
    orientation,
    setShowConnectionError,
    showConnectionError,
    showLoginModal,
    showNavBar,
    showRateUsModal,
    toggleShowLoginModal,
    toggleShowRateUsModal,
    user,
    showCustomSplash,
    isReady,
    isNetInfo,
    showWebSplashScreen,
    isCompact,
    startApp,
  };
}
