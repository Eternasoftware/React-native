import { create } from "zustand";
import { Dimensions } from "react-native";
import { Localization } from "@/types/localization.type";
import initLocalization from "@/utils/loaders/i18n";
import { BannerData } from "@/types/banners.type";
import BannersAPI from "@utils/api/banners";
import * as ScreenOrientation from "expo-screen-orientation";
import { env } from "@/utils/config/env";

type SettingsState = {
  doHost: string;
  orientation: ScreenOrientation.OrientationLock;
  isFullScreen: boolean;
  isOnline: boolean | null;
  isNeedToLogin: boolean;
  screenWidth: number;
  localization: Localization | any;
  showNavigation: boolean;
  showNavBar: boolean;
  showLoginModal: boolean;
  showRateUsModal: boolean;
  banners: BannerData[];
  activeTab: string | null;
  showConnectionError: boolean;
  setOrientation: (val: ScreenOrientation.OrientationLock) => void;
  setIsFullScreen: (val: boolean) => void;
  setActiveTab: (val: string | null) => void;
  setIsOnline: (val: boolean | null) => void;
  setIsNeedToLogin: (val: boolean) => void;
  initScreenWidthListener: () => void;
  toggleShowNavigation: (val: boolean) => void;
  toggleShowNavBar: (val: boolean) => void;
  toggleShowLoginModal: (val: boolean) => void;
  toggleShowRateUsModal: (val: boolean) => void;
  fetchLocalization: () => Promise<boolean>;
  fetchBanners: () => Promise<boolean>;
  setShowConnectionError: (val: boolean) => void;
};

const useSettingsStore = create<SettingsState>((set, get) => ({
  doHost: env.doHost,
  orientation: ScreenOrientation.OrientationLock.PORTRAIT_UP,
  isFullScreen: false,
  isOnline: null,
  isNeedToLogin: false,
  screenWidth: Dimensions.get("window").width,
  localization: {},
  banners: [],
  showNavigation: Dimensions.get("window").width < 1000,
  showNavBar: Dimensions.get("window").width >= 1000,
  showLoginModal: false,
  showRateUsModal: false,
  activeTab: null,
  showConnectionError: false,
  setOrientation: (val: ScreenOrientation.OrientationLock) => {
    set({ orientation: val });
  },
  setIsFullScreen: (val: boolean) => {
    set({ isFullScreen: val });
  },
  setActiveTab: (val: string | null) => {
    set({ activeTab: val });
  },
  setIsOnline: (val: boolean | null) => {
    set({ isOnline: val });
  },
  setIsNeedToLogin: (val: boolean) => {
    set({ isNeedToLogin: val });
  },
  initScreenWidthListener: () => {
    const onChange = ({ window }: { window: { width: number } }) => {
      set({ screenWidth: window.width });
    };
    const subscription = Dimensions.addEventListener("change", onChange);

    return () => subscription?.remove();
  },
  toggleShowNavigation: (val: boolean) => {
    const width = Dimensions.get("window").width;
    set({ showNavigation: width < 1000 && val });
  },
  toggleShowNavBar: (val: boolean) => {
    const width = Dimensions.get("window").width;
    set({ showNavBar: width >= 1000 && val });
  },
  fetchLocalization: async () => {
    const result = await initLocalization();
    set({ localization: result });
    return true;
  },
  toggleShowLoginModal: (val: boolean) => {
    set({ showLoginModal: val });
  },
  toggleShowRateUsModal: (val: boolean) => {
    set({ showRateUsModal: val });
  },
  fetchBanners: async () => {
    const result = await BannersAPI.getBanners();
    set({ banners: result });
    return true;
  },
  setShowConnectionError: (val: boolean) => {
    set({ showConnectionError: val });
  },
}));

export default useSettingsStore;
