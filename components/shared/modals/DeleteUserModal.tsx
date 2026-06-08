import { colors, withAlpha } from "@/assets/styles/constants";
import DefaultButton from "@/components/common/DefaultButton";
import React from "react";
import { View, StyleSheet, Text, Modal } from "react-native";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import useSettingsStore from "@/store/settingsStore";
import { useShallow } from "zustand/react/shallow";

type DeleteUserModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({ isVisible, onClose, onConfirm }) => {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>
            {localization.t(LOCALIZATION_KEYS.TITLE_MODAL_DELETE_USER)}
          </Text>

          <View style={styles.buttons}>
            <DefaultButton
              text={localization.t(LOCALIZATION_KEYS.BNT_DELETE)}
              bg={colors.state.destructive}
              bgActive={colors.action.primary}
              width={244}
              py={8}
              onPress={onConfirm}
              btnStyle={{ borderWidth: 0 }}
              textActive={colors.text.onLight}
            ></DefaultButton>
            <DefaultButton
              text={localization.t(LOCALIZATION_KEYS.BNT_CANCEL)}
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
    paddingHorizontal: 10,
    paddingVertical: 32,
    borderRadius: 20,
    alignItems: "center",
    position: "relative",
    maxWidth: 310,
    gap: 40,
  },
  title: {
    fontFamily: "HelveticaNow-Bold",
    fontSize: 20,
    color: colors.text.body,
    paddingHorizontal: 36,
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

export default DeleteUserModal;
