import { colors, withAlpha } from "@/assets/styles/constants";
import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Modal } from "react-native";
import CloseIcon from "@icons/common/close-white.svg";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import useSettingsStore from "@/store/settingsStore";
import CloseRedIcon from "@icons/common/close-red.svg";
import { useShallow } from "zustand/react/shallow";

type ExpiredModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

const ExpiredModal: React.FC<ExpiredModalProps> = ({ isVisible, onClose }) => {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity activeOpacity={0.7} style={styles.close} onPress={onClose}>
            <CloseIcon style={{ width: 24 }} />
          </TouchableOpacity>
          <View style={styles.textContainer}>
            <Text style={styles.text}>{localization.t(LOCALIZATION_KEYS.TXT_EXPIRED)}</Text>
          </View>
          <View style={styles.iconContainer}>
            <CloseRedIcon />
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
    backgroundColor: colors.surface.card,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: "center",
    paddingVertical: 52,
    position: "relative",
    maxWidth: 350,
    minWidth: 310,
    gap: 32,
  },
  close: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: 14,
    zIndex: 1,
  },
  title: {
    fontFamily: "HelveticaNow-Black",
    fontSize: 24,
    marginBottom: 32,
    color: colors.text.body,
    marginTop: 4,
  },
  textContainer: {
    alignItems: "center",
  },
  text: {
    fontFamily: "HelveticaNow-Bold",
    fontSize: 20,
    color: colors.text.body,
    textAlign: "center",
  },
  name: {
    fontFamily: "HelveticaNow-Black",
    fontSize: 20,
    color: colors.text.accent,
    textAlign: "center",
  },
  iconContainer: {
    minWidth: 60,
    minHeight: 60,
    maxWidth: 60,
    maxHeight: 60,
  },
});

export default ExpiredModal;
