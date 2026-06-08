import { colors } from "@/assets/styles/constants";

import React, { useEffect, useState } from "react";
import { StyleSheet, ImageBackground } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Flow } from "react-native-animated-spinkit";
import { scheduleOnRN } from "react-native-worklets";

type SplashScreenMobileProps = {
  isVisible: boolean;
};

const SplashScreenMobile: React.FC<SplashScreenMobileProps> = ({ isVisible = true }) => {
  const [showScreen, setShowScreen] = useState(isVisible);
  const customSplashOpacity = useSharedValue(1);
  const dotsOpacity = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      setShowScreen(true);
      dotsOpacity.value = withTiming(1, { duration: 300 });
    } else {
      customSplashOpacity.value = withTiming(0, { duration: 300 }, () => {
        scheduleOnRN(setShowScreen, false);
      });
    }
  }, [isVisible]);

  const animatedSplashStyle = useAnimatedStyle(() => ({
    opacity: customSplashOpacity.value,
  }));
  const animatedDotsStyle = useAnimatedStyle(() => ({
    opacity: dotsOpacity.value,
  }));
  if (showScreen) {
    return (
      <Animated.View style={[styles.wrapper, animatedSplashStyle]}>
        <ImageBackground
          resizeMode={"cover"}
          source={require("./../../assets/images/splash.png")}
          style={{ minWidth: "100%", minHeight: "100%" }}
        ></ImageBackground>
        <Animated.View style={[styles.flow, animatedDotsStyle]}>
          <Flow size={48} color={colors.text.inverse} />
        </Animated.View>
      </Animated.View>
    );
  }
};

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 50,
    backgroundColor: colors.surface.app,
  },
  flow: {
    position: "absolute",
    bottom: 50,
    minWidth: "100%",
    alignItems: "center",
    zIndex: 51,
  },
});

export default SplashScreenMobile;
