import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: [true, "Please add a password"],
    },

    role: {
      type: String,
      enum: [
        "Staff",
        "Higher Authority",
        "Junior Staff",
      ],
      default: "Staff",
      trim: true,
    },

    city: {
      type: String,
      default: "",
      trim: true,
    },

    department: {
      type: String,
      trim: true,
      required: function () {
        return this.role !== "Higher Authority";
      },
      default: "",
    },

    contact: {
      type: String,
      required: [true, "Please add contact number"],
      trim: true,
    },

    empId: {
      type: String,
      required: [true, "Please add Employee ID"],
      unique: true,
      trim: true,
      uppercase: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    accountStatus: {
      type: String,
      enum: [
        "Active",
        "Suspended",
        "Blocked",
      ],
      default: "Active",
    },

    joiningDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "User",
  userSchema
);