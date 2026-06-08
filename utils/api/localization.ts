import api from "./axios";

class LocalizationAPI {
  async getLocalization(data: object) {
    try {
      const response = await api.get("/localization", data);
      return response.data;
    } catch (error) {
      console.error("Error fetching localization:", error);
      throw new Error("Failed to fetch localization");
    }
  }
}

export default new LocalizationAPI();
