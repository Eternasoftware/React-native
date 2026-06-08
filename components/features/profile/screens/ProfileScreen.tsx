import { colors } from "@/assets/styles/constants";
import { useIsCompactLayout } from "@/hooks/useIsCompactLayout";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, LayoutChangeEvent } from "react-native";
import NavHeader from "@/components/shared/NavHeader";
import UserCard from "./UserCard";
import { UserData } from "@/types/users.type";
import UserStats from "./UserStats";
import UserFavorites from "./UserFavorites";
import Badges from "./Badges";
import { calculateAge } from "@/utils/functions";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import useSettingsStore from "@/store/settingsStore";
import { USER_TYPE } from "@/utils/constants/user";
import UserSettings from "./UserSettings";
import { TAB_BAR_OFFSET } from "@/utils/constants/tabs";
import { useShallow } from "zustand/react/shallow";

type ProfileProps = {
  user: UserData;
  onBack: () => void;
  onSettings: () => void;
  onFavorites: () => void;
  onAchievements: () => void;
};

const ProfileScreen: React.FC<ProfileProps> = ({
  user,
  onBack,
  onSettings,
  onFavorites,
  onAchievements,
}) => {
  const { localization } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
    }))
  );

  const age = user.birthDayAt ? calculateAge(user.birthDayAt) : "- -";
  const isCompact = useIsCompactLayout();
  const [isScrollable, setIsScrollable] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);

  const handleContentSizeChange = (contentWidth: number, contentHeight: number) => {
    setIsScrollable(contentHeight > scrollViewHeight);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setScrollViewHeight(height);
  };

  return (
    <View style={[styles.container, !isCompact && { paddingHorizontal: 32, paddingTop: 32 }]}>
      <NavHeader
        onBack={onBack}
        text={localization.t(LOCALIZATION_KEYS.TITLE_PROFILE).toUpperCase()}
        showBack={false}
      ></NavHeader>
      <ScrollView
        scrollEnabled={isScrollable}
        onContentSizeChange={handleContentSizeChange}
        onLayout={handleLayout}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.scrollContent}>
          <View style={{ gap: 10 }}>
            <UserCard imageUrl={user.image} name={user.name} email={user.email} />
            <UserStats points={user.points} age={age} />
            <View style={styles.doubleMenuItems}>
              <UserFavorites onPress={onFavorites} />
              {user.type !== USER_TYPE.GUEST && <UserSettings onPress={onSettings} />}
            </View>
          </View>

          <Badges achievements={user.achievements} onPress={onAchievements} />
        </View>
        <View style={{ height: TAB_BAR_OFFSET }}></View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.splash,
    paddingHorizontal: 24,
  },
  scrollContent: {
    flex: 1,
    paddingVertical: 10,
    gap: 16,
    maxWidth: 594,
    width: "100%",
    marginHorizontal: "auto",
  },
  doubleCards: {
    flexDirection: "row",
    gap: 16,
    paddingBottom: 10,
  },
  doubleMenuItems: {
    flexDirection: "row",
    width: "100%",
    gap: 10,
  },
});

export default React.memo(ProfileScreen);
