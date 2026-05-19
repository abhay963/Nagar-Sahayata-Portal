import express from "express";

import {

  getNotificationsForUser,

  markNotificationAsRead,

  markAllNotificationsAsRead,

  deleteNotification,

  getUnreadNotificationCount,

  clearAllNotifications,

} from "../controllers/notificationController.js";

import {

  protect

} from "../middleware/authMiddleware.js";

const router = express.Router();



// ======================================================
// ================= PROTECTED ROUTES ===================
// ======================================================

router.use(protect);



// ======================================================
// ================= GET NOTIFICATIONS ==================
// ======================================================

router.get(
  "/",
  getNotificationsForUser
);



// ======================================================
// ================= UNREAD COUNT =======================
// ======================================================

router.get(
  "/unread-count",
  getUnreadNotificationCount
);



// ======================================================
// ================= MARK SINGLE READ ===================
// ======================================================

router.put(
  "/:id/read",
  markNotificationAsRead
);



// ======================================================
// ================= MARK ALL READ ======================
// ======================================================

router.put(
  "/mark-all-read",
  markAllNotificationsAsRead
);



// ======================================================
// ================= DELETE SINGLE ======================
// ======================================================

router.delete(
  "/:id",
  deleteNotification
);



// ======================================================
// ================= CLEAR ALL ==========================
// ======================================================

router.delete(
  "/clear-all",
  clearAllNotifications
);

export default router;