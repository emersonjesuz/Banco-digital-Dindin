import axios from "axios";
import { getItemLocalStore } from "../helpers/index.ts";

const api = axios.create({
  baseURL: "https://desafio-backend-03-dindin.pedagogico.cubos.academy",
  timeout: 10000,
  headers: { "Contente-Type": "application/json" },
});
api.interceptors.request.use(
  async (config) => {
    const token = getItemLocalStore("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
