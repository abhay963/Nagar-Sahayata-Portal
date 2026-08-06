import express from "express";

import {
  createReport,
  getReports,
  getDepartmentReports,
  assignReport,
  getAssignedReports,
  getAssignedTasks,
  getStaffAssignedTasks,
  respondToTask,
  updateTaskProgress,
  verifyTaskResolution,
  getAnalyticsData,
  getDashboardStats,
} from "../controllers/reportController.js";

import { protect } from "../middleware/authMiddleware.js";

import {
  uploadReportImage,
  uploadTaskImages,
} from "../middleware/reportUpload.js";

const router = express.Router();

router.post(
  "/",
  protect,
  uploadReportImage,
  createReport
);

router.get(
  "/department/:department",
  protect,
  getDepartmentReports
);

router.get(
  "/",
  protect,
  getReports
);

router.put(
  "/assign",
  protect,
  assignReport
);

router.get(
  "/staff-assigned-tasks",
  protect,
  getStaffAssignedTasks
);

router.get(
  "/assigned",
  protect,
  getAssignedReports
);

router.put(
  "/respond-task",
  protect,
  respondToTask
);

router.get(
  "/my-assigned-tasks",
  protect,
  getAssignedTasks
);

router.put(
  "/update-task-progress",
  protect,
  uploadTaskImages,
  updateTaskProgress
);

router.put(
  "/verify-task-resolution",
  protect,
  verifyTaskResolution
);

router.get(
  "/analytics",
  protect,
  getAnalyticsData
);

router.get(
  "/dashboard-stats",
  protect,
  getDashboardStats
);

export default router;