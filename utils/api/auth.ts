import api from "./axios";
import { getLocales } from "expo-localization";
import { getTimeZone } from "react-native-localize";
import type { PingAuthResult } from "@/types/auth.type";

class AuthAPI {
  async authGuest(firebaseId: string) {
    try {
      const localization = getLocales()[0].languageCode || "en";
      const timeZone = getTimeZone();
      const response = await api.post("/auth/guest", {
        firebaseId,
        localization,
        timeZone,
      });
      return response.data;
    } catch (error) {
      console.error("Error auth guest:", error);
      throw new Error("Failed auth guest");
    }
  }

  async sendMagicLink(firebaseId: string, email: string) {
    try {
      const response = await api.post("/auth/send-magic-link", {
        firebaseId,
        email,
      });
      return response.data;
    } catch (error) {
      console.error("Error send-magic-link:", error);
      throw new Error("Failed send-magic-link");
    }
  }

  async pingAuth(email: string): Promise<PingAuthResult | undefined> {
    try {
      const response = await api.post<PingAuthResult>("/auth/ping-login", {
        email,
      });
      return response.data;
    } catch (error) {
      console.log("Ping failed:", error);
    }
  }
}

export default new AuthAPI();
