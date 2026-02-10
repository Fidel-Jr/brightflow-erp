import api from "./axios";

export const getCurrentUser = () => api.get("/users/me");

export const getUsers = () => api.get("/users");

export const updateUser = (id, data) => api.put(`/users/${id}`, data);

export const deleteUser = (id) => api.delete(`/users/${id}`);

export const createUser = (data) => api.post("/users", data);