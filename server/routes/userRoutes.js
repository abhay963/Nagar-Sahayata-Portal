import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { body } from "express-validator";
import multer from "multer";
import path from "path";
import fs from "fs";
import { updateProfile, getJuniorStaff } from "../controllers/userController.js";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "uploads/profile-images");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `user-${req.user.id}-${Date.now()}${ext}`;
    cb(null, filename);
  },
});
const fileFilter = (req, file, cb) => {
  const allowed = ["image/png", "image/jpeg", "image/jpg"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PNG, JPEG JPG allowed for profile image"));
  }
};
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
});

// Validation for profile update
const validateProfileUpdate = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("empId").notEmpty().withMessage("Employee ID is required"),
  body("department").notEmpty().withMessage("Department is required"),
  body("contact").notEmpty().withMessage("Contact is required"),
  body("address").notEmpty().withMessage("Address is required"),
];

router.put(
  "/update-profile",
  protect,
  upload.single("profileImage"),
  validateProfileUpdate,
  updateProfile
);

router.get("/junior-staff", protect, getJuniorStaff);

export default router;
