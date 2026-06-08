import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import * as Linking from "expo-linking";

type UseShellStartupParams = {
  startApp: () => void | Promise<void>;
  handleDeepLink: (url: string) => void;
  unsubscribeListenersRef: RefObject<(() => void) | null>;
};

export function useShellStartup({
  startApp,
  handleDeepLink,
  unsubscribeListenersRef,
}: UseShellStartupParams) {
  const appInitializedRef = useRef(false);
  const initialUrlProcessedRef = useRef(false);
  const initialUrlFetchingRef = useRef(false);

  useEffect(() => {
    if (appInitializedRef.current) return;
    appInitializedRef.current = true;

    startApp();

    if (!initialUrlFetchingRef.current) {
      initialUrlFetchingRef.current = true;
      const processInitialUrl = async () => {
        try {
          const url = await Linking.getInitialURL();
          if (url && !initialUrlProcessedRef.current) {
            initialUrlProcessedRef.current = true;
            if (__DEV__) console.warn("Initial URL detected:", url);
            setTimeout(() => handleDeepLink(url), 1500);
          }
        } catch (error) {
          console.error("Error getting initial URL:", error);
          initialUrlFetchingRef.current = false;
        }
      };
      processInitialUrl();
    }

    const linkingSubscription = Linking.addEventListener("url", ({ url }) => {
      if (__DEV__) console.warn("Deep link received while app is running:", url);
      handleDeepLink(url);
    });

    return () => {
      if (unsubscribeListenersRef.current) {
        unsubscribeListenersRef.current();
      }
      linkingSubscription.remove();
    };
  }, []);
}
