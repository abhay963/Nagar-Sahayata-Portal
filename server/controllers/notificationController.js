import Notification from "../models/Notification.js";

export const getNotificationsForUser =
  async (req, res) => {

    try {

      const userId =
        req.user.id;

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
          city
          location
          status
          priority
          department
          image
          assignedToName
          assignedToDepartment
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
          city
          profileImage
          `
        );

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


export const markNotificationAsRead =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const userId =
        req.user.id;

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

      if (!notification) {

        return res.status(404)
        .json({

          success: false,

          message:
            "Notification not found",
        });
      }

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


export const markAllNotificationsAsRead =
  async (req, res) => {

    try {

      const userId =
        req.user.id;

      await Notification.updateMany(

        {
          userId,
          isRead: false,
        },

        {
          isRead: true,
        }
      );

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


export const deleteNotification =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const userId =
        req.user.id;

      const notification =
        await Notification.findOneAndDelete({

          _id: id,

          userId,
        });

      if (!notification) {

        return res.status(404)
        .json({

          success: false,

          message:
            "Notification not found",
        });
      }

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


export const getUnreadNotificationCount =
  async (req, res) => {

    try {

      const userId =
        req.user.id;

      const count =
        await Notification.countDocuments({

          userId,

          isRead: false,
        });

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



  export const clearAllNotifications =
  async (req, res) => {

    try {

      const userId =
        req.user.id;

      await Notification.deleteMany({

        userId,
      });

      res.status(200).json({

        success: true,

        message:
          "All notifications cleared",
      });

    } catch (error) {

      console.error(
        "❌ Clear All Notifications Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };