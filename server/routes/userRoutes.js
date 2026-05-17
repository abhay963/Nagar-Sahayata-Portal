// Import express framework
import express from "express";

// Import authentication middleware
import {
  protect
} from "../middleware/authMiddleware.js";

// Import validation library
import { body } from "express-validator";

// Import multer for file uploads
import multer from "multer";

// Import path module for file paths
import path from "path";

// Import fs module for file system operations
import fs from "fs";

// Import controller functions
import {

  updateProfile,

  getJuniorStaff,

  getJuniorStaffByDepartment

} from "../controllers/userController.js";


// Create router object
const router = express.Router();


// ================= MULTER SETUP =================

const storage = multer.diskStorage({

  // Upload folder
  destination: (req, file, cb) => {

    const uploadDir = path.join(

      process.cwd(),

      "uploads/profile-images"
    );

    // Create folder if not exists
    if (!fs.existsSync(uploadDir)) {

      fs.mkdirSync(uploadDir, {
        recursive: true
      });
    }

    cb(null, uploadDir);
  },


  // File name
  filename: (req, file, cb) => {

    const ext =
      path.extname(
        file.originalname
      );

    const filename =
      `user-${req.user.id}-${Date.now()}${ext}`;

    cb(null, filename);
  },
});


// ================= FILE FILTER =================

const fileFilter = (req, file, cb) => {

  const allowed = [

    "image/png",

    "image/jpeg",

    "image/jpg",
  ];

  if (
    allowed.includes(
      file.mimetype
    )
  ) {

    cb(null, true);

  } else {

    cb(
      new Error(
        "Only PNG, JPEG, JPG allowed"
      )
    );
  }
};


// ================= MULTER INSTANCE =================

const upload = multer({

  storage,

  fileFilter,

  limits: {

    fileSize:
      2 * 1024 * 1024,
  },
});


// ================= VALIDATION =================

const validateProfileUpdate = [

  body("name")
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .isEmail()
    .withMessage("Valid email is required"),

  body("empId")
    .notEmpty()
    .withMessage("Employee ID is required"),

  body("department")
    .notEmpty()
    .withMessage("Department is required"),

  body("contact")
    .notEmpty()
    .withMessage("Contact is required"),

  body("address")
    .notEmpty()
    .withMessage("Address is required"),
];


// ======================================================
// ================= UPDATE PROFILE =====================
// ======================================================

router.put(

  "/update-profile",

  protect,

  upload.single(
    "profileImage"
  ),

  validateProfileUpdate,

  updateProfile
);


// ======================================================
// =========== GET JUNIOR STAFF BY DEPARTMENT ===========
// ======================================================

router.get(

  "/junior-staff/:department",

  protect,

  getJuniorStaffByDepartment
);









// ======================================================
// ================= EXPORT ROUTER ======================
// ======================================================

export default router;