import { colors } from "@/assets/styles/constants";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import SettingsIcon from "@icons/common/settings.svg";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import useSettingsStore from "@/store/settingsStore";
import { useShallow } from "zustand/react/shallow";

type UserSettingsProps = {
  onPress: () => void;
};

const UserSettings: React.FC<UserSettingsProps> = ({ onPress }) => {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

  return (
    <TouchableOpacity activeOpacity={0.7} style={styles.container} onPress={onPress}>
      <SettingsIcon style={{ minHeight: 24 }} />
      <Text style={styles.title} allowFontScaling={false}>
        {localization.t(LOCALIZATION_KEYS.TITLE_SETTINGS)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.surface.box,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    gap: 10,
    minHeight: 62,
    flex: 1,
  },
  title: {
    color: colors.text.accent,
    fontFamily: "HelveticaNow-ExtraBold",
    fontSize: 14,
    textTransform: "uppercase",
  },
});

export default UserSettings;
