import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence, Auth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import {
  getAnalytics,
  logEvent as logWebEvent,
  setUserId as setWebUserId,
  setUserProperties as setWebUserProperties,
  Analytics,
  isSupported,
} from "firebase/analytics";
import { env } from "@/utils/config/env";

const firebaseConfig = env.firebase;

const app = initializeApp(firebaseConfig);

let auth: Auth;

if (Platform.OS === "web") {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}
let webAnalytics: Analytics | null = null;
let webAnalyticsReady = false;

async function initWebAnalytics(): Promise<void> {
  const supported = await isSupported();
  if (supported) {
    webAnalytics = getAnalytics(app);
    webAnalyticsReady = true;
  } else {
    console.warn("[Firebase] Web analytics not supported");
  }
}

function getWebAnalytics(): Analytics | null {
  return webAnalytics;
}

function isWebAnalyticsReady(): boolean {
  return webAnalyticsReady;
}

export {
  app,
  auth,
  initWebAnalytics,
  getWebAnalytics,
  isWebAnalyticsReady,
  logWebEvent,
  setWebUserId,
  setWebUserProperties,
};
