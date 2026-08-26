import API from "../api/axios";

// Reports

export const createReport = (formData) =>
  API.post("/reports", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getReports = () =>
  API.get("/reports");

export const getDepartmentReports = (department) =>
  API.get(`/reports/department/${department}`);

export const assignReport = (data) =>
  API.put("/reports/assign", data);

// Assigned Reports

export const getAssignedReports = () =>
  API.get("/reports/assigned");

export const getAssignedTasks = () =>
  API.get("/reports/my-assigned-tasks");

export const getStaffAssignedTasks = () =>
  API.get("/reports/staff-assigned-tasks");

// Task Actions

export const respondTask = (data) =>
  API.put("/reports/respond-task", data);

export const updateTaskProgress = (formData) =>
  API.put("/reports/update-task-progress", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const verifyTaskResolution = (data) =>
  API.put("/reports/verify-task-resolution", data);

// Dashboard

export const getAnalytics = () =>
  API.get("/reports/analytics");

export const getDashboardStats = () =>
  API.get("/reports/dashboard-stats");