import API from "../api/axios";

export const getDashboardStats = () =>
  API.get("/reports/dashboard-stats");

export const fetchAnalytics = () =>
  API.get("/reports/analytics");