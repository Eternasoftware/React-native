import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import useSettingsStore from "@/store/settingsStore";
import useUsersStore from "@/store/usersStore";
import {
  subscribeToNotificationsWeb,
  unsubscribeNotificationsWeb,
} from "@/utils/notifications/scheduler-web";
import { useShallow } from "zustand/react/shallow";
import { TabScreenNavigation } from "@/types/navigation";

export function useHomePage() {
  const { screenWidth, toggleShowNavBar } = useSettingsStore(
    useShallow((s) => ({
      screenWidth: s.screenWidth,
      toggleShowNavBar: s.toggleShowNavBar,
    }))
  );

  const { initUser, user } = useUsersStore(
    useShallow((s) => ({
      initUser: s.initUser,
      user: s.user,
    }))
  );

  const route = useRoute();
  const navigation = useNavigation() as TabScreenNavigation;
  const params = (route.params || {}) as {
    isLogin?: boolean;
    isSignup?: boolean;
  };

  const [isReady, setIsReady] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(!!params.isLogin || !!params.isSignup);

  useEffect(() => {
    const init = async () => {
      if (!user) await initUser();
      setIsReady(true);
    };
    init();
    toggleShowNavBar(true);
  }, []);

  useEffect(() => {
    if (Platform.OS === "web") {
      toggleShowNavBar(true);
    }
  }, [screenWidth]);

  useEffect(() => {
    setShowWelcomeModal(!!params.isLogin || !!params.isSignup);
  }, [params.isLogin, params.isSignup]);

  useEffect(() => {
    if (Platform.OS === "web" && (params.isSignup || params.isLogin)) {
      const timer = setTimeout(async () => {
        await unsubscribeNotificationsWeb();
        await subscribeToNotificationsWeb();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [params.isLogin, params.isSignup]);

  const closeWelcomeModal = () => {
    setShowWelcomeModal(false);
    navigation.setParams({ isLogin: undefined, isSignup: undefined });
  };

  return {
    user,
    isReady,
    showWelcomeModal,
    isLogin: !!params.isLogin,
    closeWelcomeModal,
  };
}
