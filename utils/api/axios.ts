import axios from "axios";
import { env } from "@/utils/config/env";

const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export const setHeaders = (headers: any) => {
  if (headers) {
    api.defaults.headers = headers;
  }
};

export default api;
