import api from "./axios";

export const getOrders = () => api.get("/orders");

export const createOrder = (orderData) => api.post("/orders", orderData);
export const updateOrder = (id, orderData) => api.put(`/orders/${id}`, orderData);
export const deleteOrder = (id) => api.delete(`/orders/${id}`);