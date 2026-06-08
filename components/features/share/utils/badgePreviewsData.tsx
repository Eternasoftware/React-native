import { colors } from "@/assets/styles/constants";
import PreviewBadgeOne from "../stickers/PreviewBadgeOne";
import PreviewBadgeTwo from "../stickers/PreviewBadgeTwo";
import { ShareData } from "@/components/shared/modals/ShareModal";
import { ShareSlide } from "@/types/share.type";
import { env } from "@/utils/config/env";

export const getBadgePreviews = (data: ShareData, scale: number = 1): ShareSlide[] => {
  return [
    {
      image: null,
      transparent: true,
      preview: (containerStyle: any) => (
        <PreviewBadgeOne
          badgeName={data.badgeName || ""}
          badgeImage={data.badgePreview || ""}
          containerStyle={containerStyle}
        />
      ),
      previewStyle: { height: "100%" },
      storyStyle: {
        transform: [{ scale: scale }],
        gap: 32,
      },
    },
    {
      image: `${env.doHost}/static-assets/share-bg/1.png`,
      transparent: false,
      preview: (containerStyle: any) => (
        <PreviewBadgeTwo
          badgeName={data.badgeName || ""}
          badgeImage={data.badgePreview || ""}
          containerStyle={containerStyle}
          resultColor={colors.text.onLight}
        />
      ),
      previewStyle: {
        justifyContent: "center",
        gap: 30,
        paddingBottom: 30,
      },
      storyStyle: {
        transform: [{ scale: scale }],
        gap: 30,
        paddingBottom: 30,
      },
    },
  ] as ShareSlide[];
};
