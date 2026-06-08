import React, { useState } from "react";
import { useIsCompactLayout } from "@/hooks/useIsCompactLayout";
import { View, StyleSheet, ScrollView, LayoutChangeEvent } from "react-native";
import { colors } from "@/assets/styles/constants";
import DefaultButton from "@/components/common/DefaultButton";
import useSettingsStore from "@/store/settingsStore";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import WorkoutNavHeader from "@/components/features/programs/compact/WorkoutNavHeader";
import { WorkoutType } from "@/types/program.type";
import Markdown from "react-native-markdown-display";
import { markdownStyles } from "@/components/features/profile/screens/settings/Terms";
import { useShallow } from "zustand/react/shallow";

type WorkoutDescriptionScreenProps = {
  workout: WorkoutType;
  onBack: () => void;
  onNext: () => void;
};

const WorkoutDescriptionScreen: React.FC<WorkoutDescriptionScreenProps> = ({
  workout,
  onBack,
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
  const handleContentSizeChange = (contentWidth: number, contentHeight: number) => {
    setIsScrollable(contentHeight > scrollViewHeight);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setScrollViewHeight(height);
  };

  return (
    <View style={[styles.container, !isCompact && { paddingHorizontal: 32, paddingTop: 32 }]}>
      <WorkoutNavHeader text={localization.t(workout.title)} back={onBack} />
      <ScrollView
        scrollEnabled={isScrollable}
        onContentSizeChange={handleContentSizeChange}
        onLayout={handleLayout}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Markdown style={markdownStyles}>
            {localization.t(workout.workoutDescription).replace(/\\n/g, "\n")}
          </Markdown>
        </View>
      </ScrollView>
      <View
        style={[{ zIndex: 10 }, isCompact ? styles.buttonsContainer : styles.buttonsContainerWeb]}
      >
        <View style={[isCompact ? styles.buttons : styles.buttonsWeb]}>
          <DefaultButton
            text={localization.t(LOCALIZATION_KEYS.BTN_START)}
            bg={colors.state.success}
            bgActive={colors.state.successBright}
            width={244}
            py={8}
            onPress={onNext}
            btnStyle={[{ border: "none" }, styles.buttonContainer]}
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
    overflow: "hidden",
    backgroundColor: colors.surface.splash,
  },
  content: {
    paddingHorizontal: 32,
    marginHorizontal: "auto",
    width: "100%",
    flex: 1,
    height: "100%",
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
});

export default WorkoutDescriptionScreen;
