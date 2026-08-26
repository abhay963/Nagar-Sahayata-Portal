import API from "../api/axios";

// Reports

export const createReport = (formData) =>
  API.post("/api/reports", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getReports = () =>
  API.get("/api/reports");

export const getDepartmentReports = (department) =>
  API.get(`/api/reports/department/${department}`);

export const assignReport = (data) =>
  API.put("/api/reports/assign", data);

// Assigned Reports

export const getAssignedReports = () =>
  API.get("/api/reports/assigned");

export const getAssignedTasks = () =>
  API.get("/api/reports/my-assigned-tasks");

export const getStaffAssignedTasks = () =>
  API.get("/api/reports/staff-assigned-tasks");

// Task Actions

export const respondTask = (data) =>
  API.put("/api/reports/respond-task", data);

export const updateTaskProgress = (formData) =>
  API.put("/api/reports/update-task-progress", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const verifyTaskResolution = (data) =>
  API.put("/api/reports/verify-task-resolution", data);

// Dashboard

export const getAnalytics = () =>
  API.get("/api/reports/analytics");

export const getDashboardStats = () =>
  API.get("/api/reports/dashboard-stats");