import { View, StyleSheet, Image, Text, ImageBackground, TouchableOpacity } from "react-native";
import ProgressDots from "@/components/common/ProgressDots";
import { colors, withAlpha } from "@/assets/styles/constants";

import DefaultButton from "@/components/common/DefaultButton";
import FitFlowMark from "@icons/app/fitflow-mark.svg";
import SlideUpAppear from "@/components/animations/SlideUpAppear";
import { ONBOARDING_SCREEN_DATA } from "@/utils/constants/onboarding";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import WorkoutIcon from "@/assets/icons/onboarding/workout.svg";
import NutritionIcon from "@/assets/icons/onboarding/nutrition.svg";
import CommunityIcon from "@/assets/icons/onboarding/community.svg";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";
import { useOnboardingPage } from "@/components/features/onboarding/hooks/useOnboardingPage";

export default function OnboardingPage() {
  const {
    step,
    isReady,
    localization,
    doHost,
    changeStep,
    delayChangeSlide,
    skipToLogin,
    getImageUri,
  } = useOnboardingPage();

  return (
    <View style={styles.container}>
      {isReady && (
        <View style={styles.container}>
          {step === 0 && (
            <ImageBackground
              source={{ uri: getImageUri(0, true) }}
              style={styles.image}
              resizeMode="cover"
            >
              <View style={styles.blackOverlay} />
              <TouchableOpacity style={styles.firstScreen} activeOpacity={1}>
                <SlideUpAppear
                  delay={0}
                  duration={600}
                  containerStyle={styles.welcomeTextContainer}
                >
                  <Text style={styles.welcomeText}>
                    {localization.t(LOCALIZATION_KEYS.SUBTITLE_LOGIN)}
                  </Text>
                </SlideUpAppear>
                <SlideUpAppear delay={600} duration={600} containerStyle={styles.logo}>
                  <Image
                    style={{ width: 99, height: 28 }}
                    source={{
                      uri: doHost + "/static-assets/app/fitflow-logo.png",
                    }}
                  />
                  <FitFlowMark style={{ paddingHorizontal: 4, marginTop: 8 }} />
                </SlideUpAppear>
                <SlideUpAppear
                  delay={1200}
                  duration={600}
                  containerStyle={styles.subtitleContainer}
                  action={delayChangeSlide}
                >
                  <Text style={styles.subtitleText}>
                    {localization.t(LOCALIZATION_KEYS.SUBTITLE_ONBOARDING)}
                  </Text>
                </SlideUpAppear>
              </TouchableOpacity>
            </ImageBackground>
          )}

          {step > 0 && (
            <View style={{ flex: 1 }}>
              <Animated.View
                entering={SlideInRight.duration(300)}
                exiting={SlideOutLeft.duration(300)}
                key={step}
                style={{ flex: 1 }}
              >
                <Image
                  source={{ uri: getImageUri(step, false) }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <TouchableOpacity style={styles.skip} onPress={skipToLogin}>
                  <Text style={styles.skipText}>{localization.t(LOCALIZATION_KEYS.BTN_SKIP)}</Text>
                </TouchableOpacity>
              </Animated.View>

              <View style={styles.stepScreen}>
                <Animated.View
                  entering={SlideInRight.duration(300)}
                  exiting={SlideOutLeft.duration(300)}
                  key={step}
                >
                  {ONBOARDING_SCREEN_DATA[step].icon === 1 && <WorkoutIcon style={styles.icon} />}
                  {ONBOARDING_SCREEN_DATA[step].icon === 2 && <NutritionIcon style={styles.icon} />}
                  {ONBOARDING_SCREEN_DATA[step].icon === 3 && <CommunityIcon style={styles.icon} />}
                  <Text style={styles.text}>
                    {localization?.t(ONBOARDING_SCREEN_DATA[step].text)}
                  </Text>
                </Animated.View>
                <View>
                  <View style={{ paddingBottom: 20 }}>
                    <ProgressDots totalDots={4} activeDot={step - 1} />
                  </View>
                  <DefaultButton
                    text={localization?.t(ONBOARDING_SCREEN_DATA[step].btnTxt)}
                    bg={colors.border.onCard}
                    textActive={colors.surface.cardMuted}
                    width={155}
                    py={10}
                    onPress={changeStep}
                  />
                </View>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    backgroundColor: colors.surface.splash,
  },
  firstScreen: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    maxHeight: 513,
    margin: "auto",
    zIndex: 1,
  },
  blackOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: withAlpha(colors.surface.overlay, 0.78),
  },
  image: {
    flex: 1,
    width: "100%",
    minWidth: "100%",
  },
  skip: {
    position: "absolute",
    top: 81,
    right: 16,
  },
  skipText: {
    color: colors.text.accent,
    fontSize: 18,
    padding: 10,
  },
  welcomeTextContainer: {
    alignSelf: "center",
  },
  welcomeText: {
    color: colors.text.accent,
    fontFamily: "HelveticaNow-ExtraBold",
    fontSize: 25,
    lineHeight: 32,
    textTransform: "uppercase",
  },
  logo: {
    marginHorizontal: "auto",
  },
  subtitleContainer: {},
  subtitleText: {
    fontFamily: "HelveticaNow-Bold",
    color: colors.text.body,
    textAlign: "center",
    fontSize: 20,
    maxWidth: 300,
  },
  stepScreen: {
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: colors.surface.splash,
    minHeight: 313,
    paddingTop: 20,
    paddingBottom: 68,
    zIndex: 1,
    justifyContent: "space-between",
  },
  icon: {
    height: 45,
    marginHorizontal: "auto",
  },
  text: {
    fontFamily: "HelveticaNow-Bold",
    color: colors.text.body,
    marginVertical: 22,
    textAlign: "center",
    fontSize: 20,
    maxWidth: 361,
    marginHorizontal: "auto",
  },
});
