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
            top-5
            right-5
            text-white
            text-4xl
            hover:rotate-90
            duration-300
          "
        >

          <FiX />

        </button>

      </motion.div>

    </AnimatePresence>
  );
};



// ======================================================
// ================= NOTIFICATION PANEL =================
// ======================================================

const NotificationsPanel = () => {

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

        } else {

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
    () => {

      setNotifications([]);
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
        w-[380px]
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

            {/* LEFT */}

            <div className="
              flex
              items-center
              gap-3
            ">

              {/* ICON */}

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



                {/* COUNT */}

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



              {/* TITLE */}

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

                  Manage all updates

                </p>

              </div>

            </div>



            {/* CLEAR BUTTON */}

            <button

              onClick={
                clearAllNotifications
              }

              className="
                flex
                items-center
                gap-2
                bg-red-500
                hover:bg-red-600
                text-white
                px-3
                py-2
                rounded-2xl
                text-sm
                font-semibold
                duration-300
              "
            >

              <FiScissors />

              Clear

            </button>

          </div>



          {/* LIST */}

          <div className="
            max-h-[500px]
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
                                hover:bg-yellow-200
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
                                hover:bg-red-200
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
                                text-[17px]
                                leading-tight
                              ">

                                {note.message}

                              </h3>

                              <p className="
                                text-sm
                                text-gray-500
                                mt-1
                              ">

                                Notification update

                              </p>

                            </div>

                          </div>



                          {/* IMAGE */}

                          {
                            note.taskInfo?.image && (

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
                                  h-[180px]
                                  object-cover
                                  rounded-2xl
                                  mt-4
                                  cursor-pointer
                                "
                              />
                            )
                          }



                          {/* DETAILS */}

                          {
                            note.taskInfo && (

                              <div className="
                                mt-4
                                space-y-3
                              ">

                                <div className="
                                  flex
                                  items-center
                                  gap-2
                                ">

                                  <FiClock
                                    className="
                                      text-blue-500
                                    "
                                  />

                                  <span>

                                    <strong>
                                      Status:
                                    </strong>

                                    {" "}

                                    {
                                      note.taskInfo.status
                                    }

                                  </span>

                                </div>



                                <div className="
                                  flex
                                  items-center
                                  gap-2
                                ">

                                  <FiCheckCircle
                                    className="
                                      text-green-500
                                    "
                                  />

                                  <span>

                                    <strong>
                                      Priority:
                                    </strong>

                                    {" "}

                                    {
                                      note.taskInfo.priority
                                    }

                                  </span>

                                </div>



                                {/* LOCATION */}

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



                          {/* TIME */}

                          <div className="
                            mt-4
                            text-xs
                            text-gray-400
                          ">

                            {
                              formatTime(
                                note.createdAt
                              )
                            }

                          </div>

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