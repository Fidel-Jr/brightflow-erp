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

// 🔥 Auto logout when token expires
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");

      // Force auth state update WITHOUT reload
      window.dispatchEvent(new Event("logout"));
    }

    return Promise.reject(error);
  }
);


export default api;