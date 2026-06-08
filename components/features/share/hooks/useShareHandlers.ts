import type { RefObject } from "react";
import type { ShareSingleOptions } from "react-native-share";
import { Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { captureRef } from "react-native-view-shot";
import ViewShot from "react-native-view-shot";
import { ShareSlide, SocialList } from "@/types/share.type";
import { env } from "@/utils/config/env";
import { colors } from "@/assets/styles/constants";

type UseShareHandlersParams = {
  storyViewShotRef: RefObject<ViewShot | null>;
  viewShotRef: RefObject<(ViewShot | null)[]>;
  activeIndex: number;
  slides: ShareSlide[];
  setStoryBg: (bg: string | undefined) => void;
};

const APP_LINK = env.appLink;
const APP_ID_FB = env.facebookAppId;

const waitFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

const waitFrameChange = async () => {
  await waitFrame();
  await waitFrame();
};

export function useShareHandlers({
  storyViewShotRef,
  viewShotRef,
  activeIndex,
  slides,
  setStoryBg,
}: UseShareHandlersParams) {
  const getStoryViewShotBg = (destination?: SocialList) => {
    if (destination === SocialList.Instagram || destination === SocialList.FacebookStories) {
      return undefined;
    }
    return colors.surface.deep;
  };

  const getCapturedImage = async (destination?: SocialList) => {
    setStoryBg(getStoryViewShotBg(destination));
    await waitFrameChange();
    const ref = storyViewShotRef.current;
    if (!ref) return;
    return captureRef(ref, {
      format: "png",
      quality: 1,
      result: "tmpfile",
    });
  };

  const onShare = async (destination: SocialList) => {
    const uri = await getCapturedImage(destination);
    if (!uri) return;
    const { default: Share, Social } = await import("react-native-share");
    let shareOptions: ShareSingleOptions | undefined;

    switch (destination) {
      case SocialList.Instagram:
        shareOptions = {
          social: Social.InstagramStories,
          backgroundImage: slides[activeIndex].transparent ? undefined : uri,
          attributionURL: APP_LINK,
          appId: APP_ID_FB,
          stickerImage: slides[activeIndex].transparent ? uri : undefined,
          backgroundTopColor: colors.surface.deep,
          backgroundBottomColor: colors.surface.deep,
        };
        break;
      case SocialList.Whatsapp:
        shareOptions = { social: Social.Whatsapp, url: uri };
        break;
      case SocialList.Messenger:
        shareOptions = { social: Social.Messenger, url: uri };
        break;
      case SocialList.FacebookStories:
        shareOptions = {
          social: Social.FacebookStories,
          backgroundImage: slides[activeIndex].transparent ? undefined : uri,
          attributionURL: APP_LINK,
          appId: APP_ID_FB,
          stickerImage: slides[activeIndex].transparent ? uri : undefined,
          backgroundTopColor: colors.surface.deep,
          backgroundBottomColor: colors.surface.deep,
        };
        break;
    }

    try {
      if (shareOptions) {
        await Share.shareSingle(shareOptions);
      }
    } catch {
      Alert.alert("Something went wrong! Try it later");
    }
  };

  const onSaveImage = async () => {
    const ref = viewShotRef.current[activeIndex];
    if (!ref) return;
    const uri = await captureRef(ref, {
      format: "png",
      quality: 1,
      result: "tmpfile",
    });
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === "granted") {
      await MediaLibrary.saveToLibraryAsync(uri);
    }
  };

  const onCopyLink = async () => {
    await Clipboard.setStringAsync(APP_LINK);
  };

  const commonShare = async () => {
    const { default: Share } = await import("react-native-share");
    const uri = await getCapturedImage();
    if (uri && (await Sharing.isAvailableAsync())) {
      await Share.open({ url: uri, message: APP_LINK });
    }
  };

  return { onShare, onSaveImage, onCopyLink, commonShare };
}
