import { colors, palette } from "@/assets/styles/constants";

const version = "17.3.12";
const androidVersionCode = 10000170312;
const iosBuildNumber = "94";

const deepLinkHost = process.env.EXPO_PUBLIC_DEEP_LINK_HOST ?? "fitflow-demo.example.com";
const appScheme = process.env.EXPO_PUBLIC_APP_SCHEME ?? "fitflow";
const appsFlyerDevKey = process.env.EXPO_PUBLIC_APPSFLYER_DEV_KEY ?? "YOUR_APPSFLYER_DEV_KEY";
const appsFlyerAppId = process.env.EXPO_PUBLIC_APPSFLYER_APP_ID ?? "YOUR_APPSFLYER_APP_ID";
const facebookAppId = process.env.EXPO_PUBLIC_FACEBOOK_APP_ID ?? "YOUR_FACEBOOK_APP_ID";
const easProjectId = process.env.EXPO_PUBLIC_EAS_PROJECT_ID ?? "YOUR_EAS_PROJECT_ID";

module.exports = {
  name: "FitFlow",
  newArchEnabled: true,
  slug: "fitflow-showcase",
  version: version,
  icon: "./assets/images/icon.png",
  scheme: appScheme,
  userInterfaceStyle: "automatic",
  assetBundlePatterns: ["assets/**/*", "assets/**/**/*"],
  backgroundColor: colors.surface.overlay,
  orientation: "portrait",
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "cover",
    backgroundColor: colors.surface.app,
  },
  ios: {
    supportsTablet: true,
    infoPlist: {
      NSPhotoLibraryUsageDescription:
        "This app needs access to your photo gallery to select files.",
      ITSAppUsesNonExemptEncryption: false,
      AVKitAllowsPictureInPicture: false,
      NSBluetoothAlwaysUsageDescription:
        "This app uses Bluetooth to connect and stream videos via AirPlay and Chromecast.",
      NSLocalNetworkUsageDescription:
        "This app needs permission to discover AirPlay devices on your local network.",
      NSBonjourServices: ["_airplay._tcp", "_raop._tcp"],
      AppsFlyerDevKey: appsFlyerDevKey,
      AppsFlyerAppleAppId: appsFlyerAppId,
      LSApplicationQueriesSchemes: [
        "instagram",
        "instagram-stories",
        "whatsapp",
        "whatsapp-share",
        "whatsapp-sticker",
        "fb",
        "fbapi",
        "fbauth2",
        "facebook-stories",
        "fb-messenger",
        "fb-messenger-api",
        "fb-messenger-share-api",
      ],
      FacebookAppID: facebookAppId,
      FacebookDisplayName: "FitFlow Demo App",
      CFBundleURLTypes: [
        {
          CFBundleURLName: appScheme,
          CFBundleURLSchemes: [appScheme],
        },
      ],
      NSPhotoLibraryAddUsageDescription:
        "Allow $(PRODUCT_NAME) to save images to your photo library.",
    },
    bundleIdentifier: "com.fitflow.demo",
    icon: {
      light: "./assets/images/ios-icon-1024-new.png",
      dark: "./assets/images/ios-icon-1024-dark.png",
    },
    requireFullScreen: true,
    googleServicesFile: "./secrets/GoogleService-Info.plist",
    associatedDomains: [`applinks:${deepLinkHost}`],
    buildNumber: iosBuildNumber,
  },
  android: {
    icon: "./assets/images/icon.png",
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: palette.brand.lime,
      monochromeImage: "./assets/images/adaptive-icon.png",
    },
    roundIcon: "./assets/images/icon.png",
    package: "com.fitflow.demo",
    permissions: [
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE",
      "READ_MEDIA_IMAGES",
      "com.google.android.gms.permission.AD_ID",
      "ACCESS_NETWORK_STATE",
      "ACCESS_WIFI_STATE",
      "CHANGE_WIFI_STATE",
      "INTERNET",
      "NEARBY_WIFI_DEVICES",
      "ACCESS_FINE_LOCATION",
    ],
    softwareKeyboardLayoutMode: "pan",
    googleServicesFile: "./secrets/google-services.json",
    versionCode: androidVersionCode,
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: [
          {
            scheme: "https",
            host: deepLinkHost,
            pathPrefix: "/app/*",
          },
        ],
        category: ["BROWSABLE", "DEFAULT"],
      },
      {
        action: "VIEW",
        data: [{ scheme: appScheme }],
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    "expo-font",
    "expo-asset",
    "expo-localization",
    ["./plugins/withAsyncStorageBackupRules.js"],
    "expo-web-browser",
    ["react-native-appsflyer", {}],
    "react-native-google-cast",
    [
      "@react-native-firebase/app",
      {
        ios: { googleServicesFile: "./secrets/GoogleService-Info.plist" },
        android: { googleServicesFile: "./secrets/google-services.json" },
      },
    ],
    "@react-native-firebase/crashlytics",
    [
      "expo-video",
      {
        supportsBackgroundPlayback: false,
        supportsPictureInPicture: false,
      },
    ],
    [
      "expo-build-properties",
      {
        ios: {
          useFrameworks: "static",
          deploymentTarget: "15.1",
        },
        android: {
          compileSdkVersion: 35,
          targetSdkVersion: 35,
          minSdkVersion: 24,
          icon: "./assets/images/icon.png",
        },
      },
    ],
    [
      "expo-document-picker",
      {
        iCloudContainerEnvironment: "Production",
      },
    ],
    [
      "react-native-video",
      {
        enableBackgroundAudio: false,
        androidExtensions: {
          useExoplayerHls: true,
          useExoplayerDash: true,
        },
      },
    ],
    "expo-splash-screen",
    [
      "expo-sensors",
      {
        motionPermission: "Allow $(PRODUCT_NAME) to access your device motion.",
      },
    ],
    [
      "expo-media-library",
      {
        photosPermission: "Allow $(PRODUCT_NAME) to access your photos.",
        savePhotosPermission: "Allow $(PRODUCT_NAME) to save photos.",
        isAccessMediaLocationEnabled: true,
      },
    ],
    [
      "expo-image-picker",
      {
        photosPermission: "The app accesses your photos to let you choose your profile image.",
      },
    ],
    [
      "expo-screen-orientation",
      {
        initialOrientation: "PORTRAIT",
      },
    ],
    [
      "expo-notifications",
      {
        defaultChannel: "default",
        sounds: ["./assets/sounds/notification.mp3"],
        enableBackgroundRemoteNotifications: false,
        icon: "./assets/images/notification-icon.png",
        color: palette.status.warning,
      },
    ],
    [
      "react-native-share",
      {
        ios: [
          "fb",
          "fbapi",
          "fb-messenger-share-api",
          "instagram",
          "twitter",
          "tiktoksharesdk",
          "whatsapp",
          "fb-messenger",
        ],
        android: [
          "com.facebook.katana",
          "com.instagram.android",
          "com.twitter.android",
          "com.zhiliaoapp.musically",
        ],
        enableBase64ShareAndroid: true,
      },
    ],
    ["./plugins/rnfb-nonmodular-fix", { allTargets: true, disableDefinesModuleForRNFB: true }],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId: easProjectId,
    },
    version,
    androidVersionCode,
  },
};
