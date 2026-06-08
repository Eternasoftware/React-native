import { colors, withAlpha } from "@/assets/styles/constants";
import DefaultButton from "@/components/common/DefaultButton";
import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Modal } from "react-native";
import CloseIcon from "@icons/common/close-white.svg";

type InfoModalProps = {
  title: string;
  text: string;
  buttonText: string;
  isVisible: boolean;
  onClose: () => void;
};

const InfoModal: React.FC<InfoModalProps> = ({
  title = "",
  text = "",
  buttonText = "",
  isVisible,
  onClose,
}) => {
  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity activeOpacity={0.7} style={styles.close} onPress={onClose}>
            <CloseIcon />
          </TouchableOpacity>
          <View style={styles.textContent}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.text}>{text}</Text>
          </View>

          <View style={styles.buttons}>
            <DefaultButton
              text={buttonText}
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
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: "center",
    paddingVertical: 25,
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
  textContent: {
    paddingTop: 4,
    paddingBottom: 8,
    paddingHorizontal: 8,
    gap: 24,
  },
  title: {
    fontFamily: "HelveticaNow-Bold",
    fontSize: 20,
    color: colors.text.body,
    textAlign: "center",
  },
  text: {
    fontFamily: "HelveticaNow-Regular",
    fontSize: 14,
    color: colors.text.body,
    textAlign: "center",
  },
  buttons: {
    gap: 10,
    paddingTop: 10,
    paddingHorizontal: 23,
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

export default InfoModal;
