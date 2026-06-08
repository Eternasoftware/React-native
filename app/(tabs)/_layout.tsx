import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import { colors } from "@/assets/styles/constants";

import useSettingsStore from "@/store/settingsStore";
import TabBar from "@/components/features/tab-bar/TabBar";
import { useShallow } from "zustand/react/shallow";

export default function TabLayout() {
  const { showNavigation } = useSettingsStore(
    useShallow((s) => ({
      showNavigation: s.showNavigation,
    }))
  );

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: [showNavigation ? styles.tabBar : styles.tabBarNone],
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
      tabBar={(props) => {
        return <TabBar {...props} showNavigation={showNavigation} />;
      }}
    ></Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface.card,
    borderTopWidth: 0,
    flexDirection: "column",
  },
  tabBarNone: {
    display: "none",
  },
});
