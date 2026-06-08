import { colors } from "@/assets/styles/constants";
import { useIsCompactLayout } from "@/hooks/useIsCompactLayout";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, LayoutChangeEvent } from "react-native";
import NavHeader from "@/components/shared/NavHeader";
import useSettingsStore from "@/store/settingsStore";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import TermsAPI from "@utils/api/terms";
import Markdown from "react-native-markdown-display";
import { TAB_BAR_OFFSET } from "@/utils/constants/tabs";
import { useShallow } from "zustand/react/shallow";

type TermsProps = {
  onBack: () => void;
};

const TermsScreen: React.FC<TermsProps> = ({ onBack }) => {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

  const isCompact = useIsCompactLayout();
  const [isScrollable, setIsScrollable] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [privacyPolicy, setPrivacyPolicy] = useState<string>("");
  const [termsOfService, setTermsOfService] = useState<string>("");

  const handleContentSizeChange = (contentWidth: number, contentHeight: number) => {
    setIsScrollable(contentHeight > scrollViewHeight);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setScrollViewHeight(height);
  };
  const getTerms = async () => {
    const [privacy, terms] = await Promise.all([
      TermsAPI.getPrivacyPolicy(),
      TermsAPI.getTermsOfService(),
    ]);
    setPrivacyPolicy(privacy.data);
    setTermsOfService(terms.data);
  };

  useEffect(() => {
    getTerms();
  }, []);

  return (
    <View style={[styles.container, !isCompact && { paddingHorizontal: 32, paddingTop: 32 }]}>
      <NavHeader onBack={onBack} text={localization.t(LOCALIZATION_KEYS.BTN_TOS_PP)}></NavHeader>
      <ScrollView
        scrollEnabled={isScrollable}
        onContentSizeChange={handleContentSizeChange}
        onLayout={handleLayout}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Markdown style={markdownStyles}>{privacyPolicy}</Markdown>
          <Markdown style={markdownStyles}>{termsOfService}</Markdown>
        </View>
        <View style={{ height: TAB_BAR_OFFSET }}></View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.splash,
  },
  content: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 16,
    maxWidth: 594,
    width: "100%",
    marginHorizontal: "auto",
  },
});

export const markdownStyles = {
  heading1: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text.body,
  },
  heading2: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text.body,
  },
  heading3: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text.body,
  },
  body: {
    fontSize: 16,
    color: colors.text.body,
  },
  link: {
    color: colors.text.body,
    textDecorationLine: "underline",
  },
  list_item: {
    marginVertical: 5,
    fontSize: 16,
  },
  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: colors.neutral.gray200,
    paddingLeft: 10,
    color: colors.text.body,
    fontStyle: "italic",
  },
  hr: {
    color: colors.text.body,
    backgroundColor: colors.surface.input,
    marginVertical: 12,
  },
};

export default React.memo(TermsScreen);
