// ================= IMPORTS =================

import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import { body } from "express-validator";

import upload from "../middleware/upload.js";

import {

  updateProfile,

  getJuniorStaff,

  getJuniorStaffByDepartment,

} from "../controllers/userController.js";


// ================= ROUTER =================

const router = express.Router();


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

  body("city")
    .notEmpty()
    .withMessage("City is required"),

  body("contact")
    .notEmpty()
    .withMessage("Contact is required"),
];


// ================= UPDATE PROFILE =================

router.put(

  "/update-profile",

  protect,

  upload.single("profileImage"),

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


// ================= EXPORT =================

export default router;