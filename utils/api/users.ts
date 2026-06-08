import api from "./axios";
import { SurveyData } from "@/types/users.type";

class UsersAPI {
  async getUser() {
    try {
      const response = await api.get("/profile");
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw new Error("Failed to fetch user");
    }
  }

  async updateUser(data: object) {
    try {
      const response = await api.put("/profile", data);
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Failed to update user");
    }
  }

  async updateNotifications(data: object) {
    try {
      const response = await api.put("/profile/notifications", data);
      return response.data;
    } catch (error) {
      console.error("Error updating notifications:", error);
      throw new Error("Failed to update notifications");
    }
  }

  async uploadProfileImage(formData: FormData) {
    try {
      const response = await api.post("/profile/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response;
    } catch (error) {
      console.error("Failed to update profile picture", error);
    }
  }

  async sendSurvey(data: SurveyData) {
    try {
      const response = await api.post("/set-up", data);
      return response;
    } catch (error) {
      console.error("Error send survey:", error);
      throw new Error("Failed to send survey");
    }
  }

  async deleteUser() {
    try {
      const response = await api.delete("/user");
      return response;
    } catch (error) {
      console.error("Error delete user:", error);
      throw new Error("Failed to delete user");
    }
  }

  async sendContactUsForm(data: FormData) {
    try {
      const response = await api.post("/contact-us", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      console.error("Error send form:", error);
      throw new Error("Failed to send form");
    }
  }
}

export default new UsersAPI();
