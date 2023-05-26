import axios from "axios";

const api = axios.create({
  baseURL: "https://desafio-backend-03-dindin.pedagogico.cubos.academy",
  timeout: 10000,
  headers: { "Contente-Type": "application/json" },
});

export default api;
