// Import mongoose for MongoDB schema/model creation
import mongoose from "mongoose";


// ================= USER SCHEMA =================

const userSchema = new mongoose.Schema(

  {

    // ================= NAME =================
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },


    // ================= EMAIL =================
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      trim: true,
      lowercase: true,
    },


    // ================= PASSWORD =================
    password: {
      type: String,
      required: [true, "Please add a password"],
    },


    // ================= ROLE =================
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


    // ================= DEPARTMENT =================
    department: {

      type: String,

      trim: true,

      required: function () {

        // Department required
        // except Higher Authority
        return this.role !== "Higher Authority";
      },

      default: "",
    },


    // ================= CONTACT =================
    contact: {
      type: String,
      required: [true, "Please add a contact"],
      trim: true,
    },


    // ================= EMPLOYEE ID =================
    empId: {
      type: String,
      required: [true, "Please add Employee ID"],
      unique: true,
      trim: true,
      uppercase: true,
    },


    // ================= ADDRESS =================
    address: {
      type: String,
      required: [true, "Please add an address"],
      trim: true,
    },


    // ================= PROFILE IMAGE =================
    profileImage: {
      type: String,
      default: "",
    },


    // ================= JOINING DATE =================
    joiningDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

  },

  // ================= TIMESTAMPS =================
  {
    timestamps: true,
  }
);


// ================= EXPORT MODEL =================

export default mongoose.model(
  "User",
  userSchema
);