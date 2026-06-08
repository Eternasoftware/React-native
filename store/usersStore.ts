import { create } from "zustand";
import UsersAPI from "@utils/api/users";
import AuthAPI from "@utils/api/auth";
import type { PingAuthResult } from "@/types/auth.type";
import { NotificationsType, SurveyData, UserData, UserUpdatePayload } from "@/types/users.type";
import {
  createUserWithEmailAndPassword,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
  User,
  linkWithCredential,
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setHeaders } from "@/utils/api/axios";
import { DEFAULT_PASSWORD } from "@/utils/constants/auth";
import useSettingsStore from "./settingsStore";
import useProgramStore from "./programsStore";
import { USER_TYPE } from "@/utils/constants/user";
import { getLocales } from "expo-localization";
import { getTimeZone } from "react-native-localize";
import { unsubscribeNotificationsWeb } from "@/utils/notifications/scheduler-web";
import { Platform } from "react-native";
import crashlytics from "@react-native-firebase/crashlytics";
import { STORAGE_KEYS } from "@/utils/constants/common";
import { NotificationHistory } from "@/types/notification.type";
import { getDatesAt10AM, getDateSomeDaysAgo, getSundaysAtNoon } from "@utils/functions";
import { NOTIFICATION_TYPE } from "@/utils/constants/notifications";
import { setUserId } from "@/utils/configs/analytics";

type UsersState = {
  isGuest: boolean;
  user: UserData | null;
  firebaseUser: User | null;
  notificationHistory: null | NotificationHistory[];
  initUser: () => Promise<boolean>;
  fetchUser: () => Promise<void>;
  updateUser: (data: UserUpdatePayload) => Promise<unknown>;
  updateNotifications: (data: Partial<NotificationsType>) => Promise<void>;
  uploadProfileImage: (data: FormData) => Promise<unknown>;
  registerUserFirebase: (email: string) => Promise<User | undefined>;
  loginUserFirebase: (email: string) => Promise<User | undefined>;
  logoutUser: () => Promise<void>;
  loginGuestFirebase: () => Promise<User | undefined>;
  sendMagicLink: (email: string) => Promise<unknown>;
  pingAuth: (email: string) => Promise<PingAuthResult | undefined>;
  setFirebaseUser: (data: User) => void;
  convertGuestToEmailUser: (email: string) => Promise<void>;
  sendSurvey: (data: SurveyData) => Promise<unknown>;
  removeUser: () => Promise<void>;
  checkPendingEmail: () => Promise<{ success: boolean; path?: string }>;
};

const useUsersStore = create<UsersState>((set, get) => ({
  isGuest: true,
  user: null,
  firebaseUser: null,
  notificationHistory: null,
  initUser: async () => {
    const userId = await AsyncStorage.getItem("userId");
    const token = await AsyncStorage.getItem("token");
    if (userId) {
      setHeaders({ ["user-id"]: userId, authorization: token });
      const fetchProgram = useProgramStore.getState().fetchProgram;
      const fetchBanners = useSettingsStore.getState().fetchBanners;
      await get().fetchUser();

      const locale = getLocales()[0].languageCode ?? "en";
      const timeZone = getTimeZone();
      const dataToUpdate: UserUpdatePayload = {};
      if (get().user?.localization !== locale) {
        dataToUpdate.localization = locale;
      }
      if (get().user?.timeZone !== timeZone) dataToUpdate.timeZone = timeZone;

      if (Object.keys(dataToUpdate).length) {
        const updateResult = await get().updateUser(dataToUpdate);
        if (updateResult) await get().fetchUser();
      }
      await Promise.all([fetchProgram(), fetchBanners()]);

      return true;
    }

    return false;
  },

  fetchUser: async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        const response = await UsersAPI.getUser();
        set({ user: response });
        set({ isGuest: response.type === USER_TYPE.GUEST });
        if (Platform.OS === "android" || Platform.OS === "ios") {
          await crashlytics().setAttributes({
            id: response.id,
            email: response.email,
          });
        }

        if (!get().notificationHistory) {
          const key = `${STORAGE_KEYS.NOTIFICATION_DATA}-${response.id}`;
          let savedNotifications = await AsyncStorage.getItem(key);
          if (savedNotifications) {
            const data = await JSON.parse(savedNotifications);
            const datesData: any = {};
            const fromDate = getDateSomeDaysAgo(30);
            if (data.dailyWorkoutReminder && data.dailyWorkoutReminder.length) {
              const dailyWorkoutReminderDates = getDatesAt10AM(data.dailyWorkoutReminder, fromDate);

              dailyWorkoutReminderDates.forEach((el) => {
                if (!datesData[el]) {
                  datesData[el] = [NOTIFICATION_TYPE.DAILY];
                } else {
                  datesData[el].push(NOTIFICATION_TYPE.DAILY);
                }
              });
            }
            if (data.weeklyWorkoutReminder && data.weeklyWorkoutReminder.length) {
              const weeklyWorkoutReminderDates = getSundaysAtNoon(
                data.weeklyWorkoutReminder,
                fromDate
              );

              weeklyWorkoutReminderDates.forEach((el) => {
                if (!datesData[el]) {
                  datesData[el] = [NOTIFICATION_TYPE.WEEKLY];
                } else {
                  datesData[el].push(NOTIFICATION_TYPE.WEEKLY);
                }
              });
            }
            if (Object.keys(datesData).length) {
              const notificationHistoryData = [];
              for (let key in datesData) {
                notificationHistoryData.push({
                  date: new Date(key),
                  notifications: datesData[key],
                });
              }
              notificationHistoryData.sort((a, b) => {
                if (+a.date < +b.date) return 1;
                if (+a.date > +b.date) return -1;
                return 0;
              });

              set({ notificationHistory: notificationHistoryData });
            }
          }
        }
      } else {
        await get().loginGuestFirebase();
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  },
  updateUser: async (data) => {
    try {
      const response = await UsersAPI.updateUser(data);
      await get().fetchUser();
      return response;
    } catch (error: unknown) {
      console.error("Failed to update user:", error);
      if (Platform.OS === "android" || Platform.OS === "ios") {
        crashlytics().recordError(error as Error);
      }
    }
  },
  updateNotifications: async (data) => {
    try {
      const response = await UsersAPI.updateNotifications(data);
      get().fetchUser();
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  },
  uploadProfileImage: async (data: FormData) => {
    try {
      const response = await UsersAPI.uploadProfileImage(data);
      await get().fetchUser();
      return response;
    } catch (error: unknown) {
      console.error("Failed to update profile picture:", error);
      if (Platform.OS === "android" || Platform.OS === "ios") {
        crashlytics().recordError(error as Error);
      }
    }
  },
  registerUserFirebase: async (email: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, DEFAULT_PASSWORD);
      set({ firebaseUser: userCredential.user });
      return userCredential.user;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      if (__DEV__) console.warn("Error signup user in Firebase:", message);
      if (Platform.OS === "android" || Platform.OS === "ios") {
        crashlytics().recordError(error as Error);
      }
    }
  },
  loginUserFirebase: async (email: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, DEFAULT_PASSWORD);
      set({ firebaseUser: userCredential.user });
      return userCredential.user;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      if (__DEV__) console.warn("Error login user in Firebase:", message);
      if (Platform.OS === "android" || Platform.OS === "ios") {
        crashlytics().recordError(error as Error);
      }
    }
  },
  logoutUser: async () => {
    try {
      await signOut(auth);
      set({ firebaseUser: null });
      set({ user: null });
      await AsyncStorage.removeItem("userId");
      if (Platform.OS === "web") await unsubscribeNotificationsWeb();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Error logout user from Firebase:", message);
      if (Platform.OS === "android" || Platform.OS === "ios") {
        crashlytics().recordError(error as Error);
      }
    }
  },
  loginGuestFirebase: async () => {
    try {
      const userCredential = await signInAnonymously(auth);
      set({ firebaseUser: userCredential.user });
      const result = await AuthAPI.authGuest(userCredential.user.uid);
      if (result) {
        await AsyncStorage.setItem("userId", result.userId);
        await AsyncStorage.setItem("token", result.token);
        setHeaders({ ["user-id"]: result.userId });
      }

      return userCredential.user;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      if (__DEV__) console.warn("Error login guest in Firebase:", message);
    }
  },
  sendMagicLink: async (email: string) => {
    try {
      const firebaseUser = get().firebaseUser;
      if (firebaseUser) {
        const result = await AuthAPI.sendMagicLink(firebaseUser.uid, email);
        if (result) {
          await AsyncStorage.setItem("pendingEmail", email);
          return result;
        }
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Error send magic link:", message);
    }
  },
  pingAuth: async (email: string) => {
    try {
      const result = await AuthAPI.pingAuth(email);
      if (result) {
        return result;
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      if (__DEV__) console.warn("Ping:", message);
    }
  },
  setFirebaseUser: (data: User) => {
    set({ firebaseUser: data });
    if (data.uid) {
      setUserId(data.uid);
    }
  },
  convertGuestToEmailUser: async (email: string) => {
    try {
      if (auth.currentUser) {
        const credential = EmailAuthProvider.credential(email, DEFAULT_PASSWORD);
        const userCredential = await linkWithCredential(auth.currentUser, credential);
      }
    } catch (error: unknown) {
      console.error("Error transform guest to user:", error);
      if (Platform.OS === "android" || Platform.OS === "ios") {
        crashlytics().recordError(error as Error);
      }
    }
  },
  sendSurvey: async (data: SurveyData) => {
    try {
      const result = await UsersAPI.sendSurvey(data);
      return result;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Error send survey:", message);
    }
  },
  removeUser: async () => {
    await UsersAPI.deleteUser();
    const user = auth.currentUser;

    if (user && user.email) {
      try {
        const credential = EmailAuthProvider.credential(user.email, DEFAULT_PASSWORD);
        await reauthenticateWithCredential(user, credential);
        await deleteUser(user);
        await AsyncStorage.removeItem("userId");
        await AsyncStorage.removeItem("token");
        setHeaders({ ["user-id"]: null, authorization: null });
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    } else {
      console.log("No user is currently signed in.");
    }
  },
  checkPendingEmail: async () => {
    try {
      const pendingEmail = await AsyncStorage.getItem("pendingEmail");
      if (pendingEmail) {
        const result = await AuthAPI.pingAuth(pendingEmail);
        if (result?.success) {
          await AsyncStorage.setItem("userId", result.userId);
          await AsyncStorage.setItem("token", result.token);
          await AsyncStorage.removeItem("pendingEmail");

          let path = "/?isLogin=true";

          const currentFirebaseUser = auth?.currentUser;
          if (currentFirebaseUser?.uid === result?.firebaseId) {
            await get().convertGuestToEmailUser(pendingEmail);
            path = "/survey";
          } else {
            await get().loginUserFirebase(pendingEmail);
            await get().initUser();
          }

          return { success: true, path };
        } else {
          await AsyncStorage.removeItem("pendingEmail");
          return { success: false };
        }
      }
      return { success: false };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Error checking pending email:", message);
      await AsyncStorage.removeItem("pendingEmail");
      return { success: false };
    }
  },
}));

export default useUsersStore;
