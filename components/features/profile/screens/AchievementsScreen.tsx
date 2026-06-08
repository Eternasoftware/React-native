import { colors } from "@/assets/styles/constants";
import { useIsCompactLayout } from "@/hooks/useIsCompactLayout";
import { useState } from "react";
import { View, StyleSheet, ScrollView, LayoutChangeEvent } from "react-native";
import NavHeader from "@/components/shared/NavHeader";
import useSettingsStore from "@/store/settingsStore";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import useUsersStore from "@/store/usersStore";
import { Achievement } from "@/types/users.type";
import AchievementCard from "./AchievementCard";
import AchievementCardLast from "./AchievementCardLast";
import AchievementModal from "@/components/shared/modals/AchievementModal";
import { TAB_BAR_OFFSET } from "@/utils/constants/tabs";
import { useShallow } from "zustand/react/shallow";

type AchievementsProps = {
  onBack: () => void;
};

const CARD_GAP = 15;
const NUM_COLUMNS = 2;
const PADDING_SIDE = 24;

const AchievementsScreen: React.FC<AchievementsProps> = ({ onBack }) => {
  const { localization, screenWidth } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
      screenWidth: s.screenWidth,
    }))
  );

  const { user } = useUsersStore(
    useShallow((s) => ({
      user: s.user,
    }))
  );

  const [showModal, setShowModal] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const isCompact = useIsCompactLayout();

  const cardWidth = (screenWidth - PADDING_SIDE * 2 - CARD_GAP) / NUM_COLUMNS;

  const handlePress = (val: Achievement) => {
    setCurrentAchievement(val);
    setShowModal(true);
  };

  const handleContentSizeChange = (contentWidth: number, contentHeight: number) => {
    setIsScrollable(contentHeight > scrollViewHeight);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setScrollViewHeight(height);
  };

  return (
    <View style={[styles.container, !isCompact && { paddingHorizontal: 32, paddingTop: 32 }]}>
      {currentAchievement && (
        <AchievementModal
          isVisible={showModal}
          achievement={currentAchievement}
          onClose={() => setShowModal(false)}
        />
      )}

      <NavHeader
        onBack={onBack}
        text={localization.t(LOCALIZATION_KEYS.TITLE_ACHIEVEMENTS)}
      ></NavHeader>
      <View
        style={{
          maxWidth: 594,
          flex: 1,
          marginHorizontal: "auto",
          width: "100%",
        }}
      >
        <ScrollView
          scrollEnabled={isScrollable}
          onContentSizeChange={handleContentSizeChange}
          onLayout={handleLayout}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.list}>
              {user &&
                user.achievements.length > 0 &&
                user.achievements.map((achievement, index) => {
                  if (index === 0) {
                    return (
                      <AchievementCardLast
                        achievement={achievement}
                        key={achievement.guid}
                        containerStyle={{
                          maxWidth: screenWidth - PADDING_SIDE * 2,
                          width: "100%",
                        }}
                        onPress={() => {
                          handlePress(achievement);
                        }}
                      />
                    );
                  } else {
                    return (
                      <AchievementCard
                        achievement={achievement}
                        key={achievement.guid}
                        containerStyle={{
                          maxWidth: 546 / 2 - 8,
                          width: cardWidth,
                        }}
                        onPress={() => {
                          handlePress(achievement);
                        }}
                      />
                    );
                  }
                })}
            </View>

            <View style={{ width: "100%", height: 24 }}></View>
          </View>
          <View style={{ height: TAB_BAR_OFFSET }}></View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.splash,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    maxWidth: 594,
    width: "100%",
    marginHorizontal: "auto",
    minHeight: "100%",
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 24,
  },
  button: {
    height: 32,
    borderRadius: 8,
    flex: 1,
    justifyContent: "center",
  },
  buttonText: {
    textAlign: "center",
    color: colors.text.onLight,
    fontFamily: "HelveticaNow-Bold",
    fontSize: 14,
    paddingHorizontal: 8,
  },
  mainButton: {
    backgroundColor: colors.surface.input,
  },
  regularButton: {
    backgroundColor: colors.border.onCard,
  },
  list: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  hr: {
    borderColor: colors.border.default,
    borderWidth: 1,
    height: 2,
  },
});

export default AchievementsScreen;
