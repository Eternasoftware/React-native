import React, { useEffect, useRef, useState } from "react";
import { useIsCompactLayout } from "@/hooks/useIsCompactLayout";
import { View, StyleSheet, Text, Platform, ScrollView, LayoutChangeEvent } from "react-native";
import { WorkoutType } from "@/types/program.type";
import { colors } from "@/assets/styles/constants";
import DefaultButton from "@/components/common/DefaultButton";
import { Player as LottiePlayer } from "@lottiefiles/react-lottie-player";
import useSettingsStore from "@/store/settingsStore";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import { format } from "react-string-format";
import { useShallow } from "zustand/react/shallow";

type ChallengeCongratsScreenProps = {
  workout: WorkoutType;
  points: number;
  showBadge: boolean;
  isLastWorkout: boolean;
  back: () => void;
  retry: () => void;
  next: () => void;
  toProgram: () => void;
};

const ChallengeCongratsScreen: React.FC<ChallengeCongratsScreenProps> = ({
  workout,
  points,
  showBadge = true,
  isLastWorkout,
  next,
  toProgram,
}) => {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );
  const isCompact = useIsCompactLayout();
  const timeoutConfettiRef: any = useRef(null);
  const timeoutCupRef: any = useRef(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCup, setShowCup] = useState(false);

  const scale = useSharedValue<number>(0);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    if (!showConfetti) {
      timeoutConfettiRef.current = setTimeout(() => {
        scale.value = withSpring(1);
        setShowConfetti(true);
      }, 500);
      timeoutCupRef.current = setTimeout(() => setShowCup(true), 0);
      setShowCup(true);
    } else {
      setTimeout(() => setShowConfetti(false), 1500);
    }

    return () => {
      clearTimeout(timeoutConfettiRef.current);
      clearTimeout(timeoutCupRef.current);
    };
  }, []);

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
          <LottiePlayer
            src={require("../../../assets/lottie/Confetti/confettie-blue.json")}
            style={styles.confetti}
            autoplay={true}
            keepLastFrame
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
              {showConfetti && Platform.OS === "web" && (
                <>
                  <LottiePlayer
                    src={"../../../assets/lottie/Cup/Cup.json"}
                    loop={false}
                    autoplay={true}
                    keepLastFrame
                    style={{ width: 200, height: 200 }}
                  />
                  <Animated.View style={[styles.cupPoints, animatedStyles]}>
                    <Text style={styles.cupText}>{points}</Text>
                  </Animated.View>
                </>
              )}
            </View>
            {showBadge && (
              <Text style={styles.badgeTitle}>{localization.t(workout.badge.title)}</Text>
            )}
          </View>
        </View>
      </ScrollView>
      <View style={[isCompact ? styles.buttonsContainer : styles.buttonsContainerWeb]}>
        <View style={[isCompact ? styles.buttons : styles.buttonsWeb]}>
          {isLastWorkout ? (
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
              <DefaultButton
                text={localization.t(LOCALIZATION_KEYS.BTN_PROGRAM_OVERVIEW)}
                bg={colors.surface.app}
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
    backgroundColor: colors.surface.app,
  },
  scrollContent: {
    flex: 1,
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
    minHeight: "100%",
    zIndex: 10,
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
});

export default ChallengeCongratsScreen;
