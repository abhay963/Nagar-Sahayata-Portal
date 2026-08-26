import User from "../models/User.js";
import { validationResult } from "express-validator";
import Report from "../models/report.js";

// ======================================================
// GET JUNIOR STAFF
// ======================================================
// Returns Junior Staff belonging to the logged-in Staff's
// same department + same city + Active account.
// ======================================================

export const getJuniorStaff = async (req, res) => {
  try {
    // Only Staff can access Junior Staff
    if (req.user.role !== "Staff") {
      return res.status(403).json({
        success: false,
        message: "Only staff can access junior staff list",
      });
    }

    const juniorStaff = await User.find({
      role: "Junior Staff",
      department: req.user.department,
      city: req.user.city,
      accountStatus: "Active",
    }).select(
      "_id name email role department city profileImage accountStatus"
    );

    res.status(200).json({
      success: true,
      juniorStaff,
    });
  } catch (error) {
    console.error("❌ Get Junior Staff Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error fetching junior staff",
    });
  }
};

// ======================================================
// GET JUNIOR STAFF BY DEPARTMENT
// ======================================================
// Used when Staff wants to assign a report to Junior Staff.
//
// Conditions:
// 1. role = Junior Staff
// 2. department = requested department
// 3. city = logged-in Staff's city
// 4. accountStatus = Active
//
// NO isApproved field is used.
// ======================================================

export const getJuniorStaffByDepartment = async (req, res) => {
  try {
    const { department } = req.params;

    // Decode department coming from URL
    const decodedDepartment = decodeURIComponent(department).trim();

    const staffDepartment = req.user.department?.trim();
    const staffCity = req.user.city?.trim();

    // ==================================================
    // DEBUG INFORMATION
    // ==================================================

    console.log("\n========================================");
    console.log("       JUNIOR STAFF DEBUG");
    console.log("========================================");

    console.log("Logged-in Staff:", req.user.name);
    console.log("Role:", JSON.stringify(req.user.role));

    console.log(
      "Staff Department:",
      JSON.stringify(staffDepartment)
    );

    console.log(
      "Staff City:",
      JSON.stringify(staffCity)
    );

    console.log(
      "Requested Department:",
      JSON.stringify(decodedDepartment)
    );

    // ==================================================
    // GET ALL JUNIOR STAFF
    // ==================================================

    const allJuniorStaff = await User.find({
      role: "Junior Staff",
    }).select(
      "_id name email role department city accountStatus"
    );

    console.log("\n========================================");
    console.log("       ALL JUNIOR STAFF");
    console.log("========================================");

    allJuniorStaff.forEach((user) => {
      console.log({
        name: user.name,
        role: JSON.stringify(user.role),

        department: JSON.stringify(user.department),
        departmentLength: user.department?.length,

        city: JSON.stringify(user.city),
        cityLength: user.city?.length,

        accountStatus: JSON.stringify(
          user.accountStatus
        ),
      });
    });

    // ==================================================
    // FIND MATCHING JUNIOR STAFF
    // ==================================================

    const users = await User.find({
      role: "Junior Staff",

      department: decodedDepartment,

      city: staffCity,

      accountStatus: "Active",
    }).select(
      "_id name email role department city profileImage accountStatus"
    );

    // ==================================================
    // DEBUG MATCHED USERS
    // ==================================================

    console.log("\n========================================");
    console.log("       MATCHED JUNIOR STAFF");
    console.log("========================================");

    console.log(users);

    console.log(
      `Found ${users.length} Junior Staff member(s)`
    );

    // ==================================================
    // RESPONSE
    // ==================================================

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error(
      "❌ Fetch Junior Staff Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch junior staff",
    });
  }
};

// ======================================================
// UPDATE PROFILE
// ======================================================

export const updateProfile = async (req, res) => {
  // ==================================================
  // VALIDATION
  // ==================================================

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }

  try {
    // ==================================================
    // FIND CURRENT USER
    // ==================================================

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ==================================================
    // UPDATE EMAIL
    // ==================================================

    if (
      req.body.email &&
      req.body.email !== user.email
    ) {
      const emailExists = await User.findOne({
        email: req.body.email,
        _id: { $ne: user._id },
      });

      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }

      user.email = req.body.email;
    }

    // ==================================================
    // UPDATE EMPLOYEE ID
    // ==================================================

    if (
      user.role !== "Citizen" &&
      req.body.empId &&
      req.body.empId !== user.empId
    ) {
      const empExists = await User.findOne({
        empId: req.body.empId,
        _id: { $ne: user._id },
      });

      if (empExists) {
        return res.status(400).json({
          success: false,
          message: "Employee ID already exists",
        });
      }

      user.empId = req.body.empId;
    }

    // ==================================================
    // BASIC PROFILE FIELDS
    // ==================================================

    const fields = [
      "name",
      "city",
      "contact",
      "address",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    // ==================================================
    // DEPARTMENT
    // ==================================================

    // Higher Authority and Citizen don't update department
    if (
      req.user.role !== "Higher Authority" &&
      req.user.role !== "Citizen" &&
      req.body.department
    ) {
      user.department = req.body.department;
    }

    // ==================================================
    // PROFILE IMAGE
    // ==================================================

    if (req.file) {
      user.profileImage = req.file.path;
    }

    // ==================================================
    // SAVE
    // ==================================================

    await user.save();

    // ==================================================
    // RESPONSE
    // ==================================================

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      updatedUser: user,
    });
  } catch (error) {
    console.error(
      "❌ Update Profile Error:",
      error
    );

    // Duplicate field error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          Object.keys(error.keyPattern)[0] +
          " already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// GET DEPARTMENTS LIST
// ======================================================

export const getDepartmentsList = async (req, res) => {
  try {
    // ==================================================
    // ALL AVAILABLE DEPARTMENTS
    // ==================================================

    const allDepartments = [
      "Environmental Services",
      "Water Supply",
      "Road Maintenance",
      "Electricity Department",
      "Sanitation",
      "Health Department",
      "Traffic Management",
      "Public Safety",
      "Waste Management",
      "Parks and Recreation",
      "Sewerage Department",
      "Fire Department",
      "Urban Planning",
      "Transport Department",
      "Housing Board",
    ];

    // ==================================================
    // GET REPORT COUNTS
    // ==================================================

    const reportCounts = await Report.aggregate([
      {
        $group: {
          _id: "$department",
          totalReports: {
            $sum: 1,
          },
        },
      },
    ]);

    // ==================================================
    // CONVERT REPORT COUNTS TO MAP
    // ==================================================

    const reportMap = {};

    reportCounts.forEach((item) => {
      reportMap[item._id] = item.totalReports;
    });

    // ==================================================
    // FINAL DEPARTMENT DATA
    // ==================================================

    const departments = allDepartments.map(
      (dept) => ({
        department: dept,

        totalReports:
          reportMap[dept] || 0,

        email:
          dept
            .replace(/\s+/g, "")
            .toLowerCase() +
          "@nagarportal.com",
      })
    );

    // ==================================================
    // RESPONSE
    // ==================================================

    res.status(200).json({
      success: true,
      departments,
    });
  } catch (error) {
    console.error(
      "❌ Get Departments Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch departments",
    });
  }
};