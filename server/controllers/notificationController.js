// Import Notification model
import Notification from "../models/Notification.js";


// ======================================================
// ========== GET ALL NOTIFICATIONS FOR USER ============
// ======================================================

export const getNotificationsForUser =
  async (req, res) => {

    try {

      // ======================================================
      // ================= USER ID ============================
      // ======================================================

      const userId =
        req.user.id;


      // ======================================================
      // ============== FETCH NOTIFICATIONS ===================
      // ======================================================

      const notifications =
        await Notification.find({

          userId,
        })

        .sort({

          createdAt: -1,
        })

        .populate(

          "relatedReportId",

          `
          problemType
          description
          location
          status
          priority
          department
          imageBase64
          assignedStaffName
          createdAt
          `
        )

        .populate(

          "senderId",

          `
          name
          email
          role
          department
          `
        );


      // ======================================================
      // ================= RESPONSE ===========================
      // ======================================================

      res.status(200).json({

        success: true,

        notifications,
      });

    } catch (error) {

      console.error(

        "❌ Get Notifications Error:",

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
// ========== MARK SINGLE NOTIFICATION READ =============
// ======================================================

export const markNotificationAsRead =
  async (req, res) => {

    try {

      // ======================================================
      // ================= GET PARAMS =========================
      // ======================================================

      const { id } =
        req.params;

      const userId =
        req.user.id;


      // ======================================================
      // ================= UPDATE =============================
      // ======================================================

      const notification =
        await Notification.findOneAndUpdate(

          {

            _id: id,

            userId,
          },

          {

            isRead: true,
          },

          {

            new: true,
          }
        );


      // ======================================================
      // ================= NOT FOUND ==========================
      // ======================================================

      if (!notification) {

        return res.status(404)
        .json({

          success: false,

          message:
            "Notification not found",
        });
      }


      // ======================================================
      // ================= RESPONSE ===========================
      // ======================================================

      res.status(200).json({

        success: true,

        notification,
      });

    } catch (error) {

      console.error(

        "❌ Mark Notification Read Error:",

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
// ========== MARK ALL NOTIFICATIONS READ ===============
// ======================================================

export const markAllNotificationsAsRead =
  async (req, res) => {

    try {

      // ======================================================
      // ================= USER ID ============================
      // ======================================================

      const userId =
        req.user.id;


      // ======================================================
      // ================= UPDATE MANY ========================
      // ======================================================

      await Notification.updateMany(

        {

          userId,

          isRead: false,
        },

        {

          isRead: true,
        }
      );


      // ======================================================
      // ================= RESPONSE ===========================
      // ======================================================

      res.status(200).json({

        success: true,

        message:
          "All notifications marked as read",
      });

    } catch (error) {

      console.error(

        "❌ Mark All Read Error:",

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
// ================= DELETE NOTIFICATION =================
// ======================================================

export const deleteNotification =
  async (req, res) => {

    try {

      // ======================================================
      // ================= PARAMS =============================
      // ======================================================

      const { id } =
        req.params;

      const userId =
        req.user.id;


      // ======================================================
      // ================= DELETE =============================
      // ======================================================

      const notification =
        await Notification.findOneAndDelete({

          _id: id,

          userId,
        });


      // ======================================================
      // ================= NOT FOUND ==========================
      // ======================================================

      if (!notification) {

        return res.status(404)
        .json({

          success: false,

          message:
            "Notification not found",
        });
      }


      // ======================================================
      // ================= RESPONSE ===========================
      // ======================================================

      res.status(200).json({

        success: true,

        message:
          "Notification deleted",
      });

    } catch (error) {

      console.error(

        "❌ Delete Notification Error:",

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
// ========== GET UNREAD NOTIFICATION COUNT =============
// ======================================================

export const getUnreadNotificationCount =
  async (req, res) => {

    try {

      // ======================================================
      // ================= USER ID ============================
      // ======================================================

      const userId =
        req.user.id;


      // ======================================================
      // ================= COUNT ==============================
      // ======================================================

      const count =
        await Notification.countDocuments({

          userId,

          isRead: false,
        });


      // ======================================================
      // ================= RESPONSE ===========================
      // ======================================================

      res.status(200).json({

        success: true,

        count,
      });

    } catch (error) {

      console.error(

        "❌ Unread Count Error:",

        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };