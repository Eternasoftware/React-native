import React, { useEffect, useState } from "react";
import { useIsCompactLayout } from "@/hooks/useIsCompactLayout";
import { View, StyleSheet, Text, ScrollView, LayoutChangeEvent } from "react-native";
import { WorkoutType, ChallengeType } from "@/types/program.type";
import WorkoutNavHeader from "./WorkoutNavHeader";
import { colors } from "@/assets/styles/constants";

import DefaultButton from "@/components/common/DefaultButton";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import useSettingsStore from "@/store/settingsStore";
import { useShallow } from "zustand/react/shallow";
type ChallengeButtonScreenProps = {
  workout: WorkoutType;
  challenge: ChallengeType;
  onBack: () => void;
  onSkip: () => void;
  onNext: () => void;
};

const ChallengeButtonScreen: React.FC<ChallengeButtonScreenProps> = ({
  workout,
  challenge,
  onBack,
  onSkip = () => {},
  onNext,
}) => {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );
  const isCompact = useIsCompactLayout();
  const [isScrollable, setIsScrollable] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [descrText, setDescrText] = useState<React.ReactNode | null>(null);
  const handleContentSizeChange = (contentWidth: number, contentHeight: number) => {
    setIsScrollable(contentHeight > scrollViewHeight);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setScrollViewHeight(height);
  };

  useEffect(() => {
    if (challenge.isTimer) {
      setDescrText(
        <Text style={styles.listSentence}>
          {localization
            .t(LOCALIZATION_KEYS.TXT_CHALLENGE_DESC_1)
            .replace("{0}", challenge.duration)}
        </Text>
      );
    } else {
      setDescrText(null);
    }
  }, [challenge]);

  return (
    <View style={[styles.container, !isCompact && { paddingHorizontal: 32, paddingTop: 32 }]}>
      <WorkoutNavHeader
        text={localization.t(workout.title)}
        isBonus={!!challenge.isBonus}
        back={onBack}
      />
      <ScrollView
        scrollEnabled={isScrollable}
        onContentSizeChange={handleContentSizeChange}
        onLayout={handleLayout}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={[styles.list, !isCompact && { marginTop: 46 }]}>
            {challenge.isBonus ? (
              <>
                <Text style={styles.bonusText}>
                  {localization.t(LOCALIZATION_KEYS.SUBTITLE_BONUS_CHALLENGE)}
                </Text>
                {!!descrText && descrText}
                {workout.challenges[0].challengeStepsDescription.map((sentence, index) => {
                  const sentenceArray = localization.t(sentence).split("{0}");

                  const node = sentenceArray.map((txt: string, index: number) => {
                    return (
                      <Text key={index} style={styles.listSentence}>
                        {txt}
                        {index < sentenceArray.length - 1 && "\n"}
                      </Text>
                    );
                  });

                  return (
                    <View style={styles.listItem} key={index}>
                      <Text style={styles.itemNumber}>{index + 1}. </Text>
                      {node}
                    </View>
                  );
                })}

                <Text style={styles.goodLuck}>
                  {challenge.isTimer
                    ? localization.t(LOCALIZATION_KEYS.TXT_CHALLENGE_DESC_2)
                    : localization.t(LOCALIZATION_KEYS.TXT_CHALLENGE_DESC_3)}
                </Text>
              </>
            ) : (
              <>
                {!!descrText && descrText}
                {challenge.challengeStepsDescription.map((sentence, index) => {
                  const sentenceArray = localization.t(sentence).split("{0}");

                  const node = sentenceArray.map((txt: string, index: number) => {
                    return (
                      <Text key={index} style={styles.listSentence}>
                        {txt}
                        {index < sentenceArray.length - 1 && "\n"}
                      </Text>
                    );
                  });

                  return (
                    <View style={styles.listItem} key={index}>
                      <Text style={styles.itemNumber}>{index + 1}. </Text>
                      {node}
                    </View>
                  );
                })}

                <Text style={styles.goodLuck}>
                  {challenge.isTimer
                    ? localization.t(LOCALIZATION_KEYS.TXT_CHALLENGE_DESC_2)
                    : localization.t(LOCALIZATION_KEYS.TXT_CHALLENGE_DESC_3)}
                </Text>
              </>
            )}
          </View>
        </View>
      </ScrollView>
      <View style={[isCompact ? styles.buttonsContainer : styles.buttonsContainerWeb]}>
        <View style={[isCompact ? styles.buttons : styles.buttonsWeb]}>
          <DefaultButton
            text={localization.t(LOCALIZATION_KEYS.BTN_DONE)}
            bg={colors.action.primary}
            bgActive={colors.surface.card}
            width={244}
            py={8}
            onPress={onNext}
            color={colors.text.onLight}
            btnStyle={[styles.doneContainer]}
            textStyle={styles.buttonText}
            onPressStyle={{ borderColor: colors.surface.input, borderWidth: 1 }}
          ></DefaultButton>
          <DefaultButton
            text={localization.t(LOCALIZATION_KEYS.BTN_SKIP)}
            bg={colors.surface.button}
            bgActive={colors.action.primary}
            width={244}
            py={8}
            onPress={onSkip}
            textActive={colors.text.onLight}
            btnStyle={[styles.buttonContainer]}
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
  },
  scrollContent: {
    flex: 1,
  },
  content: {
    flex: 1,
    maxWidth: 546,
    width: "100%",
    marginHorizontal: "auto",
    justifyContent: "space-between",
  },
  list: {
    paddingHorizontal: 32,
    paddingVertical: 10,
    gap: 16,
    width: "100%",
  },
  listItem: {
    flexDirection: "row",
    display: "flex",
  },
  listSentence: {
    color: colors.text.body,
    fontFamily: "HelveticaNow-Regular",
    fontSize: 16,
  },
  itemNumber: {
    color: colors.text.accent,
    fontFamily: "HelveticaNow-Bold",
    fontSize: 16,
    marginRight: 9,
  },
  goodLuck: {
    color: colors.text.accent,
    fontFamily: "HelveticaNow-Medium",
    marginLeft: 26,
    fontSize: 18,
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
  doneContainer: {
    borderColor: "none",
    borderWidth: 0,
  },
  bonusText: {
    color: colors.accent.challenge,
    fontFamily: "NeueBit-Bold",
    fontSize: 28,
    textTransform: "uppercase",
  },
});

export default ChallengeButtonScreen;
