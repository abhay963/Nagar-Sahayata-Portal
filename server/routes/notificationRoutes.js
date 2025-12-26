import express from "express";
import {
  getNotificationsForUser,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadNotificationCount,
} from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All notification routes require authentication
router.use(protect);

// Get all notifications for the logged-in user
router.get("/", getNotificationsForUser);

// Get unread notification count for the logged-in user
router.get("/unread-count", getUnreadNotificationCount);

// Mark a specific notification as read
router.put("/:id/read", markNotificationAsRead);

// Mark all notifications as read
router.put("/mark-all-read", markAllNotificationsAsRead);

// Delete a notification
router.delete("/:id", deleteNotification);

export default router;
