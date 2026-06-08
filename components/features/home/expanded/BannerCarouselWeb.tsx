import { colors } from "@/assets/styles/constants";

import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ImageBackground, Linking } from "react-native";
import Swiper from "react-native-web-swiper";
import useSettingsStore from "@/store/settingsStore";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import DefaultButton from "@/components/common/DefaultButton";
import { useShallow } from "zustand/react/shallow";

const BannerCarouselWeb: React.FC = () => {
  const { banners, doHost, localization, screenWidth } = useSettingsStore(
    useShallow((s) => ({
      banners: s.banners,
      doHost: s.doHost,
      localization: s.localization,
      screenWidth: s.screenWidth,
    }))
  );

  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) => {
      console.error("Failed to open URL:", err);
    });
  };

  if (banners.length) {
    return (
      <View style={[styles.container, styles.containerMobile]}>
        <Swiper
          controlsEnabled={true}
          slideWrapperStyle={{
            paddingHorizontal: 16,
          }}
          loop={false}
          controlsProps={{
            prevPos: false,
            nextPos: false,
            dotsTouchable: true,
            dotProps: {
              badgeStyle: styles.dot,
            },
            dotActiveStyle: styles.activeDot,
          }}
          springConfig={{
            bounciness: 0,
          }}
        >
          {!!banners.length &&
            banners.map((banner) => (
              <View style={[styles.saleBanner, styles.saleBannerMobile]} key={banner.guid}>
                <ImageBackground
                  resizeMode={"cover"}
                  source={{
                    uri: doHost + "/" + banner.image,
                  }}
                  style={styles.img}
                >
                  <View style={styles.saleBlock}>
                    <View style={{ maxWidth: 216, gap: 4 }}>
                      <Text
                        allowFontScaling={false}
                        style={[styles.saleTitle, { color: banner.textColor || colors.text.body }]}
                        numberOfLines={2}
                      >
                        {localization.t(banner.title.trim())}
                      </Text>
                      <Text
                        allowFontScaling={false}
                        style={[styles.saleText, { color: banner.textColor || colors.text.body }]}
                      >
                        {localization.t(banner.text)}
                      </Text>
                    </View>
                    <View style={styles.button}>
                      <DefaultButton
                        text={localization.t(banner.button || LOCALIZATION_KEYS.BTN_MORE_INFO)}
                        bg={colors.text.inverse}
                        bgActive={colors.surface.card}
                        py={0}
                        onPress={() => openLink(banner.link)}
                        color={colors.surface.elevated}
                        btnStyle={[styles.buttonContainer]}
                        textStyle={styles.buttonText}
                        onPressStyle={{
                          borderColor: colors.surface.input,
                          borderWidth: 1,
                        }}
                      ></DefaultButton>
                    </View>
                  </View>
                </ImageBackground>
              </View>
            ))}
        </Swiper>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 18,
    paddingBottom: 2,
    height: "100%",
  },
  containerMobile: {
    maxHeight: 229,
    minHeight: 229,
  },
  saleBanner: {
    borderRadius: 12,
    flex: 1,
    flexDirection: "row",
    width: "100%",
    backgroundColor: colors.surface.box,
    overflow: "hidden",
    marginHorizontal: "auto",
    height: 229,
    maxHeight: 229,
    maxWidth: 540,
  },
  saleBannerMobile: {
    height: 180,
    maxHeight: 180,
  },
  saleBlock: {
    flex: 1,
    justifyContent: "space-between",
    minHeight: 128,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  saleTitle: {
    fontFamily: "HelveticaNow-ExtraBold",
    fontSize: 20,
    lineHeight: 24,
  },
  saleText: {
    color: colors.text.body,
    fontFamily: "HelveticaNow-Medium",
    fontSize: 12,
    lineHeight: 16,
  },
  shopNow: {},
  shopNowText: {
    fontFamily: "HelveticaNow-Medium",
    fontSize: 12,
    paddingHorizontal: 17,
    paddingVertical: 6,
    backgroundColor: colors.neutral.gray100,
    alignSelf: "flex-end",
    borderRadius: 5,
    lineHeight: 15,
  },
  img: {
    flex: 1,
  },
  button: {
    alignSelf: "flex-start",
    paddingBottom: 4,
  },
  buttonText: {
    fontFamily: "HelveticaNow-Bold",
    color: colors.text.onLight,
    fontSize: 12,
    textAlign: "center",
  },
  buttonContainer: {
    borderColor: "none",
    borderWidth: 0,
    minHeight: 23,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  dot: {
    backgroundColor: colors.border.onCard,
    width: 28,
    height: 4,
    borderRadius: 12,
    marginTop: 12,
  },
  activeDot: {
    backgroundColor: colors.action.primary,
    width: 28,
    height: 4,
    borderRadius: 12,
  },
});
export default React.memo(BannerCarouselWeb);
