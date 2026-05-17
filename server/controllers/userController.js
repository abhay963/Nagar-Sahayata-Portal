// Import User model
import User from "../models/User.js";

// Import validationResult for validation
import { validationResult } from "express-validator";

// Import path module
import path from "path";

// Import file system module
import fs from "fs";


// ======================================================
// ================= GET JUNIOR STAFF ===================
// ======================================================

// @desc    Get junior staff of logged-in staff department
// @route   GET /api/users/junior-staff
// @access  Private

export const getJuniorStaff = async (req, res) => {

  try {

    // ======================================================
    // ================= ROLE CHECK =========================
    // ======================================================

    if (req.user.role !== "Staff") {

      return res.status(403).json({

        success: false,

        message:
          "Only staff can access junior staff list",
      });
    }


    // ======================================================
    // ================= FETCH USERS ========================
    // ======================================================

    const juniorStaff = await User.find({

      role: "Junior Staff",

      department:
        req.user.department,

    })

    .select(

      "_id name email role department"
    );


    // ======================================================
    // ================= RESPONSE ===========================
    // ======================================================

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



// ======================================================
// =========== GET STAFF BY DEPARTMENT ==================
// ======================================================

// @desc    Get junior staff by department
// @route   GET /api/users/junior-staff/:department
// @access  Private

export const getJuniorStaffByDepartment =
  async (req, res) => {

    try {

      // ======================================================
      // ================= GET PARAM ==========================
      // ======================================================

      const { department } =
        req.params;


      // ======================================================
      // ================= FIND USERS =========================
      // ======================================================

      const users =
        await User.find({

          role: "Junior Staff",

          department:
            decodeURIComponent(
              department
            )

        })

        .select(

          "_id name email department role"
        );


      // ======================================================
      // ================= RESPONSE ===========================
      // ======================================================

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



// ======================================================
// ================= UPDATE PROFILE =====================
// ======================================================

// @desc    Update logged-in user profile
// @route   PUT /api/users/update-profile
// @access  Private

export const updateProfile = async (req, res) => {

  // ======================================================
  // ================= VALIDATION =========================
  // ======================================================

  const errors =
    validationResult(req);


  if (!errors.isEmpty()) {

    // Delete uploaded image if validation fails
    if (req.file) {

      fs.unlink(
        req.file.path,
        (err) => {

          if (err) {

            console.error(

              "❌ Error deleting file:",

              err
            );
          }
        }
      );
    }

    return res.status(400).json({

      success: false,

      errors:
        errors.array(),
    });
  }


  try {

    // ======================================================
    // ================= FIND USER ==========================
    // ======================================================

    const user =
      await User.findById(
        req.user._id
      );


    if (!user) {

      return res.status(404).json({

        success: false,

        message:
          "User not found",
      });
    }


    // ======================================================
    // ================= UPDATE FIELDS ======================
    // ======================================================

    user.name =
      req.body.name ||
      user.name;

    user.email =
      req.body.email ||
      user.email;

    user.empId =
      req.body.empId ||
      user.empId;

    user.department =
      req.body.department ||
      user.department;

    user.contact =
      req.body.contact ||
      user.contact;

    user.address =
      req.body.address ||
      user.address;


    // ======================================================
    // ================= PROFILE IMAGE ======================
    // ======================================================

    if (req.file) {

      // Delete old image
      if (user.profileImage) {

        const oldImagePath =
          path.join(

            process.cwd(),

            user.profileImage.startsWith("/")

              ? user.profileImage.slice(1)

              : user.profileImage
          );

        fs.unlink(
          oldImagePath,
          (err) => {

            if (err) {

              console.error(

                "❌ Error deleting old image:",

                err
              );
            }
          }
        );
      }


      // Save new image path
      user.profileImage =
        `/uploads/profile-images/${req.file.filename}`;
    }


    // ======================================================
    // ================= SAVE USER ==========================
    // ======================================================

    const updatedUser =
      await user.save();


    // ======================================================
    // ================= RESPONSE ===========================
    // ======================================================

    res.status(200).json({

      success: true,

      updatedUser: {

        _id:
          updatedUser._id,

        name:
          updatedUser.name,

        email:
          updatedUser.email,

        role:
          updatedUser.role,

        department:
          updatedUser.department,

        contact:
          updatedUser.contact,

        empId:
          updatedUser.empId,

        address:
          updatedUser.address,

        profileImage:
          updatedUser.profileImage,

        joiningDate:
          updatedUser.joiningDate,
      },
    });

  } catch (error) {

    console.error(

      "❌ Update Profile Error:",

      error
    );

    res.status(500).json({

      success: false,

      message:
        "Server error updating profile",
    });
  }
};