import Report from "../models/report.js";
import User from "../models/User.js";


export const createReport = async (req, res) => {
  try {
    const report = await Report.create({
      // ================= REPORT ID =================

      reportId: `NS-${Date.now()}`,

      // ================= BASIC DETAILS =================

      problemType: req.body.problemType,

      description: req.body.description,

      city: req.body.city,

      department: req.body.department,

      priority: req.body.priority || "Normal",

      // ================= CITIZEN DETAILS =================

      citizenName: req.body.citizenName || "",

      citizenContact: req.body.citizenContact || "",

      // ================= ISSUE IMAGE =================

      image: req.file?.path || "",

      // ================= LOCATION =================

      location: {
        latitude: req.body.latitude || 0,

        longitude: req.body.longitude || 0,

        locationName: req.body.locationName || "",
      },

      // ================= USER =================

      userId: req.user?._id || null,
    });

    res.status(201).json({
      success: true,

      report,
    });
  } catch (error) {
    console.error("❌ Create Report Error:", error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const getReports = async (req, res) => {
  try {
    let query = {};

    // ======================================================
    // HIGHER AUTHORITY
    // ======================================================

    if (
      req.user.role === "Higher Authority" ||
      req.user.role === "Admin" ||
      req.user.role === "Super Admin"
    ) {
      query = {};
    }

    // ======================================================
    // STAFF + JUNIOR STAFF
    // SAME CITY + SAME DEPARTMENT
    // ======================================================
    else if (req.user.role === "Staff" || req.user.role === "Junior Staff") {
      query = {
        city: {
          $regex: new RegExp(`^${req.user.city}$`, "i"),
        },

        department: {
          $regex: new RegExp(`^${req.user.department}$`, "i"),
        },
      };
    }

    // ======================================================
    // FIND REPORTS
    // ======================================================

    const reports = await Report.find(query)

      .populate("assignedTo", "name email department role city profileImage")

      .populate("userId", "name email")

      .populate("assignedBy", "name email role")

      .sort({
        createdAt: -1,
      });


    // ======================================================
    // RESPONSE
    // ======================================================

    res.status(200).json({
      success: true,

      reports,
    });
  } catch (error) {
    console.error("❌ Get Reports Error:", error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const getDepartmentReports = async (req, res) => {
  try {
    const department = decodeURIComponent(req.params.department);

    const reports = await Report.find({
      department,

      city: req.user.city,
    })

      .populate("assignedTo", "name email department role city profileImage")

      .populate("userId", "name email")

      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,

      reports,
    });
  } catch (error) {
    console.error("❌ Department Reports Error:", error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const assignReport = async (req, res) => {
  try {
    // ======================================================
    // ================= ONLY STAFF CAN ASSIGN ==============
    // ======================================================

    if (req.user.role !== "Staff") {
      return res.status(403).json({
        success: false,

        message: "Only Staff can assign reports",
      });
    }

    const { reportId, assignedTo } = req.body;

    // ======================================================
    // ================= FIND REPORT ========================
    // ======================================================

    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({
        success: false,

        message: "Report not found",
      });
    }

    // ======================================================
    // ================= ONLY PENDING =======================
    // ======================================================

    if (report.status !== "Pending") {
      return res.status(400).json({
        success: false,

        message: "Only pending reports can be assigned",
      });
    }

    // ======================================================
    // ================= SAME CITY CHECK ====================
    // ======================================================

    if (report.city !== req.user.city) {
      return res.status(403).json({
        success: false,

        message: "Cannot assign reports outside your city",
      });
    }

    // ======================================================
    // ================= SAME DEPARTMENT CHECK ==============
    // ======================================================

    if (report.department !== req.user.department) {
      return res.status(403).json({
        success: false,

        message: "Cannot assign reports outside your department",
      });
    }

    // ======================================================
    // ================= FIND JUNIOR STAFF ==================
    // ======================================================

    const juniorStaff = await User.findById(assignedTo);

    if (!juniorStaff) {
      return res.status(404).json({
        success: false,

        message: "Junior staff not found",
      });
    }

    // ======================================================
    // ================= ONLY JUNIOR STAFF ==================
    // ======================================================

    if (juniorStaff.role !== "Junior Staff") {
      return res.status(403).json({
        success: false,

        message: "Task can only be assigned to Junior Staff",
      });
    }

    // ======================================================
    // ================= SAME CITY + DEPARTMENT ============
    // ======================================================

    if (
      juniorStaff.department !== req.user.department ||
      juniorStaff.city !== req.user.city
    ) {
      return res.status(403).json({
        success: false,

        message: "Cannot assign outside department or city",
      });
    }

    // ======================================================
    // ================= ASSIGN TASK ========================
    // ======================================================

    report.assignedTo = juniorStaff._id;

    report.assignedBy = req.user._id;

    report.assignedByName = req.user.name;

    report.assignedAt = new Date();

    report.assignedToName = juniorStaff.name;

    report.assignedToDepartment = juniorStaff.department;

    report.status = "Staff Assigned";

    // ======================================================
    // ================= SAVE REPORT ========================
    // ======================================================

    await report.save();

    // ======================================================
    // ================= RESPONSE ===========================
    // ======================================================

    res.status(200).json({
      success: true,

      message: "Task assigned successfully",

      report,
    });
  } catch (error) {
    console.error("❌ Assign Report Error:", error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const getAssignedReports = async (req, res) => {
  try {
    const reports = await Report.find({
      assignedTo: req.user._id,
    })

      .populate("assignedTo", "name email department role city profileImage")

      .populate("userId", "name email")

      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,

      reports,
    });
  } catch (error) {
    console.error("❌ Assigned Reports Error:", error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const respondToTask = async (req, res) => {
  try {
    const { reportId, action } = req.body;

    // ================= VALIDATE ACTION =================

    if (action !== "accept" && action !== "decline") {
      return res.status(400).json({
        success: false,

        message: "Invalid action",
      });
    }

    // ================= FIND REPORT =================

    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({
        success: false,

        message: "Report not found",
      });
    }

    // ================= VERIFY ASSIGNED USER =================

    const assignedUserId = report.assignedTo?._id
      ? report.assignedTo._id.toString()
      : report.assignedTo?.toString();

    if (assignedUserId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,

        message: "Unauthorized action",
      });
    }

    // ================= ACCEPT TASK =================

    if (action === "accept") {
      report.status = "In Progress";

      report.acceptedAt = new Date();

      report.declinedAt = null;

      report.declinedReason = "";
    }

    // ================= DECLINE TASK =================

    if (action === "decline") {
      report.status = "Pending";

      report.assignedTo = null;

      report.assignedToName = "";

      report.assignedToDepartment = "";

      // ================= RESET ASSIGNMENT DETAILS =================

      report.assignedBy = null;

      report.assignedByName = "";

      report.assignedAt = null;

      report.acceptedAt = null;

      report.declinedAt = new Date();

      report.declinedReason = "Task declined by Junior Staff";
    }

    // ================= SAVE REPORT =================

    await report.save();

    // ================= RESPONSE =================

    res.status(200).json({
      success: true,

      message: `Task ${action}ed successfully`,

      report,
    });
  } catch (error) {
    console.error("❌ Respond Task Error:", error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const getAssignedTasks = async (req, res) => {
  try {
    const reports = await Report.find({
      assignedTo: req.user._id,
    })

      .populate("assignedTo", "name email department role city profileImage")

      .populate("userId", "name email")

      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,

      reports,
    });
  } catch (error) {
    console.error("❌ Get Assigned Tasks Error:", error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const updateTaskProgress = async (req, res) => {
  try {
    const { reportId, action, description } = req.body;

    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({
        success: false,

        message: "Report not found",
      });
    }

    const assignedUserId = report.assignedTo?._id
      ? report.assignedTo._id.toString()
      : report.assignedTo?.toString();

    if (assignedUserId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,

        message: "Unauthorized",
      });
    }

    if (report.status !== "In Progress") {
      return res.status(400).json({
        success: false,

        message: "Task is not in progress",
      });
    }

    const resolvedImage = req.files?.resolvedImage?.[0]?.path || "";

    const unableImage = req.files?.unableImage?.[0]?.path || "";

    if (action === "resolved") {
      report.status = "Pending Approval";

      report.resolvedDescription = description;

      report.resolvedImage = resolvedImage;

      report.submittedForApprovalAt = new Date();
    }

    if (action === "unable") {
      report.status = "Unable To Complete";

      report.unableReason = description;

      report.unableImage = unableImage;

      report.unableAt = new Date();
    }

    await report.save();

    res.status(200).json({
      success: true,

      message: "Task updated successfully",

      report,
    });
  } catch (error) {
    console.error("❌ Update Task Progress Error:", error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const verifyTaskResolution = async (req, res) => {
  // ======================================================
  // ONLY STAFF CAN VERIFY
  // ======================================================

  if (req.user.role !== "Staff") {
    return res.status(403).json({
      success: false,

      message: "Only Staff can verify tasks",
    });
  }

  try {
    const { reportId, action } = req.body;

    // ======================================================
    // FIND REPORT
    // ======================================================

    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({
        success: false,

        message: "Report not found",
      });
    }

    // ======================================================
    // APPROVE RESOLUTION
    // ======================================================

    if (action === "approve") {
      report.status = "Resolved";

      report.resolvedAt = new Date();

      report.verifiedBy = req.user._id;

      report.verifiedAt = new Date();
    }

    // ======================================================
    // REJECT RESOLUTION
    // ======================================================

    if (action === "reject") {
      report.status = "In Progress";
    }

    // ======================================================
    // REASSIGN SAME JUNIOR STAFF
    // ======================================================

    if (action === "reassign") {
      report.status = "Staff Assigned";

      // clear unable data

      report.unableAt = null;

      report.unableReason = "";

      report.unableImage = "";

      // reset accept/decline

      report.acceptedAt = null;

      report.declinedAt = null;

      report.declinedReason = "";
    }

    // ======================================================
    // MOVE ISSUE BACK TO PENDING
    // ======================================================

    if (action === "move-to-pending") {
      report.status = "Pending";

      // remove assignment

      report.assignedTo = null;

      report.assignedToName = "";

      report.assignedToDepartment = "";

      report.assignedBy = null;

      report.assignedByName = "";

      report.assignedAt = null;

      report.acceptedAt = null;

      // clear unable data

      report.unableAt = null;

      report.unableReason = "";

      report.unableImage = "";

      report.declinedAt = null;

      report.declinedReason = "";
    }

    // ======================================================
    // SAVE REPORT
    // ======================================================

    await report.save();

    // ======================================================
    // RESPONSE
    // ======================================================

    res.status(200).json({
      success: true,

      message: `Task ${action} completed successfully`,

      report,
    });
  } catch (error) {
    console.error("❌ Verify Resolution Error:", error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const getStaffAssignedTasks = async (req, res) => {
  try {
    const reports = await Report.find({
      assignedBy: req.user._id,
    })

      .populate("assignedTo", "name email role department city profileImage")

      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,

      reports,
    });
  } catch (error) {
    console.error("❌ Get Staff Tasks Error:", error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const getAnalyticsData = async (req, res) => {
  try {
    // ======================================================
    // TOTAL REPORTS
    // ======================================================

    const totalReports = await Report.countDocuments();

    // ======================================================
    // RESOLVED REPORTS
    // ======================================================

    const resolvedReports = await Report.countDocuments({
      status: "Resolved",
    });

    // ======================================================
    // PENDING REPORTS
    // ======================================================

    const pendingReports = await Report.countDocuments({
      status: {
        $in: ["Pending", "Staff Assigned", "In Progress", "Pending Approval"],
      },
    });

    // ======================================================
    // HIGH PRIORITY
    // ======================================================

    const highPriority = await Report.countDocuments({
      priority: "High",
    });

    // ======================================================
    // STATUS DISTRIBUTION
    // ======================================================

    const issueStatusData = await Report.aggregate([
      {
        $group: {
          _id: "$status",

          value: {
            $sum: 1,
          },
        },
      },

      {
        $project: {
          _id: 0,

          name: "$_id",

          value: 1,
        },
      },
    ]);

    // ======================================================
    // DEPARTMENT ANALYTICS
    // ======================================================

    const departmentData = await Report.aggregate([
      {
        $group: {
          _id: "$department",

          Resolved: {
            $sum: {
              $cond: [
                {
                  $eq: ["$status", "Resolved"],
                },

                1,

                0,
              ],
            },
          },

          Pending: {
            $sum: {
              $cond: [
                {
                  $in: [
                    "$status",

                    ["Pending", "Staff Assigned", "Pending Approval"],
                  ],
                },

                1,

                0,
              ],
            },
          },

          InProgress: {
            $sum: {
              $cond: [
                {
                  $eq: ["$status", "In Progress"],
                },

                1,

                0,
              ],
            },
          },
        },
      },

      {
        $project: {
          _id: 0,

          department: "$_id",

          Resolved: 1,

          Pending: 1,

          InProgress: 1,
        },
      },
    ]);

    // ======================================================
    // MONTHLY REPORT TREND
    // ======================================================

    const monthlyReports = await Report.aggregate([
      {
        $group: {
          _id: {
            month: {
              $month: "$createdAt",
            },
          },

          reports: {
            $sum: 1,
          },

          high: {
            $sum: {
              $cond: [
                {
                  $eq: ["$priority", "High"],
                },

                1,

                0,
              ],
            },
          },
        },
      },

      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);

    const monthNames = [
      "",

      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const issueTrendData = monthlyReports.map((item) => ({
      month: monthNames[item._id.month],

      reports: item.reports,

      high: item.high,
    }));

    // ======================================================
    // FINAL RESPONSE
    // ======================================================

    res.status(200).json({
      success: true,

      analytics: {
        totalReports,

        resolvedReports,

        pendingReports,

        highPriority,

        issueStatusData,

        departmentData,

        issueTrendData,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,

      message: "Failed to fetch analytics",
    });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const user = req.user;

    let filter = {};

    // =====================================
    // HIGHER AUTHORITY
    // =====================================

    if (user.role === "Higher Authority") {
      filter = {};
    }

    // =====================================
    // STAFF / JUNIOR STAFF
    // =====================================
    else {
      filter = {
        city: user.city,

        department: user.department,
      };
    }

    // =====================================
    // COUNTS
    // =====================================
    const totalDepartments = await User.distinct("department");
    const totalIssues = await Report.countDocuments(filter);

    const resolved = await Report.countDocuments({
      ...filter,

      status: "Resolved",
    });

    const pending = await Report.countDocuments({
      ...filter,

      status: {
        $ne: "Resolved",
      },
    });

    const departments = await Report.distinct("department", filter);

    res.status(200).json({
      totalIssues,

      resolved,

      pending,

      departments: totalDepartments.length,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch dashboard stats",
    });
  }
};