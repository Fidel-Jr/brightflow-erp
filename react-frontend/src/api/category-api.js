import api from "./axios";

export const getCategories = () => api.get("/categories");

export const createCategory = (categoryData) => api.post("/categories", categoryData);