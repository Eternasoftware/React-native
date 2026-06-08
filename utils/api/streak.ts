import { StreakResponse } from "@/types/streak.type";
import api from "./axios";

class StreakAPI {
  async getStreak(page: number = 1, limit: number = 20): Promise<StreakResponse> {
    try {
      const response = await api.get("/streak", {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching streak:", error);
      throw new Error("Failed to fetch streak");
    }
  }
}

export default new StreakAPI();
