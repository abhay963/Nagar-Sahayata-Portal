import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import cloudinary from "../config/cloudinary.js";

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
  updateTaskProgress,
} from "../controllers/reportController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => ({
    folder: "nagar-sahayata/reports",

    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
      "webp",
    ],

    public_id: `report-${Date.now()}`,
  }),
});

const fileFilter = (req, file, cb) => {

  const allowed = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
  ];

  if (
    allowed.includes(file.mimetype)
  ) {

    cb(null, true);

  } else {

    cb(
      new Error(
        "Only PNG, JPEG, JPG, WEBP allowed"
      )
    );
  }
};

const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post(
  "/",

  protect,

  upload.single("image"),

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

  upload.fields([
    {
      name: "resolvedImage",
      maxCount: 1,
    },

    {
      name: "unableImage",
      maxCount: 1,
    },
  ]),

  updateTaskProgress
);

router.put(
  "/verify-task-resolution",

  protect,

  verifyTaskResolution
);

export default router;