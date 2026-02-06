import axios from "axios";

export const api = axios.create({
  baseURL: "/api"
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;