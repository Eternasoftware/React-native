import { colors, withAlpha } from "@/assets/styles/constants";
import DefaultButton from "@/components/common/DefaultButton";
import React from "react";
import { View, StyleSheet, Text, Modal } from "react-native";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import useSettingsStore from "@/store/settingsStore";
import * as StoreReview from "expo-store-review";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useShallow } from "zustand/react/shallow";

type RateUsModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

const RateUsModal: React.FC<RateUsModalProps> = ({ isVisible, onClose }) => {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

  const onPressRate = async () => {
    try {
      const isAvailable = await StoreReview.isAvailableAsync();
      await AsyncStorage.setItem("askedForReviewCount", "2");
      if (isAvailable) {
        await StoreReview.requestReview();
      }
      onClose();
    } catch (error) {
      console.log("Error requesting review:", error);
      onClose();
    }
  };

  const onLater = async () => {
    const askedForReviewCount = (await AsyncStorage.getItem("askedForReviewCount")) || 0;
    await AsyncStorage.setItem(
      "askedForReviewCount",
      !askedForReviewCount ? "1" : (+askedForReviewCount + 1).toString()
    );
    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.textContent}>
            <Text style={styles.title}>{localization.t(LOCALIZATION_KEYS.TITLE_RATE_MODAL)}</Text>
            <Text style={styles.text}>{localization.t(LOCALIZATION_KEYS.TXT_RATE_MODAL)}</Text>
          </View>

          <View style={styles.buttons}>
            <DefaultButton
              text={localization.t(LOCALIZATION_KEYS.BTN_RATE_NOW)}
              bg={colors.action.primary}
              bgActive={colors.surface.card}
              color={colors.text.onLight}
              width={244}
              py={8}
              onPress={onPressRate}
              btnStyle={{ borderColor: "none", borderWidth: 0 }}
              onPressStyle={{ borderColor: colors.surface.input, borderWidth: 1 }}
            ></DefaultButton>
            <DefaultButton
              text={localization.t(LOCALIZATION_KEYS.BTN_RATE_LATER)}
              bg={colors.surface.card}
              bgActive={colors.action.primary}
              width={244}
              py={8}
              onPress={onLater}
              btnStyle={{}}
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
    paddingHorizontal: 16,
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

export default RateUsModal;
