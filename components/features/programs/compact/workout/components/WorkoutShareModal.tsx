import React from "react";
import { Platform } from "react-native";
import ShareModal, { ShareData, ShareType } from "@/components/shared/modals/ShareModal";

type WorkoutShareModalProps = {
  isVisible: boolean;
  shareType: ShareType;
  shareData: ShareData;
  onClose: () => void;
};

export const WorkoutShareModal: React.FC<WorkoutShareModalProps> = ({
  isVisible,
  shareType,
  shareData,
  onClose,
}) => {
  if (Platform.OS === "web") return null;

  return (
    <ShareModal
      isVisible={isVisible}
      onClose={onClose}
      type={shareType}
      data={shareData}
    />
  );
};
