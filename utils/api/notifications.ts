import api from "./axios";

class NotificationsAPI {
  async setNotificationsData(data: object) {
    try {
      const response = await api.post("/user-subscription-setting", {
        subscription: data,
      });
      return response.data;
    } catch (error) {
      console.error("Error set notifications:", error);
      throw new Error("Failed to set notifications");
    }
  }
  async deleteNotifications(endpoint: string) {
    try {
      const response = await api.post("/user-subscription-setting/delete", {
        endpoint,
      });
      return response.data;
    } catch (error) {
      console.error("Error delete notifications:", error);
      throw new Error("Failed to delete notifications");
    }
  }
}

export default new NotificationsAPI();
