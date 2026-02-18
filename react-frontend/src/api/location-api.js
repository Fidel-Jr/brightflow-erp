import api from "./axios";

export const getLocations = () => api.get("/locations");