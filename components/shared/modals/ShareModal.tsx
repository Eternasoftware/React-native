import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  Animated,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  LayoutChangeEvent,
} from "react-native";
import ViewShot from "react-native-view-shot";
import { colors } from "@/assets/styles/constants";
import CloseIcon from "@icons/common/close-white.svg";
import LinkIcon from "@icons/common/link.svg";
import DownloadIcon from "@icons/common/download.svg";
import CheckMarkIcon from "@icons/common/check-mark.svg";
import InstagramIcon from "@icons/social/instagram.svg";
import FacebookIcon from "@icons/social/facebook.svg";
import WhatsappIcon from "@icons/social/whats-app.svg";
import MessengerIcon from "@icons/social/messenger.svg";
import useSettingsStore from "@/store/settingsStore";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import ProgressDots from "@/components/common/ProgressDots";
import { getWorkoutPreviews } from "@/components/features/share/utils/workoutPreviewsData";
import { getBadgePreviews } from "@/components/features/share/utils/badgePreviewsData";
import AnimatedIconButton from "@/components/common/AnimatedIconButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ShareSlide, SocialList } from "@/types/share.type";
import { useShareHandlers } from "@/components/features/share/hooks/useShareHandlers";
import { useShallow } from "zustand/react/shallow";

export enum ShareType {
  WORKOUT = "workout",
  BADGE = "badge",
}

export type ShareData = {
  programName: string;
  workoutName: string;
  duration: number;
  badgePreview?: string;
  badgeName?: string;
};

type ShareModalProps = {
  isVisible: boolean;
  onClose: () => void;
  type?: ShareType;
  data: ShareData;
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const ITEM_WIDTH = SCREEN_WIDTH * 0.8;
const SIDE_PADDING = (SCREEN_WIDTH - ITEM_WIDTH) / 2;
const getScale = () => {
  if (SCREEN_WIDTH + SIDE_PADDING <= 393) {
    return 1;
  } else {
    return SCREEN_WIDTH / (SCREEN_WIDTH * 0.8);
  }
};

export default function ShareModal({ type, data, isVisible, onClose }: ShareModalProps) {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

  const viewShotRef = useRef<(ViewShot | null)[]>([]);
  const storyViewShotRef = useRef<ViewShot | null>(null);
  const [storyBg, setStoryBg] = useState<string | undefined>(undefined);
  const insets = useSafeAreaInsets();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [slides, setSlides] = useState<ShareSlide[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrollable, setIsScrollable] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);

  const { onShare, onSaveImage, onCopyLink, commonShare } = useShareHandlers({
    storyViewShotRef,
    viewShotRef,
    activeIndex,
    slides,
    setStoryBg,
  });

  useEffect(() => {
    if (type === ShareType.WORKOUT && data) {
      setSlides(getWorkoutPreviews(data, getScale()));
    } else if (type === ShareType.BADGE && data?.badgePreview) {
      setSlides(getBadgePreviews(data, getScale()));
    }
  }, [type, data]);

  const handleContentSizeChange = (contentWidth: number, contentHeight: number) => {
    setIsScrollable(contentHeight > scrollViewHeight);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setScrollViewHeight(height);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <ViewShot
        ref={storyViewShotRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: storyBg,
          zIndex: -10,
        }}
        options={{ format: "png", quality: 1 }}
      >
        <View style={{ flex: 1 }}>
          {slides[activeIndex] && !slides[activeIndex].transparent && (
            <Image
              source={{ uri: slides[activeIndex].image! }}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
              }}
              resizeMode="cover"
            />
          )}
          {slides[activeIndex] && slides[activeIndex].preview(slides[activeIndex].storyStyle)}
        </View>
      </ViewShot>
      <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
        <View style={styles.modalHeader}>
          <Text style={styles.title}>{localization.t(LOCALIZATION_KEYS.TITLE_SHARE)}</Text>
          <TouchableOpacity activeOpacity={0.7} style={styles.close} onPress={onClose}>
            <CloseIcon />
          </TouchableOpacity>
        </View>
        <ScrollView
          scrollEnabled={isScrollable}
          onContentSizeChange={handleContentSizeChange}
          onLayout={handleLayout}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.content]}>
            <View style={styles.carousel}>
              <Animated.ScrollView
                horizontal
                snapToInterval={ITEM_WIDTH}
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: SIDE_PADDING }}
                onScroll={Animated.event(
                  [
                    {
                      nativeEvent: { contentOffset: { x: scrollX } },
                    },
                  ],
                  {
                    listener: (e: any) => {
                      const idx = Math.round(e.nativeEvent.contentOffset.x / ITEM_WIDTH);
                      setActiveIndex(idx);
                    },
                    useNativeDriver: true,
                  }
                )}
                scrollEventThrottle={16}
                style={{ flexGrow: 0 }}
              >
                {slides.map((slide, index) => {
                  const inputRange = [
                    (index - 1) * ITEM_WIDTH,
                    index * ITEM_WIDTH,
                    (index + 1) * ITEM_WIDTH,
                  ];
                  const scale = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.85, 1, 0.85],
                    extrapolate: "clamp",
                  });

                  return (
                    <Animated.View
                      key={index}
                      style={{
                        width: ITEM_WIDTH,
                        transform: [{ scale }],
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <Image
                        source={require("./../../../assets/images/common/transparent.png")}
                        style={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                        }}
                        resizeMode="cover"
                      />
                      <View style={styles.transparentButton}>
                        <Text style={styles.transparentButtonText}>
                          {localization.t(LOCALIZATION_KEYS.BTN_TRANSPARENT)}
                        </Text>
                      </View>
                      <ViewShot
                        ref={(r) => {
                          viewShotRef.current[index] = r;
                        }}
                        style={{
                          width: "100%",
                          height: 400,
                          backgroundColor: "transparent",
                          zIndex: 2,
                        }}
                        options={{ format: "png", quality: 1 }}
                      >
                        <View style={{ flex: 1 }}>
                          {!slide.transparent && (
                            <Image
                              source={{ uri: slide.image! }}
                              style={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                              }}
                              resizeMode="cover"
                            />
                          )}
                          {slide.preview(slide.previewStyle)}
                        </View>
                      </ViewShot>
                    </Animated.View>
                  );
                })}
              </Animated.ScrollView>
              <ProgressDots totalDots={slides.length} activeDot={activeIndex}></ProgressDots>
            </View>

            {Platform.OS === "android" && (
              <View style={styles.shareOptionsContainer}>
                <View style={styles.shareOptionsContainerRow}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.shareOptionButton}
                    onPress={() => onShare(SocialList.Instagram)}
                  >
                    <View style={styles.shareOptionButtonIconContainer}>
                      <InstagramIcon />
                    </View>
                    <Text style={styles.shareOptionButtonText}>
                      {localization.t(LOCALIZATION_KEYS.BTN_INSTAGRAM)}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.shareOptionButton}
                    onPress={() => onShare(SocialList.Whatsapp)}
                  >
                    <View style={styles.shareOptionButtonIconContainer}>
                      <WhatsappIcon />
                    </View>
                    <Text style={styles.shareOptionButtonText}>
                      {localization.t(LOCALIZATION_KEYS.BTN_WHATSAPP)}
                    </Text>
                  </TouchableOpacity>
                  <AnimatedIconButton
                    onPress={onCopyLink}
                    label={localization.t(LOCALIZATION_KEYS.BTN_SHARE_LINK)}
                    PrimaryIcon={LinkIcon}
                    SuccessIcon={CheckMarkIcon}
                  />
                </View>
                <View style={styles.shareOptionsContainerRow}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.shareOptionButton}
                    onPress={() => onShare(SocialList.FacebookStories)}
                  >
                    <View style={styles.shareOptionButtonIconContainer}>
                      <FacebookIcon />
                    </View>
                    <Text style={styles.shareOptionButtonText}>
                      {localization.t(LOCALIZATION_KEYS.BTN_FACEBOOK)}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.shareOptionButton}
                    onPress={() => onShare(SocialList.Messenger)}
                  >
                    <View style={styles.shareOptionButtonIconContainer}>
                      <MessengerIcon />
                    </View>
                    <Text style={styles.shareOptionButtonText}>
                      {localization.t(LOCALIZATION_KEYS.BTN_MESSENGER)}
                    </Text>
                  </TouchableOpacity>
                  <AnimatedIconButton
                    onPress={onSaveImage}
                    label={localization.t(LOCALIZATION_KEYS.BTN_DOWNLOAD_IMG)}
                    PrimaryIcon={DownloadIcon}
                    SuccessIcon={CheckMarkIcon}
                  />
                </View>
              </View>
            )}
            {Platform.OS === "ios" && (
              <View style={styles.shareOptionsContainer}>
                <View style={[styles.shareOptionsContainerRow, { justifyContent: "space-around" }]}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.shareOptionButton}
                    onPress={commonShare}
                  >
                    <View style={styles.shareOptionButtonIconContainer}>
                      <LinkIcon />
                    </View>
                    <Text style={styles.shareOptionButtonText}>
                      {localization.t(LOCALIZATION_KEYS.BTN_SHARE_LINK)}
                    </Text>
                  </TouchableOpacity>
                  <AnimatedIconButton
                    onPress={onSaveImage}
                    label={localization.t(LOCALIZATION_KEYS.BTN_DOWNLOAD_IMG)}
                    PrimaryIcon={DownloadIcon}
                    SuccessIcon={CheckMarkIcon}
                  />
                </View>
                <View style={[styles.shareOptionsContainerRow, { justifyContent: "space-around" }]}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.shareOptionButton}
                    onPress={() => onShare(SocialList.Instagram)}
                  >
                    <View style={styles.shareOptionButtonIconContainer}>
                      <InstagramIcon />
                    </View>
                    <Text style={styles.shareOptionButtonText}>
                      {localization.t(LOCALIZATION_KEYS.BTN_INSTAGRAM)}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.shareOptionButton}
                    onPress={() => onShare(SocialList.FacebookStories)}
                  >
                    <View style={styles.shareOptionButtonIconContainer}>
                      <FacebookIcon />
                    </View>
                    <Text style={styles.shareOptionButtonText}>
                      {localization.t(LOCALIZATION_KEYS.BTN_FACEBOOK)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: colors.surface.splash,
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    position: "relative",
  },
  content: {
    flex: 1,
    backgroundColor: colors.surface.splash,
    paddingBottom: 49,
    alignItems: "center",
    justifyContent: "space-between",
    gap: 38,
    position: "relative",
  },
  modalHeader: {
    alignItems: "center",
    width: "100%",
    paddingVertical: 16,
    position: "relative",
    paddingHorizontal: 30,
  },
  close: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    padding: 16,
    zIndex: 1,
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 15,
    color: colors.text.body,
  },
  previewWorkoutOneContainer: {
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 39,
    margin: "auto",
    width: "100%",
    gap: 16,
    height: "100%",
    justifyContent: "space-between",
  },
  previewWorkoutTwoContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 39,
    margin: "auto",
    width: "100%",
    gap: 16,
    height: "100%",
    justifyContent: "space-between",
  },
  previewTitle: {
    fontFamily: "Poppins-BlackItalic",
    fontSize: 16,
    color: colors.text.accent,
    textTransform: "uppercase",
    textAlign: "center",
  },
  previewSubtitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 10,
    color: colors.text.accent,
    textTransform: "uppercase",
    textAlign: "center",
  },
  previewText: {
    fontFamily: "Poppins-SemiBoldItalic",
    fontSize: 13,
    color: colors.text.accent,
    textTransform: "uppercase",
    textAlign: "center",
  },
  fitflowLogo: {
    flexDirection: "column",
    marginHorizontal: "auto",
  },
  transparentButton: {
    position: "absolute",
    top: 5,
    left: 6,
    zIndex: 1,
    backgroundColor: colors.surface.overlay,
    borderRadius: 7,
  },
  transparentButtonText: {
    fontFamily: "HelveticaNow-Bold",
    fontSize: 10,
    color: colors.text.body,
    textTransform: "uppercase",
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  carousel: {
    gap: 24,
  },
  shareOptionsContainer: {
    gap: 20,
    paddingHorizontal: 30,
    width: "100%",
  },
  shareOptionsContainerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 24,
  },
  shareOptionButton: {
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },
  shareOptionButtonIconContainer: {
    width: 55,
    height: 55,
    backgroundColor: colors.surface.box,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
  },
  shareOptionButtonText: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: colors.text.body,
  },
});
