import React, { useEffect, useState } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import useSettingsStore from "@/store/settingsStore";
import StartScreen from "./StartScreen";
import AgeScreen from "./AgeScreen";
import GoalScreen from "./GoalScreen";
import DeviceScreen from "./DeviceScreen";
import FillProfileScreen from "./FillProfileScreen";
import { router } from "expo-router";
import { useSharedValue } from "react-native-reanimated";
import useUsersStore from "@/store/usersStore";
import { Goal, SurveyData } from "@/types/users.type";
import { colors } from "@/assets/styles/constants";
import { enableLocalNotifications } from "@/utils/notifications/scheduler";
import AnimatedSlide from "@/components/common/AnimatedSlide";
import { useShallow } from "zustand/react/shallow";

const SurveyScreen: React.FC = () => {
  const { localization, toggleShowNavigation } = useSettingsStore(
    useShallow((s) => ({
      localization: s.localization,
      toggleShowNavigation: s.toggleShowNavigation,
    }))
  );

  const { fetchUser, sendSurvey, user } = useUsersStore(
    useShallow((s) => ({
      fetchUser: s.fetchUser,
      sendSurvey: s.sendSurvey,
      user: s.user,
    }))
  );

  const [survey, setSurvey] = useState<SurveyData>({
    age: 28,
    goal: [],
    devices: [],
  });
  const enableDefaultNotifications = async () => {
    if (user) await enableLocalNotifications(user.id, localization);
    await fetchUser();
  };

  useEffect(() => {
    toggleShowNavigation(false);
    enableDefaultNotifications();
  }, []);

  const offset = useSharedValue(0);

  const handleNextScreen = () => {
    if (offset.value < 4) {
      offset.value += 1;
    }
  };

  const handleBackScreen = () => {
    Keyboard.dismiss();
    if (offset.value > 0) {
      offset.value -= 1;
    }
  };

  return (
    <View style={[styles.container]}>
      <AnimatedSlide index={0} offset={offset}>
        <StartScreen onNext={() => handleNextScreen()} />
      </AnimatedSlide>
      <AnimatedSlide index={1} offset={offset}>
        <AgeScreen
          onBack={() => handleBackScreen()}
          onNext={(age: number) => {
            setSurvey({ ...survey, age });
            handleNextScreen();
          }}
        />
      </AnimatedSlide>
      <AnimatedSlide index={2} offset={offset}>
        <GoalScreen
          onBack={() => handleBackScreen()}
          onNext={(goal: Goal[]) => {
            setSurvey({ ...survey, goal });
            handleNextScreen();
          }}
        />
      </AnimatedSlide>
      <AnimatedSlide index={3} offset={offset}>
        <DeviceScreen
          onBack={() => handleBackScreen()}
          onNext={async (devices: string[]) => {
            setSurvey({ ...survey, devices });
            await sendSurvey({ ...survey, devices });
            handleNextScreen();
          }}
        />
      </AnimatedSlide>
      <AnimatedSlide index={4} offset={offset}>
        <FillProfileScreen
          onBack={() => handleBackScreen()}
          onNext={() => {
            Keyboard.dismiss();
            router.replace("/?isSignup=true");
          }}
        />
      </AnimatedSlide>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.splash,
    overflow: "hidden",
  },
});

export default SurveyScreen;
