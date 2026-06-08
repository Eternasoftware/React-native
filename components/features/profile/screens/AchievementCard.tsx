import { colors } from "@/assets/styles/constants";
import { Text, View, StyleSheet, Image, Pressable } from "react-native";
import useSettingsStore from "@/store/settingsStore";
import { Achievement } from "@/types/users.type";
import { formatDateWithDivider } from "@/utils/functions";
import { useShallow } from "zustand/react/shallow";

type AchievementCardProps = {
  achievement: Achievement;
  containerStyle?: object;
  onPress: () => void;
};

const AchievementCard: React.FC<AchievementCardProps> = ({
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
        <Text style={styles.text}>{formatDateWithDivider(achievement.dateEarnedAt)}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface.box,
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 6,
    maxHeight: 165,
    minHeight: 165,
  },
  title: {
    color: colors.text.accent,
    fontFamily: "HelveticaNow-ExtraBold",
    fontSize: 10,
    textAlign: "center",
    textTransform: "uppercase",
  },
  img: {
    minWidth: 90,
    minHeight: 90,
    maxWidth: 90,
    maxHeight: 90,
    marginHorizontal: "auto",
  },
  footer: {
    justifyContent: "space-between",
    flex: 1,
  },
  text: {
    fontFamily: "HelveticaNow-Regular",
    color: colors.text.body,
    fontSize: 10,
    textAlign: "center",
  },
});

export default AchievementCard;
