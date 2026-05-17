import Report from "../models/report.js";

import User from "../models/User.js";

import Notification from "../models/Notification.js";


// ======================================================
// ================= CREATE REPORT ======================
// ======================================================

export const createReport =
  async (req, res) => {

    try {

      const report =
        await Report.create({

          ...req.body,

          userId:
            req.user?._id || null,
        });


      res.status(201).json({

        success: true,

        report,
      });

    } catch (error) {

      console.error(
        "❌ Create Report Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };



// ======================================================
// ==================== GET REPORTS =====================
// ======================================================

export const getReports =
  async (req, res) => {

    try {

      const reports =
        await Report.find()

        .populate(
          "assignedTo",
          "name email department role"
        )

        .populate(
          "userId",
          "name email department"
        )

        .sort({
          createdAt: -1,
        });


      res.status(200).json({

        success: true,

        reports,
      });

    } catch (error) {

      console.error(
        "❌ Get Reports Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };



// ======================================================
// =========== GET REPORTS BY DEPARTMENT ================
// ======================================================

export const getDepartmentReports =
  async (req, res) => {

    try {

      const department =
        decodeURIComponent(
          req.params.department
        );


      const reports =
        await Report.find({

          department,

        })

        .populate(
          "assignedTo",
          "name email department role"
        )

        .populate(
          "userId",
          "name email department"
        )

        .sort({

          createdAt: -1,
        });


      res.status(200).json({

        success: true,

        reports,
      });

    } catch (error) {

      console.error(
        "❌ Department Reports Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };



// ======================================================
// =================== ASSIGN REPORT ====================
// ======================================================

export const assignReport =
  async (req, res) => {

    try {

      const {

        reportId,

        assignedTo,

      } = req.body;


      // ======================================================
      // ================= FIND REPORT ========================
      // ======================================================

      const report =
        await Report.findById(
          reportId
        );


      if (!report) {

        return res.status(404)
        .json({

          success: false,

          message:
            "Report not found",
        });
      }


      // ======================================================
      // ========== PREVENT REASSIGNING =======================
      // ======================================================

      if (
        report.status !== "Pending"
      ) {

        return res.status(400)
        .json({

          success: false,

          message:
            "Only pending reports can be assigned",
        });
      }


      // ======================================================
      // ================= FIND JUNIOR STAFF ==================
      // ======================================================

      const juniorStaff =
        await User.findById(
          assignedTo
        );


      if (!juniorStaff) {

        return res.status(404)
        .json({

          success: false,

          message:
            "Junior staff not found",
        });
      }


      // ======================================================
      // ========== SAME DEPARTMENT VALIDATION ================
      // ======================================================

      if (

        juniorStaff.department !==
        req.user.department

      ) {

        return res.status(403)
        .json({

          success: false,

          message:
            "Cannot assign outside department",
        });
      }


      // ======================================================
      // ================= ASSIGN TASK ========================
      // ======================================================

      report.assignedTo =
  juniorStaff._id;


// ======================================================
// ================= ASSIGNED BY ========================
// ======================================================

report.assignedBy =
  req.user._id;


// ======================================================
// ================= ASSIGNED AT ========================
// ======================================================

report.assignedAt =
  new Date();


// ======================================================
// =========== ASSIGNED STAFF DETAILS ===================
// ======================================================

report.assignedStaffName =
  juniorStaff.name;


report.assignedStaffEmail =
  juniorStaff.email;


report.assignedDepartment =
  juniorStaff.department;


// ======================================================
// ================= STATUS =============================
// ======================================================

report.status =
  "Staff Assigned";


      await report.save();


      // ======================================================
      // ================= CREATE NOTIFICATION ================
      // ======================================================

      await Notification.create({

        userId:
          juniorStaff._id,

        senderId:
          req.user._id,

        message:
          `New task assigned: ${report.problemType}`,

        type:
          "assignment",

        requiresAction:
          true,

        relatedReportId:
          report._id,
      });


      // ======================================================
      // ================= RESPONSE ===========================
      // ======================================================

      res.status(200).json({

        success: true,

        message:
          "Task assigned successfully",

        report,
      });

    } catch (error) {

      console.error(
        "❌ Assign Report Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };



// ======================================================
// ============== GET ASSIGNED REPORTS ==================
// ======================================================

export const getAssignedReports =
  async (req, res) => {

    try {

      const reports =
        await Report.find({

          assignedTo:
            req.user._id,

        })

        .populate(
          "assignedTo",
          "name email department role"
        )

        .populate(
          "userId",
          "name email department"
        )

        .sort({

          createdAt: -1,
        });


      res.status(200).json({

        success: true,

        reports,
      });

    } catch (error) {

      console.error(
        "❌ Assigned Reports Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };



// ======================================================
// =========== ACCEPT / DECLINE TASK ====================
// ======================================================

// ======================================================
// =========== ACCEPT / DECLINE TASK ====================
// ======================================================




// ======================================================
// =========== ACCEPT / DECLINE TASK ====================
// ======================================================

export const respondToTask =
  async (req, res) => {

    try {

      // ======================================================
      // ================= REQUEST DATA =======================
      // ======================================================

      const {

        reportId,

        action,

      } = req.body;


      // ======================================================
      // ================= VALIDATE ACTION ====================
      // ======================================================

      if (

        action !== "accept" &&

        action !== "decline"

      ) {

        return res.status(400)
        .json({

          success: false,

          message:
            "Invalid action",
        });
      }


      // ======================================================
      // ================= FIND REPORT ========================
      // ======================================================

      const report =
        await Report.findById(
          reportId
        );


      // ======================================================
      // ================= REPORT NOT FOUND ===================
      // ======================================================

      if (!report) {

        return res.status(404)
        .json({

          success: false,

          message:
            "Report not found",
        });
      }


      // ======================================================
      // ================= SECURITY CHECK =====================
      // ======================================================

      if (!report.assignedTo) {

        return res.status(403)
        .json({

          success: false,

          message:
            "No assigned staff found",
        });
      }


      // ======================================================
      // ===== HANDLE OBJECTID OR POPULATED OBJECT SAFELY =====
      // ======================================================

      const assignedUserId =

        report.assignedTo._id

          ? report.assignedTo._id.toString()

          : report.assignedTo.toString();


      // ======================================================
      // ================= AUTHORIZE USER =====================
      // ======================================================

      if (

        assignedUserId !==
        req.user._id.toString()

      ) {

        return res.status(403)
        .json({

          success: false,

          message:
            "Unauthorized action",
        });
      }


      // ======================================================
      // ================= ACCEPT TASK ========================
      // ======================================================

      if (
        action === "accept"
      ) {

        report.status =
          "In Progress";


        report.acceptedAt =
          new Date();


          report.declinedAt = null;

report.declinedReason = "";

        // ======================================================
        // =========== CREATE ACCEPT NOTIFICATION ==============
        // ======================================================

        if (report.userId) {

          await Notification.create({

            userId:
              report.userId,

            senderId:
              req.user._id,

            message:
              `${req.user.name} accepted the task: ${report.problemType}`,

            type:
              "accepted",

            relatedReportId:
              report._id,
          });
        }
      }


      // ======================================================
      // ================= DECLINE TASK =======================
      // ======================================================

      if (
        action === "decline"
      ) {

        report.status =
          "Pending";


        report.assignedTo =
          null;

        report.assignedStaffName =
          "";

        report.assignedStaffEmail =
          "";

        report.assignedDepartment =
          "";

        report.acceptedAt =
          null;
// ======================================================
// ================= DECLINED AT ========================
// ======================================================

report.declinedAt =
  new Date();


// ======================================================
// ================= DECLINE REASON =====================
// ======================================================

report.declinedReason =
  "Task declined by Junior Staff";

        // ======================================================
        // =========== CREATE DECLINE NOTIFICATION =============
        // ======================================================

        if (report.userId) {

          await Notification.create({

            userId:
              report.userId,

            senderId:
              req.user._id,

            message:
              `${req.user.name} declined the task: ${report.problemType}`,

            type:
              "declined",

            relatedReportId:
              report._id,
          });
        }
      }


      // ======================================================
      // ================= SAVE REPORT ========================
      // ======================================================

      await report.save();


      // ======================================================
      // ================= RESPONSE ===========================
      // ======================================================

      res.status(200).json({

        success: true,

        message:
          `Task ${action}ed successfully`,

        report,
      });

    } catch (error) {

      // ======================================================
      // ================= ERROR LOGGING ======================
      // ======================================================

      console.error(
        "❌ Respond Task Error:",
        error.message
      );

      console.error(error);


      // ======================================================
      // ================= SERVER RESPONSE ====================
      // ======================================================

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
};



  // ======================================================
// ============= GET MY ASSIGNED TASKS ==================
// ======================================================

export const getAssignedTasks =
  async (req, res) => {

    try {

      const reports =
        await Report.find({

          assignedTo:
            req.user._id,

        })

        .populate(
          "assignedTo",
          "name email department role"
        )

        .populate(
          "userId",
          "name email department"
        )

        .sort({
          createdAt: -1,
        });


      res.status(200).json({

        success: true,

        reports,
      });

    } catch (error) {

      console.error(
        "❌ Get Assigned Tasks Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
};


// ======================================================
// ===== MARK TASK RESOLVED / UNABLE TO COMPLETE ========
// ======================================================


// ======================================================
// ===== MARK TASK RESOLVED / UNABLE TO COMPLETE ========
// ======================================================

export const updateTaskProgress =
  async (req, res) => {

    try {

      // ======================================================
      // ================= REQUEST DATA =======================
      // ======================================================

      const {

        reportId,
        action,
        description,
        imageBase64,

      } = req.body;


      // ======================================================
      // ================= FIND REPORT ========================
      // ======================================================

      const report =
        await Report.findById(
          reportId
        );


      // ======================================================
      // ================= REPORT NOT FOUND ===================
      // ======================================================

      if (!report) {

        return res.status(404)
        .json({

          success: false,

          message:
            "Report not found",
        });
      }


      // ======================================================
      // ===== HANDLE OBJECTID OR POPULATED OBJECT SAFELY =====
      // ======================================================

      const assignedUserId =

        report.assignedTo?._id

          ? report.assignedTo._id.toString()

          : report.assignedTo?.toString();


      // ======================================================
      // ================= AUTHORIZE USER =====================
      // ======================================================

      if (

        assignedUserId !==
        req.user._id.toString()

      ) {

        return res.status(403)
        .json({

          success: false,

          message:
            "Unauthorized",
        });
      }


      // ======================================================
      // ================= STATUS VALIDATION ==================
      // ======================================================

      if (
        report.status !==
        "In Progress"
      ) {

        return res.status(400)
        .json({

          success: false,

          message:
            "Task is not in progress",
        });
      }


      // ======================================================
      // ================= MARK RESOLVED ======================
      // ======================================================

      if (
        action === "resolved"
      ) {

        report.status =
          "Pending Approval";


        report.resolvedDescription =
          description;


        report.resolvedImageBase64 =
          imageBase64;


        report.submittedForApprovalAt =
          new Date();
      }


      // ======================================================
      // ============= UNABLE TO COMPLETE =====================
      // ======================================================

      if (
        action === "unable"
      ) {

        report.status =
          "Unable To Complete";


        report.unableReason =
          description;


        report.unableImageBase64 =
          imageBase64;


        report.unableAt =
          new Date();
      }


      // ======================================================
      // ================= SAVE REPORT ========================
      // ======================================================

      await report.save();


      // ======================================================
      // ================= NOTIFICATION =======================
      // ======================================================

      if (report.assignedBy) {

        await Notification.create({

          userId:
            report.assignedBy,

          senderId:
            req.user._id,

          relatedReportId:
            report._id,

          type:
            action === "resolved"
              ? "resolved"
              : "alert",

          message:

            action === "resolved"

              ? `${req.user.name} submitted task for approval`

              : `${req.user.name} marked task as unable to complete`,
        });
      }


      // ======================================================
      // ================= RESPONSE ===========================
      // ======================================================

      res.status(200).json({

        success: true,

        message:
          "Task updated successfully",

        report,
      });

    } catch (error) {

      console.error(
        "❌ Update Task Progress Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };






  // ======================================================
// ============== VERIFY TASK RESOLUTION ================
// ======================================================

export const verifyTaskResolution =
  async (req, res) => {

    try {

      // ======================================================
      // ================= REQUEST DATA =======================
      // ======================================================

      const {

        reportId,

        action,

      } = req.body;


      // ======================================================
      // ================= FIND REPORT ========================
      // ======================================================

      const report =
        await Report.findById(
          reportId
        );


      if (!report) {

        return res.status(404)
        .json({

          success: false,

          message:
            "Report not found",
        });
      }


      // ======================================================
      // ================= APPROVE ============================
      // ======================================================

      if (
        action === "approve"
      ) {

        report.status =
          "Resolved";


        report.resolvedAt =
          new Date();


        report.verifiedBy =
          req.user._id;


        report.verifiedAt =
          new Date();
      }


      // ======================================================
      // ================= REJECT =============================
      // ======================================================

      if (
        action === "reject"
      ) {

        report.status =
          "In Progress";
      }


      // ======================================================
      // ================= SAVE REPORT ========================
      // ======================================================

      await report.save();


      // ======================================================
      // ================= NOTIFICATION =======================
      // ======================================================

      if (report.assignedTo) {

        await Notification.create({

          userId:
            report.assignedTo,

          senderId:
            req.user._id,

          relatedReportId:
            report._id,

          type:
            action === "approve"
              ? "resolved"
              : "alert",

          message:

            action === "approve"

              ? "Task resolution approved"

              : "Task resolution rejected",
        });
      }


      // ======================================================
      // ================= RESPONSE ===========================
      // ======================================================

      res.status(200).json({

        success: true,

        message:
          `Task ${action}d successfully`,

        report,
      });

    } catch (error) {

      console.error(
        "❌ Verify Resolution Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };


  // ======================================================
// ======== GET STAFF ASSIGNED TASKS ====================
// ======================================================

export const getStaffAssignedTasks =
  async (req, res) => {

    try {

      const reports =
        await Report.find({

          assignedBy:
            req.user._id,

        })

        .populate(

          "assignedTo",

          "name email role department"
        )

        .sort({

          createdAt: -1,
        });


      res.status(200).json({

        success: true,

        reports,
      });

    } catch (error) {

      console.error(
        "❌ Get Staff Tasks Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };


