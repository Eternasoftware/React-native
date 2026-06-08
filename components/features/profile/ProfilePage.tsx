import { colors } from "@/assets/styles/constants";
import { View, StyleSheet } from "react-native";
import ProfileScreen from "@/components/features/profile/screens/ProfileScreen";
import { PROFILE_SCREENS } from "@/utils/constants/home";
import SettingsScreen from "@/components/features/profile/screens/settings/SettingsScreen";
import EditProfileScreen from "@/components/features/profile/screens/settings/EditProfileScreen";
import NotificationsScreen from "@/components/features/profile/screens/settings/NotificationsScreen";
import FAQScreen from "@/components/features/profile/screens/settings/FAQScreen";
import ContactUsScreen from "@/components/features/profile/screens/settings/ContactUsScreen";
import FavoritesScreen from "@/components/features/profile/screens/FavoritesScreen";
import AchievementsScreen from "@/components/features/profile/screens/AchievementsScreen";
import TermsScreen from "@/components/features/profile/screens/settings/Terms";
import AnimatedSlide from "@/components/common/AnimatedSlide";
import { useProfilePage } from "@/components/features/profile/hooks/useProfilePage";

export default function ProfilePage() {
  const {
    user,
    offset,
    levels,
    notificationsObj,
    fillNotificationObj,
    handleNextScreen,
    handleBackScreen,
  } = useProfilePage();

  if (!user) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      {levels[0] === PROFILE_SCREENS.PROFILE && (
        <AnimatedSlide index={0} offset={offset} backShiftDivisor={3}>
          <ProfileScreen
            key={user.id}
            user={user}
            onBack={() => handleBackScreen()}
            onSettings={() => handleNextScreen(PROFILE_SCREENS.SETTINGS)}
            onFavorites={() => handleNextScreen(PROFILE_SCREENS.FAVORITES)}
            onAchievements={() => handleNextScreen(PROFILE_SCREENS.ACHIEVEMENTS)}
          />
        </AnimatedSlide>
      )}
      {levels[1] === PROFILE_SCREENS.FAVORITES && (
        <AnimatedSlide index={1} offset={offset} backShiftDivisor={3}>
          <FavoritesScreen onBack={() => handleBackScreen()} />
        </AnimatedSlide>
      )}
      {(levels[0] === PROFILE_SCREENS.ACHIEVEMENTS ||
        levels[1] === PROFILE_SCREENS.ACHIEVEMENTS) && (
        <AnimatedSlide
          index={levels[1] === PROFILE_SCREENS.ACHIEVEMENTS ? 1 : 0}
          offset={offset}
          backShiftDivisor={3}
        >
          <AchievementsScreen onBack={() => handleBackScreen()} />
        </AnimatedSlide>
      )}
      {levels[1] === PROFILE_SCREENS.SETTINGS && (
        <AnimatedSlide index={1} offset={offset} backShiftDivisor={3}>
          <SettingsScreen
            user={user}
            onBack={() => handleBackScreen()}
            goTo={(screen) => handleNextScreen(screen)}
          />
        </AnimatedSlide>
      )}
      {levels[2] === PROFILE_SCREENS.EDIT_PROFILE && (
        <AnimatedSlide index={2} offset={offset} backShiftDivisor={3}>
          <EditProfileScreen onBack={() => handleBackScreen()} />
        </AnimatedSlide>
      )}
      {levels[2] === PROFILE_SCREENS.NOTIFICATIONS && (
        <AnimatedSlide index={2} offset={offset} backShiftDivisor={3}>
          <NotificationsScreen
            notifications={notificationsObj}
            updateData={fillNotificationObj}
            onBack={() => handleBackScreen()}
          />
        </AnimatedSlide>
      )}
      {levels[2] === PROFILE_SCREENS.FAQ && (
        <AnimatedSlide index={2} offset={offset} backShiftDivisor={3}>
          <FAQScreen onBack={() => handleBackScreen()} />
        </AnimatedSlide>
      )}
      {levels[2] === PROFILE_SCREENS.TERMS && (
        <AnimatedSlide index={2} offset={offset} backShiftDivisor={3}>
          <TermsScreen onBack={() => handleBackScreen()} />
        </AnimatedSlide>
      )}
      {levels[2] === PROFILE_SCREENS.CONTACT_US && (
        <AnimatedSlide index={2} offset={offset} backShiftDivisor={3}>
          <ContactUsScreen user={user} onBack={() => handleBackScreen()} />
        </AnimatedSlide>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    backgroundColor: colors.surface.splash,
  },
});
