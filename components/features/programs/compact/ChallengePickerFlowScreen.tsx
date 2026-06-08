import React, { useState } from "react";
import { useIsCompactLayout } from "@/hooks/useIsCompactLayout";
import { View, StyleSheet, Text, ScrollView, LayoutChangeEvent } from "react-native";
import { WorkoutType, ChallengeType } from "@/types/program.type";
import WorkoutNavHeader from "./WorkoutNavHeader";
import { colors } from "@/assets/styles/constants";
import DefaultButton from "@/components/common/DefaultButton";
import NumberPicker from "@/components/common/NumberPicker";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import useSettingsStore from "@/store/settingsStore";
import { useShallow } from "zustand/react/shallow";

type ChallengePickerFlowScreenProps = {
  workout: WorkoutType;
  challenge: ChallengeType;
  isLastChallenge: boolean;
  onBack: () => void;
  onSkip: () => void;
  onNext: (val: number) => void;
};

const ChallengePickerFlowScreen: React.FC<ChallengePickerFlowScreenProps> = ({
  workout,
  challenge,
  onBack,
  onSkip,
  onNext,
}) => {
  const { localization, screenWidth } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
      screenWidth: s.screenWidth,
    }))
  );

  const isCompact = useIsCompactLayout();
  const [isScrollable, setIsScrollable] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [pickerValue, setPickerValue] = useState(0);

  const handleContentSizeChange = (contentWidth: number, contentHeight: number) => {
    setIsScrollable(contentHeight > scrollViewHeight);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setScrollViewHeight(height);
  };

  return (
    <View style={[styles.container, !isCompact && { paddingHorizontal: 32, paddingTop: 32 }]}>
      <View style={{ flex: 1 }}>
        <WorkoutNavHeader text={localization.t(workout.title)} back={onBack} />
        <ScrollView
          scrollEnabled={isScrollable}
          onContentSizeChange={handleContentSizeChange}
          onLayout={handleLayout}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.title}>
              {localization.t(LOCALIZATION_KEYS.TXT_HOW_MANY_ROUNDS_INPUT)}
            </Text>

            <View style={[styles.numberPickerContainer, { width: screenWidth }]}>
              <View
                style={[
                  styles.numberPicker,
                  {
                    left: (screenWidth - 400) / 2,
                    right: (screenWidth - 400) / 2,
                  },
                ]}
              >
                <NumberPicker
                  startValue={0}
                  endValue={10}
                  initialIndex={0}
                  onChange={(value) => setPickerValue(value)}
                />
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={[isCompact ? styles.buttonsContainer : styles.buttonsContainerWeb]}>
          <View style={[isCompact ? styles.buttons : styles.buttonsWeb]}>
            <DefaultButton
              text={localization.t(LOCALIZATION_KEYS.BTN_SUBMIT)}
              bg={colors.action.primary}
              bgActive={colors.surface.card}
              width={244}
              py={8}
              onPress={() => onNext(pickerValue)}
              color={colors.text.onLight}
              btnStyle={[styles.retryContainer]}
              textStyle={styles.buttonText}
              onPressStyle={{ borderColor: colors.surface.input, borderWidth: 1 }}
            ></DefaultButton>
            <DefaultButton
              text={localization.t(LOCALIZATION_KEYS.BTN_SKIP)}
              bg={colors.surface.app}
              bgActive={colors.action.primary}
              width={244}
              py={8}
              onPress={onSkip}
              btnStyle={[styles.buttonContainer]}
              textStyle={styles.buttonText}
              textActive={colors.text.onLight}
            ></DefaultButton>
          </View>
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
    flex: 1,
    maxWidth: 546,
    width: "100%",
    marginHorizontal: "auto",
    justifyContent: "space-evenly",
  },
  scrollContent: {
    backgroundColor: colors.surface.splash,
  },
  title: {
    color: colors.accent.challenge,
    fontFamily: "NeueBit-Bold",
    fontSize: 32,
    marginBottom: 12,
    paddingHorizontal: 16,
    textAlign: "center",
    textTransform: "capitalize",
  },
  results: {
    paddingVertical: 16,
    flexDirection: "row",
    gap: 11,
    minWidth: 330,
  },
  box: {
    backgroundColor: colors.surface.splash,
    minHeight: 100,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 16,
    gap: 26,
    flex: 1,
    alignItems: "center",
  },
  boxTitle: {
    fontFamily: "HelveticaNow-Bold",
    color: colors.text.accent,
    fontSize: 20,
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
    minWidth: 244,
    width: "100%",
    justifyContent: "center",
    borderRadius: 100,
    marginHorizontal: "auto",
    borderColor: colors.text.inverse,
  },
  numberPickerContainer: {
    width: "100%",
    height: 285,
    marginBottom: 60,
  },
  numberPicker: {
    position: "absolute",
  },
  subText: {
    fontSize: 14,
    marginHorizontal: 8,
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

export default ChallengePickerFlowScreen;
