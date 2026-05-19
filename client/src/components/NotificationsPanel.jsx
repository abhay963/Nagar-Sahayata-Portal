import React, {
  useState,
  useEffect,
  useContext,
} from "react";

import axios from "../api/axios";

import AuthContext
from "../context/AuthContext";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  FiBell,
  FiTrash2,
  FiScissors,
  FiMapPin,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiX,
  FiUser,
  FiAlertTriangle,
} from "react-icons/fi";



// ======================================================
// ================= FULLSCREEN IMAGE ===================
// ======================================================
const FullscreenImageModal = ({
  image,
  onClose,
}) => {

  return (

    <AnimatePresence>

      <motion.div

        onClick={onClose}

        initial={{ opacity: 0 }}

        animate={{ opacity: 1 }}

        exit={{ opacity: 0 }}

        className="
          fixed
          inset-0
          bg-black/90
          z-50
          flex
          items-center
          justify-center
          backdrop-blur-md
        "
      >

        <motion.img

          onClick={(e) =>
            e.stopPropagation()
          }

          initial={{
            scale: 0.7,
          }}

          animate={{
            scale: 1,
          }}

          exit={{
            scale: 0.7,
          }}

          src={image}

          alt="Fullscreen"

          className="
            max-w-[90%]
            max-h-[90%]
            rounded-3xl
            shadow-2xl
          "
        />

        <button

          onClick={onClose}

          className="
            absolute
            top-6
            right-6
            bg-white
            text-black
            w-12
            h-12
            rounded-full
            flex
            items-center
            justify-center
            shadow-2xl
            hover:scale-110
            transition
          "
        >

          <FiX size={28} />

        </button>

      </motion.div>

    </AnimatePresence>
  );
};



// ======================================================
// ================= NOTIFICATION PANEL =================
// ======================================================

const NotificationsPanel = ({ onClose }) => {

  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [fullscreenImage, setFullscreenImage] =
    useState(null);



  const {
    user: currentUser,
  } = useContext(AuthContext);



  // ======================================================
  // ================= FETCH DATA =========================
  // ======================================================

  useEffect(() => {

    const fetchData = async () => {

      try {

        // ============================================
        // JUNIOR STAFF
        // ============================================

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
                  report.image || null,
              },
            }));


          setNotifications(
            formatted
          );

        }

        // ============================================
        // STAFF
        // ============================================

        else if (
          currentUser?.role ===
          "Staff"
        ) {

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
  // ================= DELETE =============================
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
  // ================= REMOVE =============================
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
  // ================= CLEAR ALL ==========================
  // ======================================================

 const clearAllNotifications =
  async () => {

    try {

      await axios.delete(
        "/api/notifications/clear-all"
      );

      setNotifications([]);

    } catch (error) {

      console.error(error);
    }
  };


  // ======================================================
  // ================= ACCEPT / DECLINE ===================
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
  // ================= FORMAT TIME ========================
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
  // ================= LOADING ============================
  // ======================================================

  if (loading) {

    return (

      <div className="
        flex
        justify-center
        items-center
        h-[300px]
        text-lg
        font-semibold
      ">

        Loading...

      </div>
    );
  }



  // ======================================================
  // ======================= UI ===========================
  // ======================================================

  return (

    <>

      <div className="
        absolute
        top-20
        right-5
        z-50
        w-[400px]
      ">

        <motion.div

          initial={{
            opacity: 0,
            y: -20,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          className="
            bg-white
            rounded-3xl
            shadow-2xl
            border
            overflow-hidden
          "
        >

          {/* HEADER */}

          <div className="
            flex
            justify-between
            items-center
            p-4
            border-b
            bg-gradient-to-r
            from-blue-50
            to-indigo-50
          ">

            <div className="
              flex
              items-center
              gap-3
            ">

              <div className="
                relative
              ">

                <motion.div

                  animate={{
                    scale: [1, 1.08, 1],
                  }}

                  transition={{
                    repeat: Infinity,
                    duration: 2,
                  }}

                  className="
                    bg-blue-600
                    text-white
                    p-3
                    rounded-2xl
                    shadow-lg
                  "
                >

                  <FiBell size={22} />

                </motion.div>

                <div className="
                  absolute
                  -top-2
                  -right-2
                  bg-red-500
                  text-white
                  text-xs
                  min-w-[22px]
                  h-[22px]
                  px-1
                  rounded-full
                  flex
                  items-center
                  justify-center
                  font-bold
                  border-2
                  border-white
                ">

                  {
                    notifications.length
                  }

                </div>

              </div>

              <div>

                <h2 className="
                  text-xl
                  font-bold
                ">

                  Notifications

                </h2>

                <p className="
                  text-xs
                  text-gray-500
                ">

                  Latest updates

                </p>

              </div>

            </div>


          </div>



          {/* LIST */}

          <div className="
            max-h-[550px]
            overflow-y-auto
            p-4
            space-y-4
          ">

            {
              notifications.length === 0 ? (

                <div className="
                  flex
                  flex-col
                  items-center
                  justify-center
                  py-16
                  text-gray-400
                ">

                  <FiBell size={50} />

                  <p className="
                    mt-4
                    font-semibold
                  ">

                    No Notifications

                  </p>

                </div>

              ) : (

                <AnimatePresence>

                  {
                    notifications.map(

                      (note, index) => (

                        <motion.div

                          key={note._id}

                          initial={{
                            opacity: 0,
                            x: 40,
                          }}

                          animate={{
                            opacity: 1,
                            x: 0,
                          }}

                          exit={{
                            opacity: 0,
                            x: 100,
                          }}

                          transition={{
                            delay:
                              index * 0.05,
                          }}

                          whileHover={{
                            y: -3,
                          }}

                          className="
                            bg-gray-50
                            rounded-2xl
                            border
                            p-4
                            relative
                            shadow-sm
                          "
                        >

                          {/* ACTIONS */}

                          <div className="
                            absolute
                            top-3
                            right-3
                            flex
                            gap-2
                          ">

                            <button

                              onClick={() =>

                                removeNotification(
                                  note._id
                                )
                              }

                              className="
                                p-2
                                rounded-xl
                                bg-yellow-100
                                text-yellow-700
                              "
                            >

                              <FiScissors size={14} />

                            </button>

                            <button

                              onClick={() =>

                                deleteNotification(
                                  note._id
                                )
                              }

                              className="
                                p-2
                                rounded-xl
                                bg-red-100
                                text-red-600
                              "
                            >

                              <FiTrash2 size={14} />

                            </button>

                          </div>



                          {/* MESSAGE */}

                          <div className="
                            flex
                            gap-3
                            pr-16
                          ">

                            <FiBell
                              className="
                                text-blue-600
                                mt-1
                              "
                              size={18}
                            />

                            <div>

                              <h3 className="
                                font-bold
                                text-[16px]
                              ">

                                {note.message}

                              </h3>

                              <p className="
                                text-sm
                                text-gray-500
                              ">

                                {
                                  formatTime(
                                    note.createdAt
                                  )
                                }

                              </p>

                            </div>

                          </div>



                          {/* TASK DETAILS */}

                          {
                            note.taskInfo && (

                              <div className="
                                mt-4
                                space-y-3
                              ">

                                <div className="
                                  grid
                                  grid-cols-2
                                  gap-3
                                  text-sm
                                ">

                                  <div>
                                    <strong>
                                      Problem:
                                    </strong>

                                    <p>
                                      {
                                        note.taskInfo.problemType
                                      }
                                    </p>
                                  </div>

                                  <div>
                                    <strong>
                                      Priority:
                                    </strong>

                                    <p>
                                      {
                                        note.taskInfo.priority
                                      }
                                    </p>
                                  </div>

                                  <div>
                                    <strong>
                                      Status:
                                    </strong>

                                    <p>
                                      {
                                        note.taskInfo.status
                                      }
                                    </p>
                                  </div>

                                  <div>
                                    <strong>
                                      Department:
                                    </strong>

                                    <p>
                                      {
                                        note.taskInfo.department
                                      }
                                    </p>
                                  </div>

                                  <div>
                                    <strong>
                                      City:
                                    </strong>

                                    <p>
                                      {
                                        note.taskInfo.city
                                      }
                                    </p>
                                  </div>

                                  <div>
                                    <strong>
                                      Citizen:
                                    </strong>

                                    <p>
                                      {
                                        note.taskInfo.citizenName || "N/A"
                                      }
                                    </p>
                                  </div>

                                </div>



                                {/* DESCRIPTION */}

                                <div>

                                  <strong>
                                    Description:
                                  </strong>

                                  <p className="
                                    text-sm
                                    text-gray-600
                                    mt-1
                                  ">

                                    {
                                      note.taskInfo.description
                                    }

                                  </p>

                                </div>



                                {/* IMAGE */}

                                {
                                  note.taskInfo.image && (

                                    <motion.img

                                      whileHover={{
                                        scale: 1.02,
                                      }}

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
                                        w-full
                                        h-[200px]
                                        object-cover
                                        rounded-2xl
                                        mt-3
                                        cursor-pointer
                                      "
                                    />
                                  )
                                }



                                {/* MAP */}

                                {
                                  note.taskInfo
                                  ?.location
                                  ?.latitude && (

                                    <button

                                      onClick={() =>

                                        window.open(

                                          `https://www.google.com/maps/search/?api=1&query=${note.taskInfo.location.latitude},${note.taskInfo.location.longitude}`,

                                          "_blank"
                                        )
                                      }

                                      className="
                                        flex
                                        items-center
                                        gap-2
                                        text-blue-600
                                        hover:underline
                                        text-sm
                                        font-medium
                                      "
                                    >

                                      <FiMapPin />

                                      View Location

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
                                      mt-4
                                    ">

                                      <button

                                        onClick={() =>

                                          handleTaskResponse(

                                            note.taskInfo._id,

                                            "accept"
                                          )
                                        }

                                        className="
                                          flex-1
                                          bg-green-500
                                          hover:bg-green-600
                                          text-white
                                          py-2.5
                                          rounded-xl
                                          font-semibold
                                          flex
                                          items-center
                                          justify-center
                                          gap-2
                                        "
                                      >

                                        <FiCheckCircle />

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
                                          flex-1
                                          bg-red-500
                                          hover:bg-red-600
                                          text-white
                                          py-2.5
                                          rounded-xl
                                          font-semibold
                                          flex
                                          items-center
                                          justify-center
                                          gap-2
                                        "
                                      >

                                        <FiXCircle />

                                        Decline

                                      </button>

                                    </div>
                                  )
                                }

                              </div>
                            )
                          }

                        </motion.div>
                      )
                    )
                  }

                </AnimatePresence>
              )
            }

          </div>

        </motion.div>

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