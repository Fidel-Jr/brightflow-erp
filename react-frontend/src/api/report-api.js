import api from "./axios";

export const getDashboardSummary = () => api.get("/reports/dashboard-summary");
export const getMonthlyRevenue = (months) => api.post("/reports/monthly-revenue", { months });