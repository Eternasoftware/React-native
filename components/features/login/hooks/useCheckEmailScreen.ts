import { useCallback, useEffect, useState } from "react";
import { Href, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useSettingsStore from "@/store/settingsStore";
import useUsersStore from "@/store/usersStore";
import { auth } from "@/firebaseConfig";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import type { PingAuthResult } from "@/types/auth.type";
import { useShallow } from "zustand/react/shallow";
import { useScrollOverflow } from "@/hooks/useScrollOverflow";
import { useResendCountdown } from "./useResendCountdown";

const LINK_ALIVE_SECONDS = 360;
const PING_INTERVAL_MS = 1000;

type UseCheckEmailScreenParams = {
  email: string;
  startChecker: boolean;
};

export function useCheckEmailScreen({ email, startChecker }: UseCheckEmailScreenParams) {
  const router = useRouter();

  const { localization, setIsNeedToLogin } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
      setIsNeedToLogin: s.setIsNeedToLogin,
    }))
  );

  const { convertGuestToEmailUser, initUser, loginUserFirebase, pingAuth } = useUsersStore(
    useShallow((s) => ({
      convertGuestToEmailUser: s.convertGuestToEmailUser,
      initUser: s.initUser,
      loginUserFirebase: s.loginUserFirebase,
      pingAuth: s.pingAuth,
    }))
  );

  const { countDown, isResendDisabled, startCountdown, clearCountdown } = useResendCountdown();
  const { isScrollable, handleContentSizeChange, handleLayout } = useScrollOverflow();

  const [isRun, setIsRun] = useState(false);
  const [showExpiredModal, setShowExpiredModal] = useState(false);

  const checkText = localization.t(LOCALIZATION_KEYS.TXT_CHECK_EMAIL).split("{0}");

  const handleAuthSuccess = useCallback(
    async (result: PingAuthResult) => {
      await AsyncStorage.setItem("userId", result.userId);
      await AsyncStorage.setItem("token", result.token);
      await AsyncStorage.removeItem("pendingEmail");

      let path: Href = "/survey";
      if (auth?.currentUser?.uid === result.firebaseId) {
        await convertGuestToEmailUser(email);
      } else {
        await loginUserFirebase(email);
        await initUser();
        path = "/?isLogin=true";
      }

      clearCountdown();
      setIsNeedToLogin(false);
      router.replace(path);
    },
    [
      clearCountdown,
      convertGuestToEmailUser,
      email,
      initUser,
      loginUserFirebase,
      router,
      setIsNeedToLogin,
    ]
  );

  useEffect(() => {
    setIsRun(startChecker);
  }, [startChecker]);

  useEffect(() => {
    if (!isRun) return;

    startCountdown();

    let linkAliveSec = LINK_ALIVE_SECONDS;
    const interval = setInterval(async () => {
      if (linkAliveSec < 0) {
        setShowExpiredModal(true);
        setIsRun(false);
        return;
      }

      linkAliveSec -= 1;

      const result = await pingAuth(email);
      if (result?.success) {
        clearInterval(interval);
        await handleAuthSuccess(result);
      }
    }, PING_INTERVAL_MS);

    return () => {
      clearInterval(interval);
      clearCountdown();
    };
  }, [clearCountdown, email, handleAuthSuccess, isRun, pingAuth, startCountdown]);

  const handleResend = useCallback(
    (onResend: () => void) => {
      setIsRun(true);
      startCountdown();
      onResend();
    },
    [startCountdown]
  );

  return {
    localization,
    checkText,
    isScrollable,
    handleContentSizeChange,
    handleLayout,
    countDown,
    isResendDisabled,
    showExpiredModal,
    setShowExpiredModal,
    handleResend,
  };
}
