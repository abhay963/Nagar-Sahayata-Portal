import API from "../api/axios";

export const getDashboardStats = () =>
  API.get("/api/reports/dashboard-stats");

export const fetchAnalytics = () =>
  API.get("/api/reports/analytics");