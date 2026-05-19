import express from "express";

import {
  getNotificationsForUser,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadNotificationCount,
} from "../controllers/notificationController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get(
  "/",

  getNotificationsForUser
);

router.get(
  "/unread-count",

  getUnreadNotificationCount
);

router.put(
  "/:id/read",

  markNotificationAsRead
);

router.put(
  "/mark-all-read",

  markAllNotificationsAsRead
);

router.delete(
  "/:id",

  deleteNotification
);

export default router;