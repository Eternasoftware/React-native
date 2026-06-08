import { colors } from "@/assets/styles/constants";
import React from "react";
import { Text, View, StyleSheet, ImageBackground, Linking } from "react-native";
import Swiper from "react-native-swiper";
import useSettingsStore from "@/store/settingsStore";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import DefaultButton from "@/components/common/DefaultButton";
import { useShallow } from "zustand/react/shallow";

const BannerCarousel: React.FC = () => {
  const { banners, localization } = useSettingsStore(
    useShallow((s) => ({
      banners: s.banners,
      localization: s.localization,
    }))
  );

  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) => {
      console.error("Failed to open URL:", err);
    });
  };

  return (
    <View style={styles.container}>
      <Swiper
        style={styles.wrapper}
        showsButtons={false}
        index={0}
        paginationStyle={{ bottom: 0 }}
        onIndexChanged={(index) => {}}
        dot={
          <View
            style={{
              backgroundColor: colors.border.onCard,
              width: 28,
              height: 4,
              borderRadius: 12,
              marginLeft: 3,
              marginRight: 3,
              marginTop: 3,
              marginBottom: 3,
            }}
          />
        }
        activeDot={
          <View
            style={{
              backgroundColor: colors.action.primary,
              width: 28,
              height: 4,
              borderRadius: 12,
              marginLeft: 3,
              marginRight: 3,
              marginTop: 3,
              marginBottom: 3,
            }}
          />
        }
      >
        {!!banners.length &&
          banners.map((banner) => (
            <View style={styles.saleBanner} key={banner.guid}>
              <View style={styles.imgContainer}>
                <ImageBackground
                  resizeMode={"cover"}
                  source={{
                    uri: banner.image,
                  }}
                  style={styles.img}
                ></ImageBackground>
              </View>

              <View style={styles.saleBlock}>
                <View>
                  <Text numberOfLines={1} style={styles.saleTitle}>
                    {banner.title}
                  </Text>
                  <Text numberOfLines={3} style={styles.saleText}>
                    {banner.text}
                  </Text>
                </View>
                <View style={styles.button}>
                  <DefaultButton
                    text={localization.t(LOCALIZATION_KEYS.BTN_MORE_INFO)}
                    bg={colors.action.primary}
                    bgActive={colors.surface.card}
                    width={244}
                    py={1}
                    onPress={() => openLink(banner.link)}
                    color={colors.surface.elevated}
                    btnStyle={[styles.buttonContainer]}
                    textStyle={styles.buttonText}
                    onPressStyle={{ borderColor: colors.surface.input, borderWidth: 1 }}
                  ></DefaultButton>
                </View>
              </View>
            </View>
          ))}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 13,
    paddingBottom: 2,
    maxHeight: 167,
    height: "100%",
    minHeight: 148,
  },
  wrapper: {
    maxWidth: 600,
    flex: 1,
    justifyContent: "space-between",
  },

  saleBanner: {
    borderRadius: 5,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    maxWidth: 600,
    width: "100%",
    backgroundColor: colors.surface.elevated,
    overflow: "hidden",
    marginHorizontal: "auto",
    height: 128,
    maxHeight: 128,
  },
  saleBlock: {
    minHeight: 128,
    flex: 1,
    paddingTop: 12,
    paddingLeft: 8,
    paddingRight: 8,
    paddingBottom: 8,
    justifyContent: "space-between",
  },
  saleTitle: {
    color: colors.text.accent,
    fontFamily: "HelveticaNow-ExtraBold",
    fontSize: 14,
    textTransform: "uppercase",
  },
  saleText: {
    marginTop: 10,
    color: colors.text.body,
    fontFamily: "HelveticaNow-Medium",
    fontSize: 12,
  },
  shopNow: {},
  shopNowText: {
    fontSize: 12,
    fontFamily: "HelveticaNow-Medium",
    paddingHorizontal: 17,
    paddingVertical: 6,
    backgroundColor: colors.neutral.gray100,
    alignSelf: "flex-end",
    borderRadius: 5,
    lineHeight: 15,
  },

  imgContainer: {},
  img: {
    minHeight: 128,
    width: 180,
  },
  button: {
    alignSelf: "flex-end",
    width: 96,
  },
  buttonText: {
    fontFamily: "HelveticaNow-Black",
    color: colors.text.onLight,
    fontSize: 12,
    textAlign: "center",
  },
  buttonContainer: {
    height: 24,
    borderColor: "none",
    borderWidth: 0,
    width: 96,
  },
});
export default BannerCarousel;
