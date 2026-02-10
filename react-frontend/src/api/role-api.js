import api from "./axios";

export const getRoles = () => api.get("/roles");

export const createRole = (data) => api.post("/roles", data);