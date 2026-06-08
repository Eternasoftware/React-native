import { View, StyleSheet } from "react-native";
import { colors } from "@/assets/styles/constants";
import HomeScreen from "@/components/features/home/shared/HomeScreen";
import WelcomeModal from "@/components/shared/modals/WelcomeModal";
import Animated from "react-native-reanimated";
import { useHomePage } from "@/components/features/home/hooks/useHomePage";

export default function HomePage() {
  const { user, isReady, showWelcomeModal, isLogin, closeWelcomeModal } = useHomePage();

  if (!isReady || !user) {
    return <View style={[styles.container, styles.placeholder]} />;
  }

  return (
    <View style={styles.container}>
      <WelcomeModal
        name={user.name}
        isVisible={showWelcomeModal}
        isLogin={isLogin}
        onClose={closeWelcomeModal}
      />
      <Animated.View style={styles.container}>
        <HomeScreen user={user} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    backgroundColor: colors.surface.splash,
  },
  placeholder: {
    backgroundColor: colors.surface.splash,
  },
});
