import { useRef } from "react";
import { useRouter } from "expo-router";
import { UnifiedDeepLinkData } from "react-native-appsflyer";
import { env } from "@/utils/config/env";

export const useDeepLinkHandler = () => {
  const router = useRouter();
  const processedDeepLinkRef = useRef<string | null>(null);
  const processingRef = useRef<boolean>(false);

  const parseQueryParams = (url: string): URLSearchParams => {
    try {
      if (url.includes("://")) {
        const queryString = url.split("?")[1];
        if (queryString) {
          console.log("📋 Parsing custom scheme query string:", queryString);
          return new URLSearchParams(queryString);
        }
        console.log("⚠️ No query string found in custom scheme URL");
        return new URLSearchParams();
      }
      const urlObj = new URL(url);
      return urlObj.searchParams;
    } catch (error) {
      console.error("❌ Error in parseQueryParams, using fallback:", error);
      const queryString = url.split("?")[1] || "";
      return new URLSearchParams(queryString);
    }
  };

  const handleDeepLink = (url: string) => {
    console.log("🔗 handleDeepLink called with URL:", url);

    if (url.includes("expo-development-client") || url.includes("exp+")) {
      console.log("⚠️ Ignoring Expo dev client URL:", url);
      return;
    }

    let normalizedUrl: string;
    try {
      normalizedUrl = decodeURIComponent(url);
    } catch (e) {
      console.log("⚠️ Failed to decode URL, using original:", e);
      normalizedUrl = url;
    }
    const urlKey = normalizedUrl || url;
    console.log("🔑 Normalized URL key:", urlKey);

    if (processedDeepLinkRef.current === urlKey) {
      console.log("⚠️ Deep link already processed, skipping:", url);
      return;
    }

    if (processingRef.current === true) {
      console.log("⚠️ Another deep link is being processed, skipping:", url);
      return;
    }

    processingRef.current = true;
    processedDeepLinkRef.current = urlKey;
    console.log("🔒 Lock acquired, processing deep link:", urlKey);

    try {
      console.log("📋 Starting to parse query params...");
      const searchParams = parseQueryParams(url);
      console.log("📋 Query params parsed successfully");

      const deepLinkValue = searchParams.get("deep_link_value");
      const programId = searchParams.get("af_sub1");

      console.log("🔗 deep_link_value from URL:", deepLinkValue);
      console.log("🔗 af_sub1 (programId) from URL:", programId);

      if (deepLinkValue === "programs" && programId) {
        console.log("✅ Redirecting to programs page with programGuid:", programId);

        try {
          router.push({
            pathname: "/programs",
            params: { programGuid: programId },
          } as any);
          console.log("✅ Navigation triggered successfully");
        } catch (navError) {
          console.error("❌ Navigation error:", navError);
        }

        setTimeout(() => {
          processingRef.current = false;
          processedDeepLinkRef.current = null;
        }, 2000);
        return;
      }

      if (url.includes(env.deepLinkHost)) {
        console.log("🔗 OneLink URL detected without params, waiting for AppsFlyer SDK");

        setTimeout(() => {
          processingRef.current = false;
          processedDeepLinkRef.current = null;
        }, 500);
        return;
      }

      if (!url.includes(env.deepLinkHost) && !url.includes(`${env.appScheme}://`)) {
        console.log("⚠️ Unhandled deep link, resetting lock:", url);
        setTimeout(() => {
          processingRef.current = false;
          processedDeepLinkRef.current = null;
        }, 500);
      }
    } catch (error) {
      console.error("❌ Error parsing deep link URL:", error);
      setTimeout(() => {
        processingRef.current = false;
        processedDeepLinkRef.current = null;
      }, 500);
    }
  };

  const handleAppsFlyerDeepLink = (deepLinkData: UnifiedDeepLinkData) => {
    console.log("📱 AppsFlyer Deep Link Data:", JSON.stringify(deepLinkData, null, 2));
    if (deepLinkData.data) {
      const deepLinkValue = deepLinkData.data.deep_link_value;
      const programId = deepLinkData.data.af_sub1;

      console.log("📱 deep_link_value:", deepLinkValue);
      console.log("📱 af_sub1 (programId):", programId);

      if (deepLinkValue === "programs" && programId) {
        console.log("✅ Redirecting to programs page with programGuid:", programId);
        router.push({
          pathname: "/programs",
          params: { programGuid: programId },
        } as any);
        return;
      }

      if (deepLinkValue) {
        handleDeepLink(deepLinkValue);
      }
    } else {
      console.log("⚠️ AppsFlyer Deep Link data is empty");
    }
  };

  return {
    handleDeepLink,
    handleAppsFlyerDeepLink,
  };
};

export default useDeepLinkHandler;
