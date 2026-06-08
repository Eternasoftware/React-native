import api from "./axios";

class BannersAPI {
  async getBanners() {
    try {
      const response = await api.get("/banners");
      return response.data;
    } catch (error) {
      console.error("Error fetching banners:", error);
      throw new Error("Failed to fetch banners");
    }
  }
}

export default new BannersAPI();
