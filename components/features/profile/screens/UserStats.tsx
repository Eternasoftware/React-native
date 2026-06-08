import { colors } from "@/assets/styles/constants";
import useSettingsStore from "@/store/settingsStore";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import { Text, View, StyleSheet } from "react-native";
import { useShallow } from "zustand/react/shallow";

type UserStatsProps = {
  points: number;
  age: number | string;
};

const UserStats: React.FC<UserStatsProps> = ({ points, age }) => {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>{localization.t(LOCALIZATION_KEYS.TITLE_POINTS)}</Text>
        <Text style={styles.text}>{points || 0}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.surface.box,
    borderRadius: 10,
    paddingTop: 16,
    paddingBottom: 11,
    paddingHorizontal: 8,
    justifyContent: "space-between",
    alignItems: "center",
    gap: 4,
  },
  hr: {
    borderLeftWidth: 1,
    borderColor: colors.border.subtle,
    width: 1,
    height: "100%",
  },
  section: {
    gap: 4,
    flex: 1,
  },
  title: {
    color: colors.text.body,
    fontFamily: "HelveticaNow-Bold",
    fontSize: 14,
    textAlign: "center",
  },
  text: {
    color: colors.text.accent,
    fontFamily: "HelveticaNow-Bold",
    fontSize: 24,
    textAlign: "center",
  },
});

export default UserStats;
