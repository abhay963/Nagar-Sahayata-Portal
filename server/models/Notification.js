import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["assignment", "general", "alert"],
      default: "general",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    relatedReportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
