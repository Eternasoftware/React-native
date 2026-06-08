import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { View, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from "react-native-reanimated";
import HomeIcon from "@icons/navigation-panel/Home.svg";
import ProgramsIcon from "@icons/navigation-panel/Programs.svg";
import HacksIcon from "@icons/navigation-panel/Hacks.svg";
import HomeIconBlack from "@icons/navigation-panel/Home-black.svg";
import ProgramsIconBlack from "@icons/navigation-panel/Programs-black.svg";
import HacksIconBlack from "@icons/navigation-panel/Hacks-black.svg";
import useUsersStore from "@/store/usersStore";
import { useEffect, useState } from "react";
import { tabLabels } from "@/utils/constants/tabs";
import { BlurView } from "expo-blur";
import TabBarItem from "./TabBarItem";
import useSettingsStore from "@/store/settingsStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useShallow } from "zustand/react/shallow";
import { colors, withAlpha } from "@/assets/styles/constants";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const AVATAR_SIZE = 60;
const PANELS_GAP = 10;
const PADDING_HORIZONTAL = 16;
const TABS_COUNT = 3;
const PILL_PADDING = 4;
const PILL_HEIGHT = 60;

const PILL_WIDTH =
  SCREEN_WIDTH - AVATAR_SIZE - PILL_PADDING * 2 - 2 * PADDING_HORIZONTAL - PANELS_GAP;

const TAB_WIDTH = PILL_WIDTH / TABS_COUNT;

const icons = [
  { white: HomeIcon, black: HomeIconBlack },
  { white: ProgramsIcon, black: ProgramsIconBlack },
  { white: HacksIcon, black: HacksIconBlack },
];

export type Route = {
  name: string;
  key: string;
  label: string;
  initIndex: number;
};

type CustomTabBarProps = BottomTabBarProps & {
  showNavigation: boolean;
};

export default function CustomTabBar({ state, navigation, showNavigation }: CustomTabBarProps) {
  const { toggleShowNavigation } = useSettingsStore(
    useShallow((s) => ({
      toggleShowNavigation: s.toggleShowNavigation,
    }))
  );

  const user = useUsersStore((store) => store.user);
  const [tabs, setTabs] = useState<Route[]>([]);
  const [activeLeftTab, setActiveLeftTab] = useState<number | null>(null);
  const insets = useSafeAreaInsets();

  const x = useSharedValue(0);
  const opacity = useSharedValue(0);

  const yTabPosition = useSharedValue(
    showNavigation ? Math.max(30, insets.bottom) : -150 - insets.bottom
  );

  useEffect(() => {
    const routes = defineTabs();
    setTabs(routes);
    getIndex(state.index);
  }, []);

  useEffect(() => {
    getIndex(state.index);
    if (state.index === 0) {
      toggleShowNavigation(true);
    }
  }, [state.index]);

  useEffect(() => {
    getIndex(state.index);
  }, [tabs]);

  useEffect(() => {
    yTabPosition.value = withTiming(
      showNavigation ? Math.max(30, insets.bottom) : -150 - insets.bottom,
      {
        duration: 180,
      }
    );
  }, [showNavigation]);

  useEffect(() => {
    if (activeLeftTab != null) {
      x.value = withTiming((activeLeftTab * PILL_WIDTH) / 3, { duration: 150 });
      opacity.value = withTiming(1, { duration: 150 });
    } else {
      opacity.value = withTiming(0, { duration: 150 });
    }
  }, [activeLeftTab]);

  const defineTabs = () => {
    const routes: Route[] = [];
    for (let key in tabLabels) {
      let route = null as any;
      let initIndex = 0;
      for (let i = 0; i < state.routes.length; i++) {
        if (state.routes[i].name === key) {
          route = state.routes[i];
          initIndex = i;
        }
      }
      if (route) {
        routes.push({
          ...route,
          label: tabLabels[key as keyof typeof tabLabels],
          initIndex,
        });
      }
    }
    return routes;
  };

  const getIndex = (index: number) => {
    const tabIndex = tabs.findIndex((route) => route.initIndex === index);
    if (activeLeftTab == null && tabIndex !== -1) {
      x.value = (tabIndex * PILL_WIDTH) / 3;
    }
    setActiveLeftTab(tabIndex !== -1 ? tabIndex : null);
  };

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
    opacity: opacity.value,
  }));

  const animatedStylesY = useAnimatedStyle(() => ({
    bottom: yTabPosition.value,
  }));

  const handleTabPress = (route: Route, isFocused: boolean) => {
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });
    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  return (
    <Animated.View style={[styles.wrapper, animatedStylesY]}>
      <View style={styles.pill}>
        <View style={[styles.pillBg]}></View>
        <BlurView
          intensity={20}
          tint="dark"
          style={styles.blur}
          experimentalBlurMethod={"dimezisBlurView"}
          blurReductionFactor={5}
        />
        <Animated.View style={[animatedStyles, styles.highlight]} />

        {tabs.map((route, i) => {
          const isFocused = state.index === route.initIndex;
          const Icon = icons[i];
          return (
            <TabBarItem
              key={route.key}
              route={route}
              isFocused={isFocused}
              onPress={() => handleTabPress(route, isFocused)}
              tabWidth={TAB_WIDTH}
              InactiveIcon={Icon.white}
              ActiveIcon={Icon.black}
            />
          );
        })}
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate("profile")}
        activeOpacity={0.8}
        style={styles.avatarWrap}
      >
        <BlurView
          intensity={20}
          tint="dark"
          style={styles.blur}
          experimentalBlurMethod={"dimezisBlurView"}
          blurReductionFactor={5}
        />
        <Image source={{ uri: user?.image }} style={styles.avatar} resizeMode="cover" />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    height: 60,
    width: "100%",
    flexDirection: "row",
    zIndex: 10,
    gap: PANELS_GAP,
    paddingHorizontal: PADDING_HORIZONTAL,
  },
  pill: {
    position: "relative",
    height: PILL_HEIGHT,
    flexDirection: "row",
    flexGrow: 1,
    padding: PILL_PADDING,
    minWidth: PILL_WIDTH,
    overflow: "hidden",
    borderRadius: 50,
  },
  pillBg: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 50,
    height: PILL_HEIGHT,
    borderWidth: 1,
    borderColor: withAlpha(colors.text.inverse, 0.2),
    minWidth: PILL_WIDTH,
    flexGrow: 1,
    zIndex: -1,
  },
  highlight: {
    position: "absolute",
    width: TAB_WIDTH,
    height: PILL_HEIGHT - PILL_PADDING * 2,
    top: PILL_PADDING,
    left: PILL_PADDING,
    borderRadius: 46,
    backgroundColor: withAlpha(colors.text.inverse, 0.5),
  },
  tab: {
    width: TAB_WIDTH,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  label: {
    fontSize: 12,
    marginTop: 2,
    color: colors.text.inverse,
  },
  labelFocused: {
    color: colors.surface.overlay,
    fontWeight: "600",
  },
  avatarWrap: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderWidth: 1,
    borderColor: withAlpha(colors.text.inverse, 0.2),
    borderRadius: 100,
    overflow: "hidden",
  },
  highlightProfile: {
    position: "absolute",
    width: AVATAR_SIZE - 4,
    height: AVATAR_SIZE - 4,
    top: 1,
    left: 1,
    borderRadius: 100,
    backgroundColor: withAlpha(colors.text.inverse, 0.5),
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 45 / 2,
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 50,
    overflow: "hidden",
    zIndex: -2,
  },
});
