export const env = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? "https://api.fitflow-demo.example.com/api",
  doHost: process.env.EXPO_PUBLIC_DO_HOST ?? "https://cdn.fitflow-demo.example.com",
  deepLinkHost: process.env.EXPO_PUBLIC_DEEP_LINK_HOST ?? "fitflow-demo.example.com",
  appScheme: process.env.EXPO_PUBLIC_APP_SCHEME ?? "fitflow",
  appLink: process.env.EXPO_PUBLIC_APP_LINK ?? "https://fitflow-demo.example.com/app",
  firebase: {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? "YOUR_FIREBASE_API_KEY",
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "fitflow-demo.firebaseapp.com",
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? "fitflow-demo",
    storageBucket:
      process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "fitflow-demo.firebasestorage.app",
    messagingSenderId:
      process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "YOUR_FIREBASE_MESSAGING_SENDER_ID",
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? "YOUR_FIREBASE_APP_ID",
    measurementId:
      process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "YOUR_FIREBASE_MEASUREMENT_ID",
  },
  appsFlyer: {
    devKey: process.env.EXPO_PUBLIC_APPSFLYER_DEV_KEY ?? "YOUR_APPSFLYER_DEV_KEY",
    appId: process.env.EXPO_PUBLIC_APPSFLYER_APP_ID ?? "YOUR_APPSFLYER_APP_ID",
  },
  facebookAppId: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID ?? "YOUR_FACEBOOK_APP_ID",
  vapidPublicKey: process.env.EXPO_PUBLIC_VAPID_PUBLIC_KEY ?? "YOUR_VAPID_PUBLIC_KEY",
  easProjectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID ?? "YOUR_EAS_PROJECT_ID",
  isDev: process.env.EXPO_PUBLIC_ENV !== "production",
} as const;
