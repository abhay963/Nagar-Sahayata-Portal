import Report from "../models/report.js";
import User from "../models/User.js";


export const createReport = async (req, res) => {
  try {
    const report = await Report.create({
      reportId: `NS-${Date.now()}`,

      problemType: req.body.problemType,
      description: req.body.description,
      city: req.body.city,
      department: req.body.department,
      priority: req.body.priority || "Normal",

      citizenName: req.body.citizenName || "",
      citizenContact: req.body.citizenContact || "",

      image: req.file?.path || "",

      location: {
        latitude: req.body.latitude || 0,
        longitude: req.body.longitude || 0,
        locationName: req.body.locationName || "",
      },

      userId: req.user?._id || null,
    });

    res.status(201).json({
      success: true,
      message: "Report created successfully",
      report,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getReports = async (req, res) => {
  try {
    let filter = {};

    if (
      req.user.role === "Staff" ||
      req.user.role === "Junior Staff"
    ) {
      filter = {
        city: {
          $regex: new RegExp(`^${req.user.city}$`, "i"),
        },
        department: {
          $regex: new RegExp(`^${req.user.department}$`, "i"),
        },
      };
    }

    const reports = await Report.find(filter)
      .populate(
        "assignedTo",
        "name email department role city profileImage"
      )
      .populate(
        "userId",
        "name email"
      )
      .populate(
        "assignedBy",
        "name email role"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      reports,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getDepartmentReports = async (req, res) => {
  try {
    const { department } = req.params;

    const reports = await Report.find({
      department: decodeURIComponent(department),
      city: req.user.city,
    })
      .populate(
        "assignedTo",
        "name email department role city profileImage"
      )
      .populate(
        "userId",
        "name email"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      reports,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const assignReport = async (req, res) => {
  try {
    if (req.user.role !== "Staff") {
      return res.status(403).json({
        success: false,
        message: "Only Staff can assign reports",
      });
    }

    const { reportId, assignedTo } = req.body;

    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    if (report.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending reports can be assigned",
      });
    }

    if (report.city !== req.user.city) {
      return res.status(403).json({
        success: false,
        message: "Cannot assign reports outside your city",
      });
    }

    if (report.department !== req.user.department) {
      return res.status(403).json({
        success: false,
        message: "Cannot assign reports outside your department",
      });
    }

    const juniorStaff = await User.findById(assignedTo);

    if (!juniorStaff) {
      return res.status(404).json({
        success: false,
        message: "Junior staff not found",
      });
    }

    if (juniorStaff.role !== "Junior Staff") {
      return res.status(403).json({
        success: false,
        message: "Task can only be assigned to Junior Staff",
      });
    }

    if (
      juniorStaff.city !== req.user.city ||
      juniorStaff.department !== req.user.department
    ) {
      return res.status(403).json({
        success: false,
        message: "Cannot assign outside department or city",
      });
    }

    report.assignedTo = juniorStaff._id;
    report.assignedToName = juniorStaff.name;
    report.assignedToDepartment = juniorStaff.department;

    report.assignedBy = req.user._id;
    report.assignedByName = req.user.name;
    report.assignedAt = new Date();

    report.status = "Staff Assigned";

    await report.save();

    res.status(200).json({
      success: true,
      message: "Task assigned successfully",
      report,
    });
  } catch (error) {
    console.error(error);

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
      .populate(
        "assignedTo",
        "name email department role city profileImage"
      )
      .populate(
        "userId",
        "name email"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      reports,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const respondToTask = async (req, res) => {
  try {
    const { reportId, action } = req.body;

    if (!["accept", "decline"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid action",
      });
    }

    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    const assignedUserId = report.assignedTo?.toString();

    if (assignedUserId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized action",
      });
    }

    if (action === "accept") {
      report.status = "In Progress";
      report.acceptedAt = new Date();
      report.declinedAt = null;
      report.declinedReason = "";
    } else {
      report.status = "Pending";

      report.assignedTo = null;
      report.assignedToName = "";
      report.assignedToDepartment = "";

      report.assignedBy = null;
      report.assignedByName = "";
      report.assignedAt = null;

      report.acceptedAt = null;
      report.declinedAt = new Date();
      report.declinedReason = "Task declined by Junior Staff";
    }

    await report.save();

    res.status(200).json({
      success: true,
      message: `Task ${action}ed successfully`,
      report,
    });
  } catch (error) {
    console.error(error);

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
      .populate(
        "assignedTo",
        "name email department role city profileImage"
      )
      .populate(
        "userId",
        "name email"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      reports,
    });
  } catch (error) {
    console.error(error);

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

    if (report.assignedTo?.toString() !== req.user._id.toString()) {
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

    const resolvedImage =
      req.files?.resolvedImage?.[0]?.path || "";

    const unableImage =
      req.files?.unableImage?.[0]?.path || "";

    if (action === "resolved") {
      report.status = "Pending Approval";
      report.resolvedDescription = description;
      report.resolvedImage = resolvedImage;
      report.submittedForApprovalAt = new Date();
    } else if (action === "unable") {
      report.status = "Unable To Complete";
      report.unableReason = description;
      report.unableImage = unableImage;
      report.unableAt = new Date();
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid action",
      });
    }

    await report.save();

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      report,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};





export const verifyTaskResolution = async (req, res) => {
  try {
    if (req.user.role !== "Staff") {
      return res.status(403).json({
        success: false,
        message: "Only Staff can verify tasks",
      });
    }

    const { reportId, action } = req.body;

    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    switch (action) {
      case "approve":
        report.status = "Resolved";
        report.resolvedAt = new Date();
        report.verifiedBy = req.user._id;
        report.verifiedAt = new Date();
        break;

      case "reject":
        report.status = "In Progress";
        break;

      case "reassign":
        report.status = "Staff Assigned";

        report.unableAt = null;
        report.unableReason = "";
        report.unableImage = "";

        report.acceptedAt = null;
        report.declinedAt = null;
        report.declinedReason = "";
        break;

      case "move-to-pending":
        report.status = "Pending";

        report.assignedTo = null;
        report.assignedToName = "";
        report.assignedToDepartment = "";

        report.assignedBy = null;
        report.assignedByName = "";
        report.assignedAt = null;

        report.acceptedAt = null;

        report.unableAt = null;
        report.unableReason = "";
        report.unableImage = "";

        report.declinedAt = null;
        report.declinedReason = "";
        break;

      default:
        return res.status(400).json({
          success: false,
          message: "Invalid action",
        });
    }

    await report.save();

    res.status(200).json({
      success: true,
      message: `Task ${action} completed successfully`,
      report,
    });
  } catch (error) {
    console.error(error);

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
      .populate(
        "assignedTo",
        "name email role department city profileImage"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      reports,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getDashboardStats = async (req, res) => {
  try {
    const filter =
      req.user.role === "Higher Authority"
        ? {}
        : {
            city: req.user.city,
            department: req.user.department,
          };

    const [
      totalDepartments,
      totalIssues,
      resolved,
      pending,
    ] = await Promise.all([
      User.distinct("department"),
      Report.countDocuments(filter),
      Report.countDocuments({
        ...filter,
        status: "Resolved",
      }),
      Report.countDocuments({
        ...filter,
        status: {
          $ne: "Resolved",
        },
      }),
    ]);

    res.status(200).json({
      totalIssues,
      resolved,
      pending,
      departments: totalDepartments.length,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getAnalyticsData = async (req, res) => {
  try {
    const [
      totalReports,
      resolvedReports,
      pendingReports,
      highPriority,
      issueStatusData,
      departmentData,
      monthlyReports,
    ] = await Promise.all([
      Report.countDocuments(),

      Report.countDocuments({
        status: "Resolved",
      }),

      Report.countDocuments({
        status: {
          $in: [
            "Pending",
            "Staff Assigned",
            "In Progress",
            "Pending Approval",
          ],
        },
      }),

      Report.countDocuments({
        priority: "High",
      }),

      Report.aggregate([
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
      ]),

      Report.aggregate([
        {
          $group: {
            _id: "$department",

            Resolved: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      "$status",
                      "Resolved",
                    ],
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
                      [
                        "Pending",
                        "Staff Assigned",
                        "Pending Approval",
                      ],
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
                    $eq: [
                      "$status",
                      "In Progress",
                    ],
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
      ]),

      Report.aggregate([
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
                    $eq: [
                      "$priority",
                      "High",
                    ],
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
      ]),
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

    const issueTrendData = monthlyReports.map(
      (item) => ({
        month: monthNames[item._id.month],
        reports: item.reports,
        high: item.high,
      })
    );

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
      message: error.message,
    });
  }
};




