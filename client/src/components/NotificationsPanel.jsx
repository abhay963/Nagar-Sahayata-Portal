import React, {
  useState,
  useEffect,
  useContext,
} from "react";

import axios from "../api/axios";

import AuthContext
from "../context/AuthContext";



// ======================================================
// ================= FULLSCREEN IMAGE ===================
// ======================================================

const FullscreenImageModal = ({
  image,
  onClose,
}) => {

  return (

    <div
      className="
        fixed
        inset-0
        bg-black/80
        flex
        items-center
        justify-center
        z-50
      "
    >

      <img
        src={image}
        alt="Fullscreen"
        className="
          max-w-[90%]
          max-h-[90%]
          rounded-xl
        "
      />

      <button

        onClick={onClose}

        className="
          absolute
          top-5
          right-5
          text-white
          text-4xl
          font-bold
        "
      >

        ✕

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

  const [fullscreenImage, setFullscreenImage] =
    useState(null);


  // ======================================================
  // ================= CURRENT USER ======================
  // ======================================================

  const {
    user: currentUser,
  } = useContext(AuthContext);


  // ======================================================
  // ================= FETCH DATA ========================
  // ======================================================

  useEffect(() => {

    const fetchData = async () => {

      try {

        // ======================================================
        // ============== JUNIOR STAFF TASKS ====================
        // ======================================================

        if (
          currentUser?.role ===
          "Junior Staff"
        ) {

          const res =
            await axios.get(
              "/api/reports/my-assigned-tasks"
            );

          const formatted =

            (res.data.reports || [])

            .map((report) => ({

              _id:
                report._id,

              message:
                `Assigned Report: ${report.problemType}`,

              createdAt:
                report.createdAt,

              taskInfo: {

                ...report,

                image:
                  report.imageBase64 || null,
              },
            }));


          setNotifications(
            formatted
          );
        }

        // ======================================================
        // ================= NORMAL USERS =======================
        // ======================================================

        else {

          const res =
            await axios.get(
              "/api/notifications"
            );

          setNotifications(

            res.data.notifications || []
          );
        }

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);
      }
    };

    fetchData();

  }, [currentUser]);


  // ======================================================
  // ================= DELETE ============================
  // ======================================================

  const deleteNotification =
    async (id) => {

      try {

        await axios.delete(
          `/api/notifications/${id}`
        );

        setNotifications((prev) =>

          prev.filter(
            (item) =>
              item._id !== id
          )
        );

      } catch (error) {

        console.error(error);
      }
    };


  // ======================================================
  // ================= REMOVE FROM UI ====================
  // ======================================================

  const removeNotification =
    (id) => {

      setNotifications((prev) =>

        prev.filter(
          (item) =>
            item._id !== id
        )
      );
    };


  // ======================================================
  // ================= ACCEPT / DECLINE ==================
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

        console.error(error);
      }
    };


  // ======================================================
  // ================= FORMAT TIME =======================
  // ======================================================

  const formatTime = (timestamp) => {

    const now =
      new Date();

    const created =
      new Date(timestamp);

    const minutes =
      Math.floor(
        (now - created) /
        (1000 * 60)
      );

    if (minutes < 1)
      return "Just now";

    if (minutes < 60)
      return `${minutes} mins ago`;

    const hours =
      Math.floor(
        minutes / 60
      );

    if (hours < 24)
      return `${hours} hrs ago`;

    const days =
      Math.floor(
        hours / 24
      );

    return `${days} days ago`;
  };


  // ======================================================
  // ================= LOADING ===========================
  // ======================================================

  if (loading) {

    return (

      <div className="
        bg-white
        rounded-2xl
        shadow
        p-6
      ">

        Loading...

      </div>
    );
  }


  // ======================================================
  // ======================= UI ==========================
  // ======================================================

  return (

    <>

      <div className="
        bg-white
        rounded-2xl
        shadow-lg
        p-5
        w-full
        max-w-md
        mx-auto
      ">

        {/* HEADER */}

        <div className="
          flex
          justify-between
          items-center
          mb-5
        ">

          <h2 className="
            text-2xl
            font-bold
          ">

            Notifications

          </h2>

        </div>


        {/* LIST */}

        <div className="
          max-h-[500px]
          overflow-y-auto
          space-y-4
        ">

          {
            notifications.length === 0 ? (

              <div className="
                text-center
                py-10
                text-gray-500
              ">

                No notifications

              </div>

            ) : (

              notifications.map((note) => (

                <div

                  key={note._id}

                  className="
                    border
                    rounded-2xl
                    p-4
                    relative
                    bg-gray-50
                  "
                >

                  {/* REMOVE BUTTON */}

                  <button

                    onClick={() =>

                      removeNotification(
                        note._id
                      )
                    }

                    className="
                      absolute
                      top-2
                      right-10
                      text-gray-500
                      hover:text-black
                    "
                  >

                    ✂

                  </button>


                  {/* DELETE BUTTON */}

                  <button

                    onClick={() =>

                      deleteNotification(
                        note._id
                      )
                    }

                    className="
                      absolute
                      top-2
                      right-3
                      text-red-500
                      hover:text-red-700
                    "
                  >

                    🗑

                  </button>


                  {/* MESSAGE */}

                  <p className="
                    font-semibold
                    pr-16
                  ">

                    {note.message}

                  </p>


                  {/* TASK INFO */}

                  {
                    note.taskInfo && (

                      <div className="
                        mt-3
                      ">

                        {/* IMAGE */}

                        {
                          note.taskInfo.image && (

                            <img

                              src={
                                note.taskInfo.image
                              }

                              alt="Issue"

                              onClick={() =>

                                setFullscreenImage(

                                  note.taskInfo.image
                                )
                              }

                              className="
                                w-[120px]
                                h-[100px]
                                object-cover
                                rounded-xl
                                border
                                cursor-pointer
                              "
                            />
                          )
                        }


                        {/* STATUS */}

                        <p className="
                          text-sm
                          mt-2
                        ">

                          <strong>
                            Status:
                          </strong>

                          {" "}

                          {
                            note.taskInfo.status
                          }

                        </p>


                        {/* PRIORITY */}

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


                        {/* LOCATION */}

                        {
                          note.taskInfo
                          ?.location
                          ?.latitude &&

                          note.taskInfo
                          ?.location
                          ?.longitude && (

                            <button

                              onClick={() =>

                                window.open(

                                  `https://www.google.com/maps/search/?api=1&query=${note.taskInfo.location.latitude},${note.taskInfo.location.longitude}`,

                                  "_blank"
                                )
                              }

                              className="
                                text-blue-600
                                text-sm
                                hover:underline
                                mt-1
                              "
                            >

                              📍 View Location

                            </button>
                          )
                        }


                        {/* ACCEPT DECLINE */}

                        {
                          note.taskInfo.status ===
                          "Staff Assigned" && (

                            <div className="
                              flex
                              gap-2
                              mt-3
                            ">

                              <button

                                onClick={() =>

                                  handleTaskResponse(

                                    note.taskInfo._id,

                                    "accept"
                                  )
                                }

                                className="
                                  bg-green-600
                                  text-white
                                  px-3
                                  py-1
                                  rounded-lg
                                "
                              >

                                Accept

                              </button>


                              <button

                                onClick={() =>

                                  handleTaskResponse(

                                    note.taskInfo._id,

                                    "decline"
                                  )
                                }

                                className="
                                  bg-red-600
                                  text-white
                                  px-3
                                  py-1
                                  rounded-lg
                                "
                              >

                                Decline

                              </button>

                            </div>
                          )
                        }

                      </div>
                    )
                  }


                  {/* TIME */}

                  <p className="
                    text-xs
                    text-gray-500
                    mt-3
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


      {/* FULLSCREEN IMAGE */}

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