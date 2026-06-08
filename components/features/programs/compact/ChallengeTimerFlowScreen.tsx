import React, { useEffect, useRef, useState } from "react";
import { useIsCompactLayout } from "@/hooks/useIsCompactLayout";
import { View, StyleSheet, Text, AppState } from "react-native";
import { WorkoutType } from "@/types/program.type";
import WorkoutNavHeader from "./WorkoutNavHeader";
import { colors } from "@/assets/styles/constants";
import DefaultButton from "@/components/common/DefaultButton";
import Countdown from "@/components/animations/CountDown";
import ChallengeTimer from "@/components/features/programs/shared/ChallengeTimer";
import PauseModal from "@/components/shared/modals/PauseModal";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import useSettingsStore from "@/store/settingsStore";
import { useShallow } from "zustand/react/shallow";

type ChallengeTimerFlowScreenProps = {
  isStart: boolean;
  isFocused: boolean;
  workout: WorkoutType;
  challengeIndex: number;
  onBack: () => void;
  onStop: (time: number) => void;
  onQuit: () => void;
};

const ChallengeTimerFlowScreen: React.FC<ChallengeTimerFlowScreenProps> = ({
  isStart = false,
  isFocused,
  workout,
  challengeIndex = 0,
  onBack,
  onStop,
  onQuit,
}) => {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

  const isCompact = useIsCompactLayout();
  const [isReady, setIsReady] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const subscription = useRef<any>(null);
  useEffect(() => {
    let interval: any = null;
    if (isActive && isReady) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, isReady]);

  const toggleTimer = (val: boolean) => {
    setShowModal(val);
    setIsActive(!val);
  };

  const handleAppStateChange = () => {
    if (isStart && isFocused) {
      if (subscription.current) {
        subscription.current.remove();
      }
      subscription.current = AppState.addEventListener("change", (nextAppState) => {
        if (appState === "active" && nextAppState.match(/inactive|background/)) {
          toggleTimer(true);
        }
        setAppState(nextAppState);
      });
    }
  };

  useEffect(() => {
    handleAppStateChange();
    return () => {
      if (subscription.current) {
        subscription.current.remove();
      }
    };
  }, [appState, isStart]);

  return (
    <View style={[styles.container, !isCompact && { paddingHorizontal: 32, paddingTop: 32 }]}>
      <PauseModal
        isVisible={showModal}
        onClose={() => toggleTimer(false)}
        onQuit={() => {
          setShowModal(false);
          if (subscription.current) {
            subscription.current.remove();
          }
          onQuit();
        }}
        onRestart={() => {
          setShowModal(false);
          onBack();
        }}
      />
      <WorkoutNavHeader text={localization.t(workout.title)} back={() => toggleTimer(true)} />
      <View style={styles.content}>
        {isReady && isStart && (
          <View style={{ paddingBottom: 25 }}>
            <ChallengeTimer
              isRun={isActive}
              amount={workout.challenges[challengeIndex].duration}
              extraTime={workout.challenges[challengeIndex].bonus?.bonusMaxValue || 0}
              finish={() => {
                if (subscription.current) {
                  subscription.current.remove();
                }
                onStop(seconds);
              }}
            />
          </View>
        )}
        {!isReady && isStart && (
          <View style={{ paddingBottom: 25 }}>
            <Text style={styles.ready}>{localization.t(LOCALIZATION_KEYS.TXT_GET_READY)}</Text>
            <Countdown
              amount={workout.challenges[challengeIndex].prepareTime || 3}
              finish={() => setIsReady(true)}
            />
          </View>
        )}
      </View>
      <View style={[isCompact ? styles.buttonsContainer : styles.buttonsContainerWeb]}>
        <View style={[isCompact ? styles.buttons : styles.buttonsWeb]}>
          <DefaultButton
            text={localization.t(LOCALIZATION_KEYS.BTN_STOP)}
            bg={colors.surface.button}
            bgActive={colors.action.secondaryPressed}
            disabled={!isReady}
            width={244}
            py={8}
            onPress={() => onStop(seconds)}
            btnStyle={styles.buttonContainer}
            textStyle={styles.buttonText}
          ></DefaultButton>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    justifyContent: "space-between",
  },
  content: {
    alignItems: "center",
    maxWidth: 546,
    width: "100%",
    marginHorizontal: "auto",
  },
  ready: {
    color: colors.text.accent,
    fontFamily: "HelveticaNow-Black",
    fontSize: 32,
  },
  buttonsContainer: {
    paddingTop: 32,
    paddingBottom: 42,
  },
  buttonsContainerWeb: {
    paddingTop: 32,
    paddingBottom: 97,
  },
  buttons: {
    minHeight: 106,
    gap: 14,
  },
  buttonsWeb: {
    minHeight: 116,
    gap: 24,
  },
  buttonContainer: {
    alignSelf: "flex-start",
    maxWidth: 244,
    width: "100%",
    justifyContent: "center",
    borderRadius: 100,
    marginHorizontal: "auto",
  },
  buttonText: {
    fontFamily: "HelveticaNow-Black",
    color: colors.text.body,
    fontSize: 18,
    textAlign: "center",
  },
});

export default ChallengeTimerFlowScreen;
