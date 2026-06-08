import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { useRouter } from "expo-router";
import useSettingsStore from "@/store/settingsStore";
import { ONBOARDING_SCREEN_DATA } from "@/utils/constants/onboarding";
import { useShallow } from "zustand/react/shallow";

export function useOnboardingPage() {
  const {
    doHost,
    localization,
    screenWidth,
    showNavBar,
    showNavigation,
    toggleShowNavBar,
    toggleShowNavigation,
  } = useSettingsStore(
    useShallow((s) => ({
      doHost: s.doHost,
      localization: s.localization,
      screenWidth: s.screenWidth,
      showNavBar: s.showNavBar,
      showNavigation: s.showNavigation,
      toggleShowNavBar: s.toggleShowNavBar,
      toggleShowNavigation: s.toggleShowNavigation,
    }))
  );

  const [step, setStep] = useState(0);
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  const changeStep = () => {
    if (step < ONBOARDING_SCREEN_DATA.length - 1) {
      setStep(step + 1);
    }
    if (step === ONBOARDING_SCREEN_DATA.length - 1) {
      router.replace("/login");
    }
  };

  const delayChangeSlide = () => {
    setTimeout(changeStep, 1000);
  };

  const skipToLogin = () => {
    router.replace("/login");
  };

  const getImageUri = (stepIndex: number, isFirstScreen: boolean) => {
    const data = ONBOARDING_SCREEN_DATA[stepIndex];
    const threshold = isFirstScreen ? 500 : 800;
    if (screenWidth < threshold) {
      return doHost + data.imgSm;
    }
    if (Platform.OS === "web") {
      return doHost + data.imgWeb;
    }
    return doHost + data.img;
  };

  useEffect(() => {
    if (showNavBar) toggleShowNavBar(false);
    if (showNavigation) toggleShowNavigation(false);
    setIsReady(true);
  }, []);

  return {
    step,
    isReady,
    localization,
    doHost,
    changeStep,
    delayChangeSlide,
    skipToLogin,
    getImageUri,
  };
}
