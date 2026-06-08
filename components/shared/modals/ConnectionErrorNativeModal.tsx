import { colors, withAlpha } from "@/assets/styles/constants";
import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Modal } from "react-native";

type ConnectionErrorNativeModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

const ConnectionErrorNativeModal: React.FC<ConnectionErrorNativeModalProps> = ({
  isVisible,
  onClose,
}) => {
  return (
    <Modal animationType="fade" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>No Internet Connection</Text>
            <Text style={styles.text}>Please check your network settings and try again.</Text>
          </View>
          <View style={styles.footer}>
            <TouchableOpacity activeOpacity={0.7} style={styles.close} onPress={onClose}>
              <Text style={styles.textBtn}>OK</Text>
            </TouchableOpacity>
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
    backgroundColor: colors.text.inverse,
    borderRadius: 20,
    alignItems: "center",
    position: "relative",
    maxWidth: 350,
    minWidth: 310,
    width: "100%",
    gap: 32,
    overflow: "hidden",
    elevation: 5,
    padding: 24,
  },
  close: {},
  title: {
    fontFamily: "HelveticaNow-Bold",
    fontSize: 24,
    color: colors.text.onLight,
    marginTop: 8,
  },
  textContainer: {
    width: "100%",
    maxWidth: "100%",
    minWidth: "100%",
    gap: 16,
  },
  textBtn: {
    fontFamily: "HelveticaNow-Medium",
    fontSize: 20,
    color: colors.decorative.stickerPurple,
    paddingHorizontal: 8,
  },
  text: {
    fontFamily: "HelveticaNow-Medium",
    fontSize: 20,
    color: withAlpha(colors.surface.overlay, 0.5),
    lineHeight: 28,
  },
  footer: {
    marginTop: 8,
    minWidth: "100%",
    backgroundColor: colors.text.inverse,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});

export default ConnectionErrorNativeModal;
