import React, {
  useState,
  useEffect,
  useContext,
} from "react";

import axios from "../api/axios";

import AuthContext
from "../context/AuthContext";



// ======================================================
// ========== FULLSCREEN IMAGE MODAL ====================
// ======================================================

const FullscreenImageModal = ({
  image,
  onClose,
}) => {

  const [scale, setScale] =
    useState(1);

  const [position, setPosition] =
    useState({
      x: 0,
      y: 0,
    });

  const [isDragging, setIsDragging] =
    useState(false);

  const [startDrag, setStartDrag] =
    useState({
      x: 0,
      y: 0,
    });



  // ======================================================
  // ================= RESET IMAGE ========================
  // ======================================================

  useEffect(() => {

    setScale(1);

    setPosition({
      x: 0,
      y: 0,
    });

  }, [image]);



  // ======================================================
  // ================= HANDLE ZOOM ========================
  // ======================================================

  const handleWheel = (e) => {

    e.preventDefault();

    const zoomSpeed = 0.1;

    setScale((prevScale) => {

      let newScale =
        prevScale +
        (e.deltaY < 0
          ? zoomSpeed
          : -zoomSpeed);

      return Math.min(
        Math.max(newScale, 1),
        5
      );
    });
  };



  // ======================================================
  // ================= START DRAG =========================
  // ======================================================

  const handleMouseDown = (e) => {

    if (scale > 1) {

      setIsDragging(true);

      setStartDrag({

        x:
          e.clientX -
          position.x,

        y:
          e.clientY -
          position.y,
      });
    }
  };



  // ======================================================
  // ================= HANDLE DRAG ========================
  // ======================================================

  const handleMouseMove = (e) => {

    if (isDragging) {

      setPosition({

        x:
          e.clientX -
          startDrag.x,

        y:
          e.clientY -
          startDrag.y,
      });
    }
  };



  // ======================================================
  // ================= STOP DRAG ==========================
  // ======================================================

  const handleMouseUp = () => {

    setIsDragging(false);
  };



  // ======================================================
  // ================= RESET POSITION =====================
  // ======================================================

  const handleDoubleClick = () => {

    setScale(1);

    setPosition({
      x: 0,
      y: 0,
    });
  };



  // ======================================================
  // ======================= UI ===========================
  // ======================================================

  return (

    <div

      className="
        fixed
        inset-0
        bg-black
        bg-opacity-80
        flex
        items-center
        justify-center
        z-50
      "

      onWheel={handleWheel}

      onMouseMove={handleMouseMove}

      onMouseUp={handleMouseUp}

      onMouseLeave={handleMouseUp}

      onDoubleClick={handleDoubleClick}
    >

      <img

        src={image}

        alt="Fullscreen"

        className="
          max-w-full
          max-h-full
          object-contain
          select-none
        "

        style={{

          transform:
            `translate(${position.x}px, ${position.y}px) scale(${scale})`,

          transition:
            isDragging
              ? "none"
              : "transform 0.2s ease",

          cursor:
            scale > 1

              ? (
                  isDragging
                    ? "grabbing"
                    : "grab"
                )

              : "zoom-in",
        }}

        onMouseDown={handleMouseDown}

        draggable={false}
      />



      <button

        className="
          absolute
          top-4
          right-4
          text-white
          text-3xl
          font-bold
        "

        onClick={(e) => {

          e.stopPropagation();

          onClose();
        }}
      >

        ✖

      </button>

    </div>
  );
};



// ======================================================
// ================= NOTIFICATIONS PANEL ================
// ======================================================

const NotificationsPanel = () => {

  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [showAll, setShowAll] =
    useState(false);

  const [fullscreenImage, setFullscreenImage] =
    useState(null);



  // ======================================================
  // ================= AUTH USER ==========================
  // ======================================================

  const {
    user: currentUser,
  } = useContext(AuthContext);



  // ======================================================
  // ================= FETCH DATA =========================
  // ======================================================

  useEffect(() => {

    const fetchNotificationsOrTasks =
      async () => {

        if (!currentUser) {

          setLoading(false);

          return;
        }

        try {

          // ======================================================
          // =============== JUNIOR STAFF TASKS ===================
          // ======================================================

          if (
            currentUser.role ===
            "Junior Staff"
          ) {

            const assignedRes =
              await axios.get(

                "/api/reports/my-assigned-tasks"
              );


            const assignedNotifications =

              (
                assignedRes.data.reports || []
              )

              .map((report) => ({

                _id:
                  report._id,

                message:
                  `Assigned Report: ${report.problemType}
                   at ${
                     report.location
                       ?.locationName ||

                     "Unknown location"
                   }`,

                isRead: false,

                createdAt:
                  report.createdAt,

                taskInfo: {

                  ...report,

                  image:
                    report.imageBase64

                      ? `data:image/jpeg;base64,${report.imageBase64}`

                      : null,
                },
              }));


            setNotifications(
              assignedNotifications
            );

          }

          // ======================================================
          // ================= NORMAL USERS =======================
          // ======================================================

          else {

            const notifRes =
              await axios.get(

                "/api/notifications"
              );

            setNotifications(

              notifRes.data.notifications || []
            );
          }

        } catch (error) {

          console.error(

            "❌ Failed to fetch notifications or assigned reports",

            error
          );

        } finally {

          setLoading(false);
        }
      };

    fetchNotificationsOrTasks();

  }, [currentUser]);



  // ======================================================
  // ================= MARK AS READ =======================
  // ======================================================

  const markAsRead =
    async (id) => {

      try {

        await axios.put(

          `/api/notifications/${id}/read`
        );

        setNotifications((prev) =>

          prev.map((note) =>

            note._id === id

              ? {

                  ...note,

                  isRead: true,
                }

              : note
          )
        );

      } catch (error) {

        console.error(
          "❌ Failed to mark as read",
          error
        );
      }
    };



  // ======================================================
  // ================= MARK ALL READ ======================
  // ======================================================

  const markAllAsRead =
    async () => {

      try {

        await axios.put(

          "/api/notifications/mark-all-read"
        );

        setNotifications((prev) =>

          prev.map((note) => ({

            ...note,

            isRead: true,
          }))
        );

      } catch (error) {

        console.error(
          "❌ Failed to mark all read",
          error
        );
      }
    };



  // ======================================================
  // ================= DELETE NOTIFICATION ================
  // ======================================================

  const deleteNotification =
    async (id) => {

      try {

        await axios.delete(

          `/api/notifications/${id}`
        );

        setNotifications((prev) =>

          prev.filter(
            (note) =>
              note._id !== id
          )
        );

      } catch (error) {

        console.error(
          "❌ Failed to delete notification",
          error
        );
      }
    };



  // ======================================================
  // ================= ACCEPT TASK ========================
  // ======================================================

  const handleTaskResponse =
    async (
      reportId,
      action
    ) => {

      try {

        await axios.put(

          "/api/reports/respond-task",

          {

            reportId,

            action,
          }
        );


        setNotifications((prev) =>

          prev.map((note) =>

            note.taskInfo?._id ===
            reportId

              ? {

                  ...note,

                  taskInfo: {

                    ...note.taskInfo,

                    status:

                      action === "accept"

                        ? "In Progress"

                        : "Pending",
                  },
                }

              : note
          )
        );

      } catch (error) {

        console.error(
          "❌ Task Response Error:",
          error
        );
      }
    };



  // ======================================================
  // ================= FORMAT TIME ========================
  // ======================================================

  const formatTime = (timestamp) => {

    const now =
      new Date();

    const createdAt =
      new Date(timestamp);

    const diffInMinutes =
      Math.floor(

        (now - createdAt) /
        (1000 * 60)
      );

    if (diffInMinutes < 1)
      return "Just now";

    if (diffInMinutes < 60)

      return `${diffInMinutes} minutes ago`;

    const diffInHours =
      Math.floor(
        diffInMinutes / 60
      );

    if (diffInHours < 24)

      return `${diffInHours} hours ago`;

    const diffInDays =
      Math.floor(
        diffInHours / 24
      );

    return `${diffInDays} days ago`;
  };



  // ======================================================
  // ===================== LOADING ========================
  // ======================================================

  if (loading) {

    return (

      <div className="
        bg-white
        shadow-lg
        rounded-2xl
        p-6
      ">

        <h2 className="
          text-2xl
          font-bold
          mb-4
        ">

          Notifications

        </h2>

        <p>
          Loading...
        </p>

      </div>
    );
  }



  // ======================================================
  // ======================= UI ===========================
  // ======================================================

  return (

    <>

      <div className="
        bg-white
        shadow-lg
        rounded-2xl
        p-6
        w-full
        max-w-md
        mx-auto
      ">

        <h2 className="
          text-2xl
          font-bold
          mb-4
        ">

          Notifications

        </h2>



        {/* ====================================================== */}
        {/* ================= TOP BUTTONS ======================== */}
        {/* ====================================================== */}

        <div className="
          flex
          justify-between
          mb-4
        ">

          <button

            className="
              text-blue-600
              hover:underline
            "

            onClick={() =>
              setShowAll(true)
            }
          >

            Show All

          </button>



          <button

            className="
              text-blue-600
              hover:underline
            "

            onClick={markAllAsRead}
          >

            Mark All Read

          </button>

        </div>



        {/* ====================================================== */}
        {/* ================= NOTIFICATION LIST ================== */}
        {/* ====================================================== */}

        <div className="
          space-y-3
          max-h-[400px]
          overflow-y-auto
        ">

          {
            notifications.length === 0 ? (

              <p className="
                text-center
                py-4
              ">

                No notifications

              </p>

            ) : (

              notifications
              .slice(0, 5)

              .map((note) => (

                <div

                  key={note._id}

                  className={`
                    p-4
                    border
                    rounded-xl
                    ${
                      !note.isRead

                        ? "bg-blue-50"

                        : "bg-white"
                    }
                  `}
                >

                  <p className="
                    font-medium
                  ">

                    {note.message}

                  </p>



                  {/* ====================================================== */}
                  {/* ================= TASK INFO ========================== */}
                  {/* ====================================================== */}

                  {
                    note.taskInfo && (

                      <>

                        {/* IMAGE */}

                        {
                          note.taskInfo.image && (

                            <img

                              src={
                                note.taskInfo.image
                              }

                              alt="Issue"

                              className="
                                w-24
                                h-24
                                object-cover
                                rounded
                                my-2
                                border
                                cursor-pointer
                              "

                              onClick={() =>

                                setFullscreenImage(

                                  note.taskInfo.image
                                )
                              }
                            />
                          )
                        }



                        <p className="
                          text-sm
                        ">

                          <strong>
                            Status:
                          </strong>

                          {" "}

                          {
                            note.taskInfo.status
                          }

                        </p>



                        <p className="
                          text-sm
                        ">

                          <strong>
                            Priority:
                          </strong>

                          {" "}

                          {
                            note.taskInfo.priority
                          }

                        </p>



                        {/* ====================================================== */}
                        {/* ================= LOCATION =========================== */}
                        {/* ====================================================== */}

                        {
                          note.taskInfo
                          ?.location
                          ?.latitude &&

                          note.taskInfo
                          ?.location
                          ?.longitude && (

                            <button

                              className="
                                text-blue-600
                                hover:underline
                                text-sm
                                mt-1
                              "

                              onClick={() =>

                                window.open(

                                  `https://www.google.com/maps/search/?api=1&query=${note.taskInfo.location.latitude},${note.taskInfo.location.longitude}`,

                                  "_blank"
                                )
                              }
                            >

                              📍 View Location

                            </button>
                          )
                        }



                        {/* ====================================================== */}
                        {/* ================= ACCEPT/DECLINE ===================== */}
                        {/* ====================================================== */}

                        {
                          note.taskInfo.status ===
                          "Staff Assigned" && (

                            <div className="
                              flex
                              gap-2
                              mt-3
                            ">

                              <button

                                className="
                                  bg-green-600
                                  text-white
                                  px-3
                                  py-1
                                  rounded
                                "

                                onClick={() =>

                                  handleTaskResponse(

                                    note.taskInfo._id,

                                    "accept"
                                  )
                                }
                              >

                                Accept

                              </button>



                              <button

                                className="
                                  bg-red-600
                                  text-white
                                  px-3
                                  py-1
                                  rounded
                                "

                                onClick={() =>

                                  handleTaskResponse(

                                    note.taskInfo._id,

                                    "decline"
                                  )
                                }
                              >

                                Decline

                              </button>

                            </div>
                          )
                        }

                      </>
                    )
                  }



                  <p className="
                    text-xs
                    text-gray-500
                    mt-2
                  ">

                    {
                      formatTime(
                        note.createdAt
                      )
                    }

                  </p>

                </div>
              ))
            )
          }

        </div>

      </div>



      {/* ====================================================== */}
      {/* ================= FULLSCREEN IMAGE =================== */}
      {/* ====================================================== */}

      {
        fullscreenImage && (

          <FullscreenImageModal

            image={fullscreenImage}

            onClose={() =>

              setFullscreenImage(null)
            }
          />
        )
      }

    </>
  );
};



export default NotificationsPanel;