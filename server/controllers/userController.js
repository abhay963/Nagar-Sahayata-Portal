
import User from "../models/User.js";
import { validationResult } from "express-validator";
import path from "path";
import fs from "fs";

// @desc Get junior staff users
// @route GET /api/users/junior-staff
// @access Private
export const getJuniorStaff = async (req, res) => {
  try {
    // Ensure the user is Staff
    if (req.user.role !== "Staff") {
      return res.json([]); // Return empty if not Staff
    }

    const juniorStaff = await User.find({ role: "Junior Staff", department: req.user.department }).select("_id name role");
    res.json(juniorStaff);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching junior staff" });
  }
};


// @desc Update user profile
// @route PUT /api/users/update-profile
// @access Private
export const updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.file) {
      // delete uploaded file if validation failed
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update allowed fields only
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.empId = req.body.empId || user.empId;
    user.department = req.body.department || user.department;
    user.contact = req.body.contact || user.contact;
    user.address = req.body.address || user.address;
    // joiningDate should NOT be updated

    if (req.file) {
      // Delete old profile image if exists
      if (user.profileImage) {
        const oldImagePath = path.join(process.cwd(), user.profileImage.startsWith("/") ? user.profileImage.slice(1) : user.profileImage);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error("Error deleting old profile image:", err);
        });
      }
      // Save new profile image path
      user.profileImage = `/uploads/profile-images/${req.file.filename}`;
    }

    const updatedUser = await user.save();

    res.json({
      updatedUser: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        department: updatedUser.department,
        contact: updatedUser.contact,
        empId: updatedUser.empId,
        address: updatedUser.address,
        profileImage: updatedUser.profileImage,
        joiningDate: updatedUser.joiningDate,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error updating profile" });
  }
};
