import api from "./axios";

class TermsAPI {
  async getPrivacyPolicy() {
    try {
      const response = await api.get("/content-text/privacy-policy");
      return response.data;
    } catch (error) {
      console.error("Error fetching Privacy Policy:", error);
      throw new Error("Failed to fetch Privacy Policy");
    }
  }
  async getTermsOfService() {
    try {
      const response = await api.get("/content-text/terms-of-service");
      return response.data;
    } catch (error) {
      console.error("Error fetching Terms of Service:", error);
      throw new Error("Failed to fetch Terms of Service");
    }
  }
}

export default new TermsAPI();
