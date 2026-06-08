import { colors } from "@/assets/styles/constants";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import ArrowForwardIcon from "@icons/common/arrow-forward.svg";
import useSettingsStore from "@/store/settingsStore";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import { Achievement } from "@/types/users.type";
import DefaultAchievement from "@icons/common/default-achievement.svg";
import { useShallow } from "zustand/react/shallow";

type BadgesProps = {
  achievements: Achievement[];
  onPress: () => void;
};

const Badges: React.FC<BadgesProps> = ({ achievements, onPress }) => {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

  const firstAchievement = achievements?.[0];
  const restAchievements = achievements?.slice(1, 15);

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7} onPress={onPress}>
      <View>
        <Text style={styles.title} allowFontScaling={false}>
          {localization.t(LOCALIZATION_KEYS.TXT_BADGE)}
        </Text>
      </View>
      <View>
        {firstAchievement ? (
          <Image resizeMode="contain" source={{ uri: firstAchievement.image }} style={styles.img} />
        ) : (
          <DefaultAchievement style={styles.img} />
        )}
      </View>
      <View style={styles.footer}>
        <View style={styles.badgeList}>
          {restAchievements &&
            restAchievements.map((item, index) => (
              <Image
                resizeMode="contain"
                source={{ uri: item.image }}
                style={[styles.badgeItem, { left: index * 10 }]}
                key={index}
              />
            ))}
        </View>
        <View style={styles.rightBlock}>
          {achievements && achievements.length > 1 && (
            <Text style={styles.text} allowFontScaling={false}>
              {localization.t(LOCALIZATION_KEYS.TXT_MORE).replace("{0}", achievements.length - 1)}
            </Text>
          )}
          <View style={styles.button}>
            <Text style={styles.viewAll} allowFontScaling={false}>
              {localization.t(LOCALIZATION_KEYS.BTN_VIEW_ALL)}
            </Text>
            <ArrowForwardIcon style={styles.arrow} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface.box,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    justifyContent: "space-between",
    gap: 10,
  },
  title: {
    color: colors.text.accent,
    fontFamily: "HelveticaNow-ExtraBold",
    fontSize: 14,
  },
  img: {
    width: 131,
    height: 131,
    marginHorizontal: "auto",
  },
  footer: {
    minHeight: 47,
    flexDirection: "row",
  },
  badgeList: {
    position: "relative",
    flex: 1,
  },
  badgeItem: {
    position: "absolute",
    top: 0,
    bottom: 0,
    marginVertical: "auto",
    width: 37,
    height: 37,
  },
  rightBlock: {
    gap: 4,
    justifyContent: "flex-end",
  },
  button: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    minHeight: 28,
  },
  viewAll: {
    fontFamily: "HelveticaNow-LightIta",
    color: colors.text.accent,
    fontSize: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: "HelveticaNow-Medium",
    color: colors.text.accent,
    fontSize: 10,
    textAlign: "right",
    paddingTop: 4,
  },
  arrow: {
    width: 10,
    height: 10,
  },
});

export default Badges;
