import React, { useState } from "react";
import { useIsCompactLayout } from "@/hooks/useIsCompactLayout";
import { View, StyleSheet, Text, ScrollView, LayoutChangeEvent } from "react-native";
import DefaultButton from "@/components/common/DefaultButton";
import { colors } from "@/assets/styles/constants";
import NavHeader from "@/components/shared/NavHeader";
import NumberPicker from "@/components/common/NumberPicker";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import useSettingsStore from "@/store/settingsStore";
import { useShallow } from "zustand/react/shallow";

type AgeScreenProps = {
  onBack: () => void;
  onNext: (age: number) => void;
};

const AgeScreen: React.FC<AgeScreenProps> = ({ onBack, onNext }) => {
  const { localization, screenWidth } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
      screenWidth: s.screenWidth,
    }))
  );

  const [age, setAge] = useState(28);
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
      <View style={styles.content}>
        <NavHeader onBack={onBack} text="" />

        <View style={styles.mainBlock}>
          <View style={styles.textBlock}>
            <Text style={styles.title}>{localization.t(LOCALIZATION_KEYS.TITLE_AGE_SELECT)}</Text>
            <Text style={styles.descriptionText}>
              {localization.t(LOCALIZATION_KEYS.DESCR_AGE_SELECT)}
            </Text>
          </View>
          <ScrollView
            scrollEnabled={isScrollable}
            onContentSizeChange={handleContentSizeChange}
            onLayout={handleLayout}
            contentContainerStyle={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
          >
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
                <NumberPicker onChange={(age) => setAge(age)} />
              </View>
            </View>
          </ScrollView>
        </View>

        <DefaultButton
          text={localization.t(LOCALIZATION_KEYS.BTN_CONTINUE)}
          bg={colors.surface.app}
          bgActive={colors.action.primary}
          width={155}
          py={8}
          onPress={() => onNext(age)}
          textActive={colors.text.onLight}
          btnStyle={styles.button}
          color={colors.text.body}
          textStyle={styles.buttonText}
        ></DefaultButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: colors.surface.splash,
  },

  numberPickerContainer: {
    width: "100%",
    flexDirection: "row",
    height: 285,
  },
  numberPicker: {
    position: "absolute",
    top: 0,
  },
  content: {
    paddingVertical: 24,
    flex: 1,
    justifyContent: "space-between",
    overflow: "hidden",
  },
  mainBlock: {
    alignItems: "center",
    overflow: "hidden",
    flex: 1,
  },
  textBlock: {
    gap: 26,
    paddingHorizontal: 35,
  },
  title: {
    fontFamily: "HelveticaNow-Black",
    color: colors.text.body,
    fontSize: 24,
    textTransform: "capitalize",
    textAlign: "center",
    maxWidth: 476,
  },
  descriptionText: {
    fontFamily: "HelveticaNow-Regular",
    textAlign: "center",
    fontSize: 14,
    color: colors.text.body,
    maxWidth: 476,
    paddingBottom: 16,
  },
  button: {
    marginTop: 20,
    marginBottom: 33,
  },
  buttonText: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: colors.text.body,
    textAlign: "center",
  },
});

export default AgeScreen;
