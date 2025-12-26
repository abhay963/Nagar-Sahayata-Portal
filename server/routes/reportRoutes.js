// routes/reportRoutes.js
import express from "express";
import { createReport, getReports, assignReport, getAssignedReports } from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createReport);  // App will call this to submit report
router.get("/", getReports);     // Website will call this to fetch reports
router.put("/assign", assignReport); // Assign report to junior staff
router.get("/assigned", protect, getAssignedReports); // Get assigned reports for current user

export default router;
