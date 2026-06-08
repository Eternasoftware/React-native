import { colors, withAlpha } from "@/assets/styles/constants";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Modal, Image } from "react-native";
import CloseIcon from "@icons/common/close-white.svg";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import useSettingsStore from "@/store/settingsStore";
import { Achievement } from "@/types/users.type";
import { formatDateShort } from "@/utils/functions";
import { useShallow } from "zustand/react/shallow";

type AchievementModalProps = {
  achievement: Achievement;
  isVisible: boolean;
  onClose: () => void;
};

const AchievementModal: React.FC<AchievementModalProps> = ({ achievement, isVisible, onClose }) => {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

  const [description, setDescription] = useState("");

  useEffect(() => {
    if (localization) {
      const text =
        achievement.category === "program"
          ? localization.t(LOCALIZATION_KEYS.TXT_BADGE_DIALOG_PROGRAM)
          : localization.t(LOCALIZATION_KEYS.TXT_BADGE_DIALOG_WORKOUT);

      const title = localization.t(
        achievement.category === "program" ? achievement.programTitle : achievement.workoutTitle
      );
      const result = text.replace("{0}", title).replace("{1}", "");
      setDescription(result);
    }
  }, [achievement]);

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity activeOpacity={0.7} style={styles.close} onPress={onClose}>
            <CloseIcon style={{ width: 24 }} />
          </TouchableOpacity>
          <View style={styles.containerImg}>
            <Image resizeMode="contain" source={{ uri: achievement.image }} style={styles.img} />
          </View>
          <View style={styles.footer}>
            <Text style={styles.title}>{localization.t(achievement.title)}</Text>
            <View>
              <Text style={styles.text}>
                {description}
                <Text style={[styles.text, styles.noWrap]}>
                  {formatDateShort(new Date(achievement.dateEarnedAt)).split(" ").join("\u00A0")}
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: withAlpha(colors.surface.overlay, 0.5),
  },
  modalContent: {
    backgroundColor: colors.surface.box,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
    paddingVertical: 16,
    position: "relative",
    maxWidth: 450,
    minWidth: 310,
    gap: 16,
  },
  title: {
    color: colors.text.accent,
    fontFamily: "HelveticaNow-ExtraBold",
    fontSize: 20,
    textAlign: "center",
    textTransform: "uppercase",
    maxWidth: 313,
  },
  containerImg: {
    paddingTop: 36,
  },
  img: {
    minWidth: 180,
    minHeight: 180,
    maxWidth: 180,
    maxHeight: 180,
    marginHorizontal: "auto",
  },
  footer: {
    gap: 16,
    paddingBottom: 12,
    alignItems: "center",
  },
  text: {
    fontFamily: "HelveticaNow-Regular",
    color: colors.text.body,
    fontSize: 14,
    textAlign: "center",
    maxWidth: 258,
  },
  noWrap: {
    whiteSpace: "nowrap",
    textDecorationLine: "none",
  },
  close: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: 14,
    zIndex: 1,
  },
});

export default AchievementModal;
