import { colors, withAlpha } from "@/assets/styles/constants";
import DefaultButton from "@/components/common/DefaultButton";
import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Modal } from "react-native";
import CloseIcon from "@icons/common/close-white.svg";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import useSettingsStore from "@/store/settingsStore";
import { useShallow } from "zustand/react/shallow";

type ProgressLostModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onQuit: () => void;
};

const ProgressLostModal: React.FC<ProgressLostModalProps> = ({ isVisible, onClose, onQuit }) => {
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
          <Text style={styles.title}>Progress Will Be Lost</Text>
          <Text style={styles.text}>
            If you exit now, your progress won’t be saved, and you’ll need to start over next time.
          </Text>
          <View style={styles.buttons}>
            <DefaultButton
              text={localization.t(LOCALIZATION_KEYS.BTN_QUIT)}
              bg={colors.surface.card}
              bgActive={colors.action.primary}
              width={244}
              py={8}
              onPress={onQuit}
              textActive={colors.text.onLight}
            ></DefaultButton>
            <DefaultButton
              text={localization.t(LOCALIZATION_KEYS.BTN_RESUME)}
              bg={colors.action.primary}
              bgActive={colors.surface.card}
              color={colors.text.onLight}
              width={244}
              py={8}
              onPress={onClose}
              btnStyle={{ borderColor: "none", borderWidth: 0 }}
              onPressStyle={{ borderColor: colors.surface.input, borderWidth: 1 }}
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
    paddingHorizontal: 33,
    borderRadius: 20,
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 35,
    position: "relative",
    maxWidth: 310,
  },
  close: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: 14,
    zIndex: 1,
  },
  title: {
    fontFamily: "HelveticaNow-Bold",
    fontSize: 24,
    marginBottom: 8,
    color: colors.text.body,
    marginTop: 40,
  },
  text: {
    fontFamily: "HelveticaNow-Medium",
    fontSize: 16,
    marginBottom: 16,
    color: colors.text.body,
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

export default ProgressLostModal;
