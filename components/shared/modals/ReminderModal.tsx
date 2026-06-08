import { colors, withAlpha } from "@/assets/styles/constants";
import DefaultButton from "@/components/common/DefaultButton";
import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Modal } from "react-native";
import CloseIcon from "@icons/common/close-white.svg";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import useSettingsStore from "@/store/settingsStore";
import { useShallow } from "zustand/react/shallow";

type ReminderModal = {
  isVisible: boolean;
  onClose: () => void;
};

const ReminderModal: React.FC<ReminderModal> = ({ isVisible, onClose }) => {
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
            <CloseIcon />
          </TouchableOpacity>
          <Text style={styles.title}>{localization.t(LOCALIZATION_KEYS.TITLE_REMINDER)}</Text>
          <View style={styles.textContainer}>
            <Text style={styles.text}>{localization.t(LOCALIZATION_KEYS.TXT_REMINDER)}</Text>
            <Text style={styles.description}>
              {localization.t(LOCALIZATION_KEYS.DESCR_REMINDER)}
            </Text>
          </View>
          <View style={styles.buttons}>
            <DefaultButton
              text={localization.t(LOCALIZATION_KEYS.BTN_CONTINUE)}
              bg={colors.surface.card}
              bgActive={colors.action.primary}
              width={244}
              py={8}
              onPress={onClose}
              textActive={colors.text.onLight}
            ></DefaultButton>
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
    paddingTop: 8,
    paddingBottom: 35,
    position: "relative",
    maxWidth: 350,
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
    gap: 24,
    alignItems: "center",
    marginBottom: 37,
    marginTop: 25,
  },
  text: {
    fontFamily: "HelveticaNow-Bold",
    fontSize: 20,
    color: colors.text.body,
    textAlign: "center",
  },
  description: {
    fontFamily: "HelveticaNow-Regular",
    fontSize: 16,
    color: colors.text.accent,
    textAlign: "center",
  },
  buttons: {
    gap: 10,
  },
  button: {
    backgroundColor: colors.state.info,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});

export default ReminderModal;
