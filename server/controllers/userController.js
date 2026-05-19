import User from "../models/User.js";
import { validationResult } from "express-validator";

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

  const errors =
    validationResult(req);

  if (!errors.isEmpty()) {

    return res.status(400).json({

      success: false,

      errors:
        errors.array(),
    });
  }

  try {

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

    user.city =
      req.body.city ||
      user.city;

    user.contact =
      req.body.contact ||
      user.contact;

    user.address =
      req.body.address ||
      user.address;

    if (req.file) {

      user.profileImage =
        req.file.path;
    }

    const updatedUser =
      await user.save();

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

        city:
          updatedUser.city,

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

        isApproved:
          updatedUser.isApproved,

        accountStatus:
          updatedUser.accountStatus,
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