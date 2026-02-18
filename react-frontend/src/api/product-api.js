import api from "./axios";

export const getProducts = () => api.get("/products");

export const createProduct = (productData) => api.post("/products", productData);
export const updateProduct = (id, productData) => api.put(`/products/${id}`, productData);