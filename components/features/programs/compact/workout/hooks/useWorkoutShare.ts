import { useState } from "react";
import { WorkoutType } from "@/types/program.type";
import { ShareData, ShareType } from "@/components/shared/modals/ShareModal";

type UseWorkoutShareParams = {
  programName: string;
  workout: WorkoutType;
  localization: { t: (key: string) => string };
  challengeTime: number;
};

export function useWorkoutShare({
  programName,
  workout,
  localization,
  challengeTime,
}: UseWorkoutShareParams) {
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [shareType, setShareType] = useState<ShareType>(ShareType.WORKOUT);
  const [shareData, setShareData] = useState<ShareData>({
    programName,
    workoutName: workout.title,
    duration: 0,
  });

  const openWorkoutShare = () => {
    setShareType(ShareType.WORKOUT);
    setShareData({
      programName: localization.t(programName),
      workoutName: localization.t(workout.title),
      duration: challengeTime,
    });
    setIsShareModalVisible(true);
  };

  const openBadgeShare = () => {
    if (!workout.badge) return;
    setShareType(ShareType.BADGE);
    setShareData({
      programName: localization.t(programName),
      workoutName: localization.t(workout.title),
      duration: challengeTime,
      badgeName: localization.t(workout.badge.title),
      badgePreview: workout.badge.image,
    });
    setIsShareModalVisible(true);
  };

  return {
    isShareModalVisible,
    setIsShareModalVisible,
    shareType,
    shareData,
    openWorkoutShare,
    openBadgeShare,
  };
}
