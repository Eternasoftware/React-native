import { colors } from "@/assets/styles/constants";
import React, { useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { usePathname, useRouter } from "expo-router";
import HomeIcon from "@icons/navigation-panel/Home.svg";
import ProgramsIcon from "@icons/navigation-panel/Programs.svg";
import HacksIcon from "@icons/navigation-panel/Hacks.svg";
import FitFlowLogo from "@icons/app/fitflow-logo-vertical.svg";
import { LOCALIZATION_KEYS } from "@/utils/constants/localization";
import useSettingsStore from "@/store/settingsStore";
import ProfileIcon from "@/components/features/profile/screens/ProfileIcon";
import { TABS } from "@/utils/constants/common";
import { useShallow } from "zustand/react/shallow";

export default function SideBar() {
  const { activeTab, localization, setActiveTab } = useSettingsStore(
    useShallow((s) => ({
      activeTab: s.activeTab,
      localization: s.localization,
      setActiveTab: s.setActiveTab,
    }))
  );

  const pathname = usePathname();
  const router = useRouter();
  const routes = [
    {
      path: TABS.HOME,
      icon: <HomeIcon style={styles.icon} />,
      name: localization.t(LOCALIZATION_KEYS.BTN_HOME),
    },
    {
      path: TABS.PROGRAMS,
      icon: <ProgramsIcon style={styles.icon} />,
      name: localization.t(LOCALIZATION_KEYS.BTN_PROGRAMS),
    },
    {
      path: TABS.HACKS,
      icon: <HacksIcon style={styles.icon} />,
      name: localization.t(LOCALIZATION_KEYS.BTN_HACKS),
    },
    {
      path: TABS.PROFILE,
      icon: <ProfileIcon containerStyle={{}} iconStyle={styles.iconUser} />,
      name: localization.t(LOCALIZATION_KEYS.BTN_PROFILE),
    },
  ];

  const goTo = (path: any) => {
    setActiveTab(path);
    router.push(path);
  };

  useEffect(() => {
    if (pathname.includes(routes[1].path)) {
      setActiveTab(routes[1].path);
    } else if (pathname.includes(routes[2].path)) {
      setActiveTab(routes[2].path);
    } else if (pathname.includes(routes[3].path)) {
      setActiveTab(routes[3].path);
    } else {
      setActiveTab(routes[0].path);
    }
  }, [pathname]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <FitFlowLogo style={{ width: "100%" }} />
      </View>
      <View style={styles.tabs}>
        {routes.map((route) => (
          <TouchableOpacity
            style={[styles.tab, route.path === activeTab && styles.activeTab]}
            key={route.path}
            onPress={() => goTo(route.path)}
            activeOpacity={0.7}
          >
            <View style={[styles.tabIcon]}>{route.icon}</View>
            <Text style={[styles.tabName]}>{route.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 280,
    maxWidth: 280,
    flex: 1,
    backgroundColor: colors.surface.card,
    justifyContent: "center",
    paddingBottom: 53,
    paddingTop: 40,
    zIndex: 1,
  },
  logoContainer: {
    position: "absolute",
    left: 0,
    top: 40,
  },
  tabs: {
    gap: 30,
    paddingHorizontal: 24,
  },
  tab: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    paddingLeft: 26,
    height: 40,
    cursor: "pointer",
  },
  tabIcon: {},
  icon: {
    height: 24,
  },
  activeTab: {
    borderRadius: 10,
    backgroundColor: colors.surface.sidebar,
  },
  tabName: {
    fontFamily: "HelveticaNow-Medium",
    color: colors.text.body,
    fontSize: 16,
  },
  profile: {
    alignItems: "center",
  },
  iconUser: {
    width: 24,
    height: 24,
    borderColor: colors.border.onCard,
    borderRadius: 100,
  },
});
