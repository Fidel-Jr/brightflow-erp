import api from "./axios";

export const register = (data) =>
  api.post("/auth/register", data);

export const loginAccount = (data) =>
  api.post("/auth/login", data);