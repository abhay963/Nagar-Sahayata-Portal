// ================= IMPORTS =================

import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import { body } from "express-validator";

import handleProfileImageUpload from "../middleware/profileUpload.js";

import {

  updateProfile,

  getJuniorStaff,

  getJuniorStaffByDepartment,
  getDepartmentsList

} from "../controllers/userController.js";


// ================= ROUTER =================

const router = express.Router();


// ================= VALIDATION =================

const validateProfileUpdate = [

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required"),

  body("empId").custom((value, { req }) => {
    if (req.user?.role !== "Citizen" && (!value || value.trim() === "")) {
      throw new Error("Employee ID is required");
    }
    return true;
  }),

  // Department required only if NOT Higher Authority and NOT Citizen
  body("department").custom((value, { req }) => {

    if (
      req.user?.role !== "Higher Authority" &&
      req.user?.role !== "Citizen" &&
      (!value || value.trim() === "")
    ) {

      throw new Error("Department is required");
    }

    return true;
  }),

  body("city")
    .trim()
    .notEmpty()
    .withMessage("City is required"),

  body("contact")
    .trim()
    .notEmpty()
    .withMessage("Contact is required"),
];


// ================= UPDATE PROFILE =================

router.put(

  "/update-profile",

  protect,

  handleProfileImageUpload,

  validateProfileUpdate,

  updateProfile
);


// ================= GET JUNIOR STAFF =================

router.get(

  "/junior-staff",

  protect,

  getJuniorStaff
);


// ================= GET JUNIOR STAFF BY DEPARTMENT =================

router.get(

  "/junior-staff/:department",

  protect,

  getJuniorStaffByDepartment
);

router.get(
  "/departments-list",
  protect,
  getDepartmentsList
);
// ================= EXPORT =================

export default router;