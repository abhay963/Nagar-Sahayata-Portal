import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    role: {
      type: String,
      enum: ["Staff", "Higher Authority", "Junior Staff"],
      default: "Staff",
    },
    department: {
      type: String,
      required: function () {
        return this.role !== "Higher Authority"; // ✅ Only required if NOT Higher Authority
      },
    },
    contact: {
      type: String,
      required: [true, "Please add a contact"],
    },
    empId: {
      type: String,
      required: [true, "Please add Employee ID"],
      unique: true,
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    profileImage: {
      type: String,
      default: "", // store relative URL path like /uploads/profile-images/filename.jpg
    },
    joiningDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
