import { Platform, StyleSheet, StatusBar } from "react-native";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import * as ScreenOrientation from "expo-screen-orientation";
import Toast from "react-native-toast-message";
import { colors } from "@/assets/styles/constants";
import { toastConfig } from "@/utils/configs/toast";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import LoginToWatchModal from "@/components/shared/modals/LoginToWatchModal";
import ConnectionErrorNativeModal from "@/components/shared/modals/ConnectionErrorNativeModal";
import InfoModal from "@/components/shared/modals/InfoModal";
import RateUsModal from "@/components/shared/modals/RateUsModal";
import SideBar from "@/components/features/shell/expanded/SideBar";
import SplashScreenWeb from "@/components/features/shell/expanded/SplashScreen";
import SplashScreenMobile from "@/components/features/shell/compact/SplashScreen";
import { useRootLayout } from "@/components/features/shell/hooks/useRootLayout";
import { useShellInsets } from "@/components/features/shell/hooks/useShellInsets";

export default function RootLayout() {
  const {
    isFullScreen,
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
  } = useRootLayout();

  const { paddingTop, paddingLeft, paddingRight } = useShellInsets({
    orientation,
    isFullScreen,
  });

  const animatedStyle = useAnimatedStyle(() => ({
    paddingTop: paddingTop.value,
    paddingBottom: 0,
    paddingLeft: paddingLeft.value,
    paddingRight: paddingRight.value,
  }));

  return (
    <SafeAreaProvider
      style={[
        styles.container,
        {
          backgroundColor: isFullScreen ? colors.surface.overlay : colors.surface.splash,
        },
      ]}
    >
      {Platform.OS !== "web" && <SplashScreenMobile isVisible={showCustomSplash} />}
      <Animated.View style={[styles.container, animatedStyle]}>
        <StatusBar
          hidden={orientation !== ScreenOrientation.OrientationLock.PORTRAIT_UP}
          animated={true}
        />

        {showWebSplashScreen && <SplashScreenWeb />}
        <ConnectionErrorNativeModal
          isVisible={isNetInfo === false && !isReady}
          onClose={async () => {
            await startApp();
          }}
        />
        {localization && isReady && (
          <InfoModal
            title={localization.t(LOCALIZATION_KEYS.TITLE_ERROR_CONNECTION)}
            text={localization.t(LOCALIZATION_KEYS.TXT_ERROR_CONNECTION)}
            buttonText={localization.t(LOCALIZATION_KEYS.BTN_BACK)}
            onClose={() => setShowConnectionError(false)}
            isVisible={showConnectionError}
          />
        )}

        {isReady && user && (
          <GestureHandlerRootView style={{ flex: 1, flexDirection: "row" }}>
            {!isCompact && Platform.OS == "web" && showNavBar && <SideBar />}
            <LoginToWatchModal
              isVisible={showLoginModal}
              onClose={() => toggleShowLoginModal(false)}
            />
            <RateUsModal isVisible={showRateUsModal} onClose={() => toggleShowRateUsModal(false)} />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.surface.app },
                animationTypeForReplace: "pop",
                animation: "slide_from_right",
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
              <Stack.Screen name="login" />
              <Stack.Screen name="onboarding" />
              <Stack.Screen name="survey" />
              <Stack.Screen name="support" />
              <Stack.Screen name="training-streak" />
            </Stack>
            <Toast config={toastConfig} />
          </GestureHandlerRootView>
        )}
      </Animated.View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
