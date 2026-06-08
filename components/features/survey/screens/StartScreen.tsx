import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  ScrollView,
  Platform,
  LayoutChangeEvent,
} from "react-native";
import DefaultButton from "@/components/common/DefaultButton";
import { colors } from "@/assets/styles/constants";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import useSettingsStore from "@/store/settingsStore";
import { useShallow } from "zustand/react/shallow";

type StartScreenProps = {
  onNext: () => void;
};

const StartScreen: React.FC<StartScreenProps> = ({ onNext }) => {
  const { doHost, localization, screenWidth } = useSettingsStore(
    useShallow((s) => ({
      doHost: s.doHost,
      localization: s.localization,
      screenWidth: s.screenWidth,
    }))
  );

  const img = doHost + "/static-assets/survey/1.png";
  const imgSm = doHost + "/static-assets/survey/sm/1.png";
  const imgWeb = doHost + "/static-assets/survey/web/1.webp";
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
    <View style={styles.container}>
      <ScrollView
        scrollEnabled={isScrollable}
        onContentSizeChange={handleContentSizeChange}
        onLayout={handleLayout}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <ImageBackground
            source={{
              uri: screenWidth < 500 ? imgSm : Platform.OS === "web" ? imgWeb : img,
            }}
            style={styles.image}
            resizeMode="cover"
            imageStyle={styles.imageStyle}
          ></ImageBackground>
        </View>
        <View style={styles.content}>
          <View>
            <Text style={styles.title}>{localization.t(LOCALIZATION_KEYS.TITLE_SETUP_START)}</Text>
            <Text style={styles.descriptionText}>
              {localization.t(LOCALIZATION_KEYS.DESCR_SETUP_START)}
            </Text>
          </View>
          <View style={{ marginBottom: 41 }}>
            <DefaultButton
              text={localization.t(LOCALIZATION_KEYS.BTN_NEXT)}
              bg={colors.surface.app}
              bgActive={colors.action.primary}
              width={155}
              py={8}
              onPress={onNext}
              textActive={colors.text.onLight}
              btnStyle={styles.button}
              color={colors.text.body}
              textStyle={styles.buttonText}
            ></DefaultButton>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flex: 1,
    backgroundColor: colors.surface.splash,
  },
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: colors.surface.splash,
  },
  image: {
    flex: 1,
    width: "100%",
  },
  imageStyle: {
    alignSelf: "flex-start",
    height: "100%",
    resizeMode: "cover",
    top: 0,
  },
  headerContainer: {
    position: "relative",
    flex: 1,
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 16,
    marginTop: 32,
  },
  title: {
    fontFamily: "HelveticaNow-Black",
    color: colors.text.accent,
    fontSize: 24,
    textTransform: "uppercase",
    textAlign: "center",
    maxWidth: 540,
  },
  descriptionText: {
    fontFamily: "HelveticaNow-Regular",
    textAlign: "center",
    fontSize: 14,
    color: colors.text.body,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 16,
    maxWidth: 540,
  },
  button: {
    marginTop: 20,
  },
  buttonText: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: colors.text.body,
    textAlign: "center",
  },
});

export default StartScreen;
