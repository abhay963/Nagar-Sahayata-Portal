import User from "../models/User.js";
import { validationResult } from "express-validator";
import Report from "../models/report.js";

export const getJuniorStaff = async (req, res) => {

  try {

    if (req.user.role !== "Staff") {

      return res.status(403).json({

        success: false,

        message:
          "Only staff can access junior staff list",
      });
    }

    const juniorStaff = await User.find({

      role: "Junior Staff",

      department:
        req.user.department,

      city:
        req.user.city,

      isApproved: true,

      accountStatus: "Active",
    })

    .select(
      "_id name email role department city profileImage"
    );

    res.status(200).json({

      success: true,

      juniorStaff,
    });

  } catch (error) {

    console.error(
      "❌ Get Junior Staff Error:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Server error fetching junior staff",
    });
  }
};


export const getJuniorStaffByDepartment =
  async (req, res) => {

    try {

      const { department } =
        req.params;

      const users =
        await User.find({

          role: "Junior Staff",

          department:
            decodeURIComponent(
              department
            ),

          city:
            req.user.city,

          isApproved: true,

          accountStatus: "Active",
        })

        .select(
          "_id name email department role city profileImage"
        );

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

        message:
          "Failed to fetch junior staff",
      });
    }
  };


export const updateProfile = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (
      req.body.email &&
      req.body.email !== user.email
    ) {
      const emailExists = await User.findOne({
        email: req.body.email,
      });

      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }

      user.email = req.body.email;
    }

    if (
      req.body.empId &&
      req.body.empId !== user.empId
    ) {
      const empExists = await User.findOne({
        empId: req.body.empId,
      });

      if (empExists) {
        return res.status(400).json({
          success: false,
          message: "Employee ID already exists",
        });
      }

      user.empId = req.body.empId;
    }

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

    if (
      req.user.role !== "Higher Authority" &&
      req.body.department
    ) {
      user.department = req.body.department;
    }

    if (req.file) {
      user.profileImage = req.file.path;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      updatedUser: user,
    });
  } catch (error) {
    console.error(error);

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

export const getDepartmentsList = async (req, res) => {

  try {

    // ======================================================
    // ALL AVAILABLE DEPARTMENTS
    // ======================================================

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

    // ======================================================
    // GET REPORT COUNTS
    // ======================================================

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

    // ======================================================
    // CONVERT TO MAP
    // ======================================================

    const reportMap = {};

    reportCounts.forEach((item) => {

      reportMap[item._id] =
        item.totalReports;
    });

    // ======================================================
    // FINAL FORMATTED DATA
    // ======================================================

    const departments =
      allDepartments.map((dept) => ({

        department: dept,

        totalReports:
          reportMap[dept] || 0,

        email:
          dept
            .replace(/\s+/g, "")
            .toLowerCase() +
          "@nagarportal.com",
      }));

    res.status(200).json({

      success: true,

      departments,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message:
        "Failed to fetch departments",
    });
  }
};