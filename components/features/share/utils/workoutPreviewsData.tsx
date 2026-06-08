import { colors } from "@/assets/styles/constants";
import PreviewWorkoutOne from "../stickers/PreviewWorkoutOne";
import PreviewWorkoutTwo from "../stickers/PreviewWorkoutTwo";
import { ShareData } from "@/components/shared/modals/ShareModal";
import { ShareSlide } from "@/types/share.type";
import { env } from "@/utils/config/env";

export const getWorkoutPreviews = (data: ShareData, scale: number = 1): ShareSlide[] => {
  return [
    {
      image: null,
      transparent: true,
      preview: (containerStyle: any) => (
        <PreviewWorkoutOne
          programName={data.programName}
          workoutName={data.workoutName}
          duration={data.duration}
          containerStyle={containerStyle}
        />
      ),
      previewStyle: {},
      storyStyle: {
        justifyContent: "center",
        gap: 30,
        transform: [{ scale: scale }],
      },
    },
    {
      image: `${env.doHost}/static-assets/share-bg/2.png`,
      transparent: false,
      preview: (containerStyle: any) => (
        <PreviewWorkoutTwo
          programName={data.programName}
          workoutName={data.workoutName}
          duration={data.duration}
          containerStyle={containerStyle}
          resultColor={colors.text.onLight}
        />
      ),
      previewStyle: {
        justifyContent: "center",
        gap: 100,
        paddingBottom: 50,
      },
      storyStyle: {
        justifyContent: "center",
        gap: 120,
        paddingBottom: 60,
        transform: [{ scale: scale }],
      },
    },
  ] as ShareSlide[];
};
