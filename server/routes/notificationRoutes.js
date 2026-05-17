// Import express framework
import express from "express";

// Import notification controller functions
import {
  getNotificationsForUser,      // Get all notifications of logged-in user
  markNotificationAsRead,       // Mark single notification as read
  markAllNotificationsAsRead,   // Mark all notifications as read
  deleteNotification,           // Delete notification
  getUnreadNotificationCount,   // Count unread notifications
} from "../controllers/notificationController.js";

// Import authentication middleware
// protect checks JWT token and verifies user
import { protect } from "../middleware/authMiddleware.js";

// Create router object
const router = express.Router();


// ================= MIDDLEWARE =================

// Apply authentication middleware to ALL notification routes
// User must be logged in to access notifications
router.use(protect);


// ================= NOTIFICATION ROUTES =================

// Get all notifications for logged-in user
// GET -> /api/notifications
router.get("/", getNotificationsForUser);


// Get unread notification count
// Useful for notification badge in frontend
// GET -> /api/notifications/unread-count
router.get("/unread-count", getUnreadNotificationCount);


// Mark single notification as read
// :id = notification id
// PUT -> /api/notifications/:id/read
router.put("/:id/read", markNotificationAsRead);


// Mark all notifications as read
// PUT -> /api/notifications/mark-all-read
router.put("/mark-all-read", markAllNotificationsAsRead);


// Delete notification by ID
// DELETE -> /api/notifications/:id
router.delete("/:id", deleteNotification);


// Export router
export default router;