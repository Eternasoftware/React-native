import React, { useState } from "react";
import { useIsCompactLayout } from "@/hooks/useIsCompactLayout";
import { View, StyleSheet, Text, ScrollView, LayoutChangeEvent, Image } from "react-native";
import { colors } from "@/assets/styles/constants";
import DefaultButton from "@/components/common/DefaultButton";
import useSettingsStore from "@/store/settingsStore";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import WorkoutNavHeader from "@/components/features/programs/compact/WorkoutNavHeader";
import { useShallow } from "zustand/react/shallow";

type CompleteHackScreenProps = {
  title: string;
  nextPreview?: string;
  nextTitle?: string | undefined;
  isLastWorkout: boolean;
  back: () => void;
  onNext: () => void;
  toProgram: () => void;
};

const CompleteHackScreen: React.FC<CompleteHackScreenProps> = ({
  title,
  nextPreview,
  nextTitle,
  isLastWorkout,
  back,
  onNext,
  toProgram,
}) => {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

  const isCompact = useIsCompactLayout();
  const [isScrollable, setIsScrollable] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const handleContentSizeChange = (contentWidth: number, contentHeight: number) => {
    setIsScrollable(contentHeight > scrollViewHeight);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setScrollViewHeight(height);
  };

  return (
    <View style={[styles.container, !isCompact && { paddingHorizontal: 32, paddingTop: 32 }]}>
      <WorkoutNavHeader text={localization.t(title)} isBonus={false} back={back} />
      <ScrollView
        scrollEnabled={isScrollable}
        onContentSizeChange={handleContentSizeChange}
        onLayout={handleLayout}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {nextTitle && (
          <View style={styles.content}>
            <Image
              style={{ maxWidth: 300, height: 195, borderRadius: 5 }}
              source={{
                uri: nextPreview,
              }}
            />
            <Text style={styles.title}>
              {localization.t(LOCALIZATION_KEYS.TITLE_HACKS_COMPLETE)}
            </Text>
            {nextTitle && <Text style={styles.subText}>{localization.t(nextTitle)}</Text>}
          </View>
        )}
      </ScrollView>
      <View
        style={[{ zIndex: 10 }, isCompact ? styles.buttonsContainer : styles.buttonsContainerWeb]}
      >
        <View style={[isCompact ? styles.buttons : styles.buttonsWeb]}>
          {!isLastWorkout && (
            <DefaultButton
              text={localization.t(LOCALIZATION_KEYS.BTN_NEXT_WORKOUT)}
              bg={colors.action.primary}
              bgActive={colors.surface.card}
              width={244}
              py={8}
              onPress={onNext}
              color={colors.text.onLight}
              btnStyle={[styles.mainBtnContainer]}
              textStyle={styles.buttonText}
              onPressStyle={{ borderColor: colors.surface.input, borderWidth: 1 }}
            ></DefaultButton>
          )}
          <DefaultButton
            text={localization.t(LOCALIZATION_KEYS.BTN_REPLY)}
            bg={colors.surface.splash}
            bgActive={colors.action.primary}
            width={244}
            py={8}
            onPress={back}
            btnStyle={[styles.buttonContainer]}
            textStyle={styles.buttonText}
            textActive={colors.text.onLight}
          ></DefaultButton>
          <DefaultButton
            text={localization.t(LOCALIZATION_KEYS.BTN_EXIT)}
            bg={colors.surface.splash}
            bgActive={colors.action.primary}
            width={244}
            py={8}
            onPress={toProgram}
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
    overflow: "hidden",
    backgroundColor: colors.surface.splash,
  },
  scrollContent: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    maxWidth: 300,
    marginHorizontal: "auto",
    width: "100%",
    flex: 1,
    height: "100%",
    paddingTop: 24,
    justifyContent: "center",
  },
  title: {
    fontFamily: "HelveticaNow-ExtBlk",
    fontSize: 20,
    color: colors.text.body,
    marginTop: 14,
    marginBottom: 6,
  },
  subText: {
    fontFamily: "HelveticaNow-Medium",
    fontSize: 14,
    color: colors.text.body,
    textTransform: "uppercase",
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

export default CompleteHackScreen;
