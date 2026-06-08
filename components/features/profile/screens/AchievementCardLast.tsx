import { colors } from "@/assets/styles/constants";
import { Text, View, StyleSheet, Image, Pressable } from "react-native";
import useSettingsStore from "@/store/settingsStore";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import { Achievement } from "@/types/users.type";
import { formatDateWithDivider } from "@/utils/functions";
import { useShallow } from "zustand/react/shallow";

type AchievementCardLastProps = {
  achievement: Achievement;
  containerStyle?: object;
  onPress: () => void;
};

const AchievementCardLast: React.FC<AchievementCardLastProps> = ({
  achievement,
  onPress,
  containerStyle,
}) => {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

  return (
    <Pressable style={[styles.container, containerStyle]} onPress={onPress}>
      <View>
        <Image resizeMode="contain" source={{ uri: achievement.image }} style={styles.img} />
      </View>
      <View style={styles.footer}>
        <Text numberOfLines={2} style={styles.title}>
          {localization.t(achievement.title)}
        </Text>
        <Text style={styles.text}>
          {localization.t(LOCALIZATION_KEYS.BTN_LAST_ACHIEVEMENT)}{" "}
          {formatDateWithDivider(achievement.dateEarnedAt)}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface.box,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 6,
    maxHeight: 283,
    minHeight: 283,
  },
  title: {
    color: colors.text.accent,
    fontFamily: "HelveticaNow-ExtraBold",
    fontSize: 20,
    textAlign: "center",
    textTransform: "uppercase",
  },
  img: {
    minWidth: 180,
    minHeight: 180,
    maxWidth: 180,
    maxHeight: 180,
    marginHorizontal: "auto",
  },
  footer: {
    justifyContent: "space-between",
    flex: 1,
  },
  text: {
    fontFamily: "HelveticaNow-Regular",
    color: colors.text.body,
    fontSize: 14,
    textAlign: "center",
  },
});

export default AchievementCardLast;
