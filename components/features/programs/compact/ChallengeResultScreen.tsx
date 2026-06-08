import React, { useEffect, useState } from "react";
import { useIsCompactLayout } from "@/hooks/useIsCompactLayout";
import { View, StyleSheet, Text, Platform } from "react-native";
import { WorkoutType } from "@/types/program.type";
import WorkoutNavHeader from "./WorkoutNavHeader";
import { colors } from "@/assets/styles/constants";
import DefaultButton from "@/components/common/DefaultButton";
import { formatSeconds } from "@/utils/functions";
import ProgressLostModal from "@/components/shared/modals/ProgressLostModal";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import useSettingsStore from "@/store/settingsStore";
import { useShallow } from "zustand/react/shallow";

type ChallengeResultScreenProps = {
  workout: WorkoutType;
  time: number;
  points: number;
  isLastChallenge: boolean;
  isInterrupted: boolean;
  onQuit: () => void;
  onRetry: () => void;
  onNext: () => void;
  onShare: () => void;
};

const ChallengeResultScreen: React.FC<ChallengeResultScreenProps> = ({
  workout,
  time = 0,
  points = 0,
  isLastChallenge = false,
  isInterrupted,
  onQuit,
  onRetry,
  onNext,
  onShare,
}) => {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

  const isCompact = useIsCompactLayout();
  const [showModal, setShowModal] = useState(false);
  const timeData = formatSeconds(time);
  const [nextBtnText, setNextBtnText] = useState(
    localization.t(LOCALIZATION_KEYS.BTN_NEXT_CHALLENGE)
  );

  const defineBtnText = () => {
    if (isInterrupted) {
      setNextBtnText(localization.t(LOCALIZATION_KEYS.BTN_NEXT));
    } else if (isLastChallenge) {
      setNextBtnText(localization.t(LOCALIZATION_KEYS.BTN_CLAIM_REWARD));
    } else {
      setNextBtnText(localization.t(LOCALIZATION_KEYS.BTN_NEXT_CHALLENGE));
    }
  };

  useEffect(() => {
    defineBtnText();
  }, [isInterrupted, isLastChallenge]);
  return (
    <View style={[styles.container, !isCompact && { paddingHorizontal: 32, paddingTop: 32 }]}>
      <ProgressLostModal
        isVisible={showModal}
        onClose={() => setShowModal(false)}
        onQuit={() => {
          setShowModal(false);
          onQuit();
        }}
      />
      <View>
        <WorkoutNavHeader
          text={localization.t(workout.title)}
          back={() => {
            setShowModal(true);
          }}
        />
        <View style={styles.content}>
          <Text style={styles.title}>{localization.t(LOCALIZATION_KEYS.TXT_YOUR_RESULTS)}</Text>

          <View style={styles.results}>
            <View style={[styles.box, { minWidth: 145 }]}>
              <Text style={styles.boxTitle}>
                {timeData.mm}
                <View style={{ minWidth: 8, height: 8 }}></View>
                <Text style={styles.subText}> Min </Text>
                <View style={{ minWidth: 8, height: 8 }}></View>
                {timeData.ss}
                <View style={{ minWidth: 8, height: 8 }}></View>
                <Text style={styles.subText}> Sec </Text>
              </Text>
              <Text style={styles.boxText}>{localization.t(LOCALIZATION_KEYS.TXT_YOUR_TIME)}</Text>
            </View>
            <View style={styles.box}>
              <Text style={styles.boxTitle}>{isInterrupted ? 0 : points}</Text>
              <Text style={styles.boxText}>{localization.t(LOCALIZATION_KEYS.TITLE_POINTS)}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={[isCompact ? styles.buttonsContainer : styles.buttonsContainerWeb]}>
        <View style={[isCompact ? styles.buttons : styles.buttonsWeb]}>
          <DefaultButton
            text={nextBtnText}
            bg={colors.action.primary}
            bgActive={colors.surface.card}
            width={244}
            py={8}
            onPress={onNext}
            color={colors.text.onLight}
            btnStyle={[styles.retryContainer]}
            textStyle={styles.buttonText}
            onPressStyle={{ borderColor: colors.surface.input, borderWidth: 1 }}
          ></DefaultButton>
          {Platform.OS !== "web" && (
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
            text={localization.t(LOCALIZATION_KEYS.BTN_RETRY)}
            bg={colors.surface.splash}
            bgActive={colors.action.primary}
            width={244}
            py={8}
            onPress={onRetry}
            btnStyle={[styles.buttonContainer]}
            textStyle={styles.buttonText}
            textActive={colors.text.onLight}
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
    paddingHorizontal: 16,
    maxWidth: 400,
    marginHorizontal: "auto",
    width: "100%",
    marginTop: 69,
  },
  title: {
    fontFamily: "HelveticaNow-Medium",
    fontSize: 20,
    color: colors.text.body,
    marginBottom: 12,
  },
  results: {
    paddingVertical: 16,
    flexDirection: "row",
    gap: 11,
    minWidth: 330,
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
  box: {
    backgroundColor: colors.surface.box,
    minHeight: 84,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 16,
    gap: 10,
    flex: 1,
    alignItems: "center",
  },
  boxTitle: {
    fontFamily: "HelveticaNow-Bold",
    color: colors.text.accent,
    fontSize: 20,
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
  subText: {
    fontSize: 14,
  },
  boxText: {
    fontFamily: "HelveticaNow-Bold",
    color: colors.text.body,
    fontSize: 16,
  },
  buttonText: {
    fontFamily: "HelveticaNow-Black",
    color: colors.text.onLight,
    fontSize: 18,
    textAlign: "center",
  },
  retryContainer: {
    borderColor: "none",
    borderWidth: 0,
  },
});

export default ChallengeResultScreen;
