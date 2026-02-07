import api from "./axios";

export const getCurrentUser = () => api.get("/users/me");