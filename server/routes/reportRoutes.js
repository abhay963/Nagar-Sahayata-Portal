import express from "express";
import {

  createReport,

  getReports,
  getStaffAssignedTasks,

  assignReport,

  getAssignedReports,

  getDepartmentReports,

  respondToTask,
  verifyTaskResolution,

  getAssignedTasks,
   updateTaskProgress

} from "../controllers/reportController.js";
import {
  protect,
} from "../middleware/authMiddleware.js";


// ======================================================
// ================= ROUTER =============================
// ======================================================

const router = express.Router();


// ======================================================
// ================= CREATE REPORT ======================
// ======================================================

router.post(

  "/",

  protect,

  createReport
);


// ======================================================
// =========== GET REPORTS BY DEPARTMENT ================
// ======================================================

router.get(

  "/department/:department",

  protect,

  getDepartmentReports
);


// ======================================================
// ==================== GET REPORTS =====================
// ======================================================

router.get(

  "/",

  protect,

  getReports
);


// ======================================================
// =================== ASSIGN REPORT ====================
// ======================================================

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

// ======================================================
// ============== GET ASSIGNED REPORTS ==================
// ======================================================

router.get(

  "/assigned",

  protect,

  getAssignedReports
);


// ======================================================
// =========== ACCEPT / DECLINE TASK ====================
// ======================================================

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
  updateTaskProgress
);

router.put(

  "/verify-task-resolution",

  protect,

  verifyTaskResolution
);

export default router;