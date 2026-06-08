import { Platform } from "react-native";
import nativeAnalytics from "@react-native-firebase/analytics";
import {
  initWebAnalytics,
  getWebAnalytics,
  isWebAnalyticsReady,
  logWebEvent,
  setWebUserId,
  setWebUserProperties,
} from "@/firebaseConfig";

let webInitPromise: Promise<void> | null = null;

async function ensureWebAnalyticsInitialized() {
  if (!isWebAnalyticsReady()) {
    if (!webInitPromise) {
      webInitPromise = initWebAnalytics();
    }
    await webInitPromise;
  }
}

export async function logEvent(name: string, params?: Record<string, any>) {
  try {
    if (Platform.OS === "web") {
      await ensureWebAnalyticsInitialized();
      const instance = getWebAnalytics();
      if (instance) {
        logWebEvent(instance, name, { ...params, debug_mode: "true" });
      } else {
        console.warn("[Analytics] Web analytics instance is null");
      }
    } else {
      await nativeAnalytics().logEvent(name, params);
    }
  } catch (err) {
    console.error("[Analytics] Failed to log event:", err);
  }
}

export async function setUserId(userId: string) {
  if (Platform.OS === "web") {
    await ensureWebAnalyticsInitialized();
    const instance = getWebAnalytics();
    if (instance) {
      setWebUserId(instance, userId);
    }
  } else {
    await nativeAnalytics().setUserId(userId);
  }
}

export async function setUserProperties(properties: Record<string, string>) {
  if (Platform.OS === "web") {
    await ensureWebAnalyticsInitialized();
    const instance = getWebAnalytics();
    if (instance) {
      setWebUserProperties(instance, properties);
    }
  } else {
    await nativeAnalytics().setUserProperties(properties);
  }
}
