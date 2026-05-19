import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reportId: {
      type: String,
      unique: true,
      default: "",
    },

    problemType: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    priority: {
      type: String,

      enum: [
        "Normal",
        "Medium",
        "High",
        "Critical",
      ],

      default: "Normal",
    },

    status: {
      type: String,

      enum: [
        "Pending",
        "Staff Assigned",
        "In Progress",
        "Pending Approval",
        "Unable To Complete",
        "Resolved",
      ],

      default: "Pending",
    },

    citizenName: {
      type: String,
      default: "",
      trim: true,
    },

    citizenContact: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      latitude: {
        type: Number,
        default: 0,
      },

      longitude: {
        type: Number,
        default: 0,
      },

      locationName: {
        type: String,
        default: "",
      },
    },

    image: {
      type: String,
      default: "",
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    assignedToName: {
      type: String,
      default: "",
    },

    assignedToDepartment: {
      type: String,
      default: "",
    },

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    assignedByName: {
      type: String,
      default: "",
    },

    assignedAt: {
      type: Date,
      default: null,
    },

    acceptedAt: {
      type: Date,
      default: null,
    },

    declinedAt: {
      type: Date,
      default: null,
    },

    declinedReason: {
      type: String,
      default: "",
    },

    resolvedAt: {
      type: Date,
      default: null,
    },

    resolvedDescription: {
      type: String,
      default: "",
    },

    resolvedImage: {
      type: String,
      default: "",
    },

    submittedForApprovalAt: {
      type: Date,
      default: null,
    },

    unableReason: {
      type: String,
      default: "",
    },

    unableImage: {
      type: String,
      default: "",
    },

    unableAt: {
      type: Date,
      default: null,
    },

    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Report",
  reportSchema
);