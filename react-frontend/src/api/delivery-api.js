import api from "./axios";

export const createDelivery = (deliveryData) => api.post("/deliveries", deliveryData);
export const getDeliveries = () => api.get("/deliveries");
export const assignDriver = (deliveryId, data) => api.put(`/deliveries/${deliveryId}/assign-driver`, data);
export const unassignDriver = (deliveryId) => api.put(`/deliveries/${deliveryId}/unassign-driver`);
export const updateDeliveryStatus = (deliveryId, status) =>
  api.patch(`/deliveries/${deliveryId}/status`, { status });

// OrderId
// Notes

export const getDeliveryByOrderNumber = (orderNumber) =>
  api.get(`/deliveries/${orderNumber}`);