import { colors } from "@/assets/styles/constants";
import { useIsCompactLayout } from "@/hooks/useIsCompactLayout";
import { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutChangeEvent,
} from "react-native";
import NavHeader from "@/components/shared/NavHeader";
import ExpandableText from "./ExpandableText";
import useSettingsStore from "@/store/settingsStore";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import { TAB_BAR_OFFSET } from "@/utils/constants/tabs";
import { useShallow } from "zustand/react/shallow";

type FAQProps = {
  onBack: () => void;
};

const FAQScreen: React.FC<FAQProps> = ({ onBack }) => {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

  const isCompact = useIsCompactLayout();
  const [currentButton, setCurrentButton] = useState(0);
  const [isScrollable, setIsScrollable] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const FAQ_ALL = [
    {
      title: "Lorem ipsum dolor sit amet?",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent pellentesque congue lorem, vel tincidunt tortor placerat a. Proin ac diam quam. Aenean in sagittis magna, ut feugiat diam.",
    },
    {
      title: "Lorem ipsum dolor sit amet?",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent pellentesque congue lorem, vel tincidunt tortor placerat a. Proin ac diam quam. Aenean in sagittis magna, ut feugiat diam.",
    },
    {
      title: "Lorem ipsum dolor sit amet?",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent pellentesque congue lorem, vel tincidunt tortor placerat a. Proin ac diam quam. Aenean in sagittis magna, ut feugiat diam.",
    },
  ];
  const FAQ_ACCOUNT = [
    {
      title: "Lorem ipsum dolor sit amet?",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent pellentesque congue lorem, vel tincidunt tortor placerat a. Proin ac diam quam. Aenean in sagittis magna, ut feugiat diam.",
    },
    {
      title: "Lorem ipsum dolor sit amet?",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent pellentesque congue lorem, vel tincidunt tortor placerat a. Proin ac diam quam. Aenean in sagittis magna, ut feugiat diam.",
    },
    {
      title: "Lorem ipsum dolor sit amet?",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent pellentesque congue lorem, vel tincidunt tortor placerat a. Proin ac diam quam. Aenean in sagittis magna, ut feugiat diam.",
    },
  ];
  const handleContentSizeChange = (contentWidth: number, contentHeight: number) => {
    setIsScrollable(contentHeight > scrollViewHeight);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setScrollViewHeight(height);
  };

  return (
    <View style={[styles.container, !isCompact && { paddingHorizontal: 32, paddingTop: 32 }]}>
      <NavHeader onBack={onBack} text={localization.t(LOCALIZATION_KEYS.BTN_FAQ)}></NavHeader>
      <ScrollView
        scrollEnabled={isScrollable}
        onContentSizeChange={handleContentSizeChange}
        onLayout={handleLayout}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              activeOpacity={1}
              style={[
                styles.button,
                currentButton === 0 ? styles.mainButton : styles.regularButton,
              ]}
              onPress={() => setCurrentButton(0)}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    color: currentButton === 0 ? colors.surface.card : colors.surface.input,
                  },
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              style={[
                styles.button,
                currentButton === 1 ? styles.mainButton : styles.regularButton,
              ]}
              onPress={() => setCurrentButton(1)}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    color: currentButton === 1 ? colors.surface.card : colors.surface.input,
                  },
                ]}
              >
                Account
              </Text>
            </TouchableOpacity>
          </View>
          {currentButton === 0 ? (
            <View style={styles.list}>
              <View style={styles.hr}></View>
              {FAQ_ALL.map((item, index) => (
                <View key={index}>
                  <ExpandableText title={item.title} content={item.text} />
                  <View style={styles.hr}></View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.list}>
              <View style={styles.hr}></View>
              {FAQ_ACCOUNT.map((item, index) => (
                <View key={index}>
                  <ExpandableText title={item.title} content={item.text} />
                  <View style={styles.hr}></View>
                </View>
              ))}
            </View>
          )}
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
  buttonsContainer: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginBottom: 42,
  },
  button: {
    height: 32,
    borderRadius: 8,
    flex: 1,
    maxWidth: 154,
    justifyContent: "center",
  },
  buttonText: {
    textAlign: "center",
    color: colors.text.onLight,
    fontFamily: "HelveticaNow-Bold",
    fontSize: 14,
  },
  mainButton: {
    backgroundColor: colors.surface.input,
  },
  regularButton: {
    backgroundColor: colors.border.onCard,
  },
  list: {},
  hr: {
    borderColor: colors.border.default,
    borderWidth: 1,
    height: 2,
  },
});

export default FAQScreen;
