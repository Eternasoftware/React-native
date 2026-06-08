import { colors, withAlpha } from "@/assets/styles/constants";
import * as React from "react";
import { View, StyleSheet, Modal, Pressable, TouchableOpacity, Text } from "react-native";
import { Provider as PaperProvider, MD3DarkTheme } from "react-native-paper";
import { Calendar } from "react-native-paper-dates";
import { registerTranslation, enGB } from "react-native-paper-dates";
import CloseIcon from "@icons/common/close-white.svg";
import { useState } from "react";

registerTranslation("en", enGB);

type CalendarModal = {
  isVisible: boolean;
  onChange: (date: Date) => void;
  onClose: () => void;
};

const CalendarWeb: React.FC<CalendarModal> = ({ isVisible, onChange, onClose }) => {
  const [selectedDate, setSelectedDate] = useState<Date>();

  const customTheme = {
    ...MD3DarkTheme,
    dark: false,
    colors: {
      ...MD3DarkTheme.colors,
      surface: colors.surface.card,
    },
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <Pressable style={styles.modalContainer} onPress={() => {}}>
        <View style={styles.modalContent}>
          <PaperProvider theme={customTheme}>
            <View style={styles.header}>
              <TouchableOpacity activeOpacity={0.7} style={styles.close} onPress={onClose}>
                <CloseIcon />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.save, { opacity: !selectedDate ? 0.5 : 1 }]}
                disabled={!selectedDate}
                onPress={() => onChange(selectedDate!)}
              >
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.container}>
              <Calendar
                date={selectedDate}
                onChange={({ date }) => setSelectedDate(date)}
                locale={"en"}
                mode="single"
              />
            </View>
          </PaperProvider>
        </View>
      </Pressable>
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
    maxWidth: 360,
    maxHeight: 520,
    backgroundColor: colors.surface.card,
    zIndex: 2,
    borderRadius: 20,
    flex: 1,
    minWidth: 360,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    paddingHorizontal: 19,
    paddingTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 2,
  },
  close: {
    width: 40,
    padding: 5,
  },
  save: {
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  saveText: {
    color: colors.text.body,
    fontFamily: "HelveticaNow-Regular",
    fontSize: 16,
  },
});

export default CalendarWeb;
