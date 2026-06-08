import React, { useEffect, useRef, useState } from "react";
import { useIsCompactLayout } from "@/hooks/useIsCompactLayout";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  LayoutChangeEvent,
  Platform,
  Image,
} from "react-native";
import { WorkoutType } from "@/types/program.type";
import { colors } from "@/assets/styles/constants";
import DefaultButton from "@/components/common/DefaultButton";
import useSettingsStore from "@/store/settingsStore";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import { format } from "react-string-format";
import LottieView from "lottie-react-native";
import { useShallow } from "zustand/react/shallow";
type ChallengeCongratsScreenProps = {
  isStart: boolean;
  workout: WorkoutType;
  points: number;
  showBadge: boolean;
  isLastWorkout: boolean;
  back: () => void;
  retry: () => void;
  next: () => void;
  toProgram: () => void;
  onShare: () => void;
};

const ChallengeCongratsScreen: React.FC<ChallengeCongratsScreenProps> = ({
  isStart = false,
  workout,
  points,
  showBadge = true,
  isLastWorkout,
  next,
  toProgram,
  onShare,
}) => {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

  const isCompact = useIsCompactLayout();
  const timeoutConfettiRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const scale = useSharedValue<number>(0);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value,
  }));

  useEffect(() => {
    if (isStart) {
      if (!showConfetti) {
        timeoutConfettiRef.current = setTimeout(() => {
          scale.value = withSpring(1);
          setShowConfetti(true);
        }, 500);
      } else {
        setTimeout(() => setShowConfetti(false), 1500);
      }
      return () => {
        if (timeoutConfettiRef.current) clearTimeout(timeoutConfettiRef.current);
      };
    }
  }, [isStart]);

  const handleContentSizeChange = (contentWidth: number, contentHeight: number) => {
    setIsScrollable(contentHeight > scrollViewHeight);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setScrollViewHeight(height);
  };

  return (
    <View style={[styles.container, !isCompact && { paddingHorizontal: 32, paddingTop: 32 }]}>
      <View style={styles.confettiContainer}>
        {showConfetti && (
          <LottieView
            source={require("../../../assets/lottie/Confetti/confettie-blue-2.json")}
            style={styles.confetti}
            autoPlay
            loop={false}
          />
        )}
      </View>
      <ScrollView
        scrollEnabled={isScrollable}
        onContentSizeChange={handleContentSizeChange}
        onLayout={handleLayout}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>{localization.t(LOCALIZATION_KEYS.TITLE_CONGRATS)}</Text>
          <View style={styles.subBlock}>
            <Text style={styles.subText}>
              {format(localization.t(LOCALIZATION_KEYS.DESCR_CONGRATS_1), points)}
            </Text>
            <Text style={styles.subText}>{localization.t(LOCALIZATION_KEYS.DESCR_CONGRATS_3)}</Text>
          </View>
          <View style={styles.badge}>
            <View style={styles.img}>
              {showConfetti && (
                <>
                  <LottieView
                    source={require("../../../assets/lottie/Cup/Cup.json")}
                    style={{ width: 200, height: 200 }}
                    autoPlay
                    loop={false}
                  />
                  <Animated.View style={[styles.cupPoints, animatedStyles]}>
                    <Text allowFontScaling={false} style={styles.cupText}>
                      {points}
                    </Text>
                  </Animated.View>
                  {showBadge && (
                    <Animated.View style={[styles.badgeImage, animatedStyles]}>
                      <Image
                        style={{ width: 72, height: 72 }}
                        source={{
                          uri: workout.badge.image,
                        }}
                      />
                    </Animated.View>
                  )}
                </>
              )}
            </View>
            {showBadge && (
              <Text style={styles.badgeTitle}>{localization.t(workout.badge.title)}</Text>
            )}
          </View>
        </View>
      </ScrollView>
      <View
        style={[{ zIndex: 10 }, isCompact ? styles.buttonsContainer : styles.buttonsContainerWeb]}
      >
        <View style={[isCompact ? styles.buttons : styles.buttonsWeb]}>
          {isLastWorkout ? (
            <>
              {showBadge && Platform.OS !== "web" && (
                <DefaultButton
                  text={localization.t(LOCALIZATION_KEYS.BTN_SHARE)}
                  bg={colors.surface.splash}
                  bgActive={colors.action.primary}
                  width={244}
                  py={8}
                  onPress={onShare}
                  btnStyle={[styles.buttonContainer]}
                  textStyle={styles.buttonText}
                  textActive={colors.text.onLight}
                ></DefaultButton>
              )}

              <DefaultButton
                text={localization.t(LOCALIZATION_KEYS.BTN_PROGRAM_OVERVIEW)}
                bg={colors.action.primary}
                bgActive={colors.surface.card}
                width={244}
                py={8}
                onPress={toProgram}
                color={colors.text.onLight}
                btnStyle={[styles.mainBtnContainer]}
                textStyle={styles.buttonText}
                onPressStyle={{ borderColor: colors.surface.input, borderWidth: 1 }}
              ></DefaultButton>
            </>
          ) : (
            <>
              <DefaultButton
                text={localization.t(LOCALIZATION_KEYS.BTN_NEXT_CHALLENGE)}
                bg={colors.action.primary}
                bgActive={colors.surface.card}
                width={244}
                py={8}
                onPress={next}
                color={colors.text.onLight}
                btnStyle={[styles.mainBtnContainer]}
                textStyle={styles.buttonText}
                onPressStyle={{ borderColor: colors.surface.input, borderWidth: 1 }}
              ></DefaultButton>
              {showBadge && Platform.OS !== "web" && (
                <DefaultButton
                  text={localization.t(LOCALIZATION_KEYS.BTN_SHARE)}
                  bg={colors.surface.splash}
                  bgActive={colors.action.primary}
                  width={244}
                  py={8}
                  onPress={onShare}
                  btnStyle={[styles.buttonContainer]}
                  textStyle={styles.buttonText}
                  textActive={colors.text.onLight}
                ></DefaultButton>
              )}
              <DefaultButton
                text={localization.t(LOCALIZATION_KEYS.BTN_PROGRAM_OVERVIEW)}
                bg={colors.surface.splash}
                bgActive={colors.action.primary}
                width={244}
                py={8}
                onPress={toProgram}
                btnStyle={[styles.buttonContainer]}
                textStyle={styles.buttonText}
                textActive={colors.text.onLight}
              ></DefaultButton>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
    backgroundColor: colors.surface.splash,
  },
  scrollContent: {
    justifyContent: "space-between",
    paddingTop: 40,
  },
  confettiContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    minWidth: "100%",
    minHeight: "100%",
  },
  confetti: {
    flex: 1,
    minWidth: "100%",
    zIndex: 2,
  },
  content: {
    paddingHorizontal: 16,
    maxWidth: 400,
    marginHorizontal: "auto",
    width: "100%",
    flex: 1,
    height: "100%",
    paddingTop: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "HelveticaNow-ExtBlk",
    fontSize: 40,
    color: colors.text.accent,
    marginBottom: 12,
    textAlign: "center",
  },
  subBlock: {
    marginVertical: 8,
    flexDirection: "column",
    alignItems: "center",
  },
  subText: {
    fontFamily: "HelveticaNow-Medium",
    fontSize: 14,
    color: colors.text.body,
  },
  badge: {
    paddingVertical: 20,
    gap: 16,
    alignItems: "center",
  },
  img: {
    minHeight: 200,
    height: 200,
    position: "relative",
  },
  cupPoints: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    marginTop: 35,
  },
  badgeImage: {
    position: "absolute",
    right: 17,
    bottom: 20,
    zIndex: 10,
  },
  cupText: {
    fontFamily: "HelveticaNow-Black",
    color: colors.state.orangeDeep,
    fontSize: 46,
    marginHorizontal: "auto",
    flex: 1,
  },
  badgeTitle: {
    fontFamily: "HelveticaNow-ExtraBold",
    fontSize: 20,
    color: colors.text.body,
    textTransform: "uppercase",
    textAlign: "center",
  },
  buttonsContainer: {
    paddingTop: 32,
    paddingBottom: 42,
  },
  buttonsContainerWeb: {
    paddingTop: 32,
    paddingBottom: 97,
  },
  buttonContainer: {
    alignSelf: "flex-start",
    maxWidth: 244,
    width: "100%",
    justifyContent: "center",
    borderRadius: 100,
    marginHorizontal: "auto",
    borderColor: colors.text.inverse,
  },
  buttons: {
    minHeight: 106,
    gap: 14,
  },
  buttonsWeb: {
    minHeight: 116,
    gap: 24,
  },
  buttonText: {
    fontFamily: "HelveticaNow-Black",
    color: colors.text.onLight,
    fontSize: 18,
    textAlign: "center",
  },
  mainBtnContainer: {
    borderColor: "none",
    borderWidth: 0,
  },
});

export default ChallengeCongratsScreen;
