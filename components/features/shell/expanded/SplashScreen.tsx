import { colors } from "@/assets/styles/constants";
import React from "react";
import { StyleSheet, Image, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import FitFlowMark from "@icons/app/fitflow-mark.svg";
import useSettingsStore from "@/store/settingsStore";
import { useShallow } from "zustand/react/shallow";

const SplashScreenWeb: React.FC = ({}) => {
  const { doHost } = useSettingsStore(
    useShallow((s) => ({
      doHost: s.doHost,
    }))
  );

  return (
    <Animated.View style={styles.wrapper} entering={FadeIn} exiting={FadeOut}>
      <View>
        <Image
          style={{ width: 99, height: 28 }}
          source={{
            uri: doHost + "/static-assets/app/fitflow-logo.png",
          }}
        />
        <FitFlowMark style={{ paddingHorizontal: 4, marginTop: 8 }} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    zIndex: 20,
    backgroundColor: colors.surface.splash,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SplashScreenWeb;
