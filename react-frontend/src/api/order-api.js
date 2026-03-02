import api from "./axios";

export const getOrders = () => api.get("/orders");

export const getWarehouseLocation = () => api.get("/orders/warehouse-location");

export const createOrder = (orderData) => api.post("/orders", orderData);
export const updateOrder = (id, orderData) => api.put(`/orders/${id}`, orderData);
export const deleteOrder = (id) => api.delete(`/orders/${id}`);

export const getOrderByOrderNumber = (orderNumber) =>
  api.get(`/orders/${orderNumber}`);

export const updateOrderStatus = (orderNumber, status) =>
  api.patch(`/orders/${orderNumber}/status`, { status });