// controllers/reportController.js
import mongoose from "mongoose";
import { connectReportsDB } from "../config/db.js";
import Notification from "../models/Notification.js";

// Shared Report Schema (used in both create and get)
const reportSchema = new mongoose.Schema({
  problemType: { type: String, required: true },
  description: { type: String, required: true },
  department: { 
    type: String, 
    required: true, 
    default: "General" // ✅ Default if not provided
  },
  location: {
    latitude: { type: Number },
    longitude: { type: Number },
    locationn: { type: String }
  },
  imageBase64: { type: String },
  status: { type: String, default: "Pending" },
  priority: {
    type: String,
    enum: ["Normal", "medium", "high"],
    default: "Normal"

  },
  timestamp: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.Mixed, ref: "User", default: null },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null } // New field for assignment
}, { timestamps: true });

// Pre-save middleware to handle userId
reportSchema.pre('save', function(next) {
  if (this.userId === "anonymous" || (typeof this.userId === 'string' && !mongoose.Types.ObjectId.isValid(this.userId))) {
    this.userId = null;
  }
  next();
});

// Create new report (from app)
export const createReport = async (req, res) => {
  try {
    const reportsConnection = await connectReportsDB();
    const Report = reportsConnection.model("Report", reportSchema);
    
    // ✅ If no department is sent, set default
    const reportData = {
      ...req.body,
      department: req.body.department || "General"
    };

  // Calculate priority based on existing reports at the same location
  const existingReports = await Report.find({ location: reportData.location });
  const count = existingReports.length + 1; // including this new report

  if (count === 1) {
    reportData.priority = "Normal";
  } else if (count === 2) {
    reportData.priority = "medium";
  } else if (count >= 3) {
    reportData.priority = "high";
  } else {
    reportData.priority = "Normal";
  }

  // Handle userId: if "anonymous" or invalid, set to null
  if (reportData.userId === "anonymous" || !mongoose.Types.ObjectId.isValid(reportData.userId)) {
    reportData.userId = null;
  }

    const report = new Report(reportData);
    await report.save();

    // If high priority, send notification to all (implementation depends on notification system)
    if (reportData.priority === "high") {
      // TODO: Implement notification sending logic here
      // e.g., notifyAllUsers(`High priority report at ${reportData.location}`);
    }

    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all reports (for officer dashboard)
export const getReports = async (req, res) => {
  try {
    const reportsConnection = await connectReportsDB();
    const Report = reportsConnection.model("Report", reportSchema);

    const reports = await Report.find().sort({ timestamp: -1 });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assign report to junior staff
export const assignReport = async (req, res) => {
  try {
    const { reportId, assignedTo } = req.body;
    if (!reportId || !assignedTo) {
      return res.status(400).json({ message: "reportId and assignedTo are required" });
    }

    const reportsConnection = await connectReportsDB();
    const Report = reportsConnection.model("Report", reportSchema);

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Ensure assignedTo is ObjectId
    const assignedToId = new mongoose.Types.ObjectId(assignedTo);
    report.assignedTo = assignedToId;
    report.status = "In Progress"; // Update status on assignment
    await report.save();

    // Create notification for the assigned junior staff
    const location = report.location?.locationn || "Unknown location";
    const notification = new Notification({
      userId: assignedToId,
      message: `You have been assigned a new report: ${report.problemType} at ${location}. Description: ${report.description}`,
      type: "assignment",
      relatedReportId: reportId,
    });
    await notification.save();

    res.status(200).json({ message: "Report assigned successfully", report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get assigned reports for the current user (junior staff)
export const getAssignedReports = async (req, res) => {
  try {
    const userId = req.user.id;

    const reportsConnection = await connectReportsDB();
    const Report = reportsConnection.model("Report", reportSchema);

    const assignedReports = await Report.find({ assignedTo: userId }).sort({ timestamp: -1 });
    res.status(200).json(assignedReports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
