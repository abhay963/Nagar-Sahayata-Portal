import React, {
  useEffect,
  useState,
} from "react";

import axios from "../api/axios";

import {
  toast,
} from "react-toastify";

import {
  motion,
} from "framer-motion";

import {
  FiMapPin,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiUser,
  FiAlertTriangle,
} from "react-icons/fi";



const JuniorStaffTasks = () => {

  // ======================================================
  // ===================== STATES =========================
  // ======================================================

  const [tasks, setTasks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [processingId, setProcessingId] =
    useState(null);

  const [fullscreenImage, setFullscreenImage] =
    useState(null);



  // ======================================================
  // ================= FETCH TASKS ========================
  // ======================================================

  const fetchTasks = async () => {

    try {

      setLoading(true);

      const response =
        await axios.get(
          "/api/reports/my-assigned-tasks"
        );

      console.log(
        "📌 Assigned Tasks:",
        response.data
      );

      setTasks(
        response.data.reports || []
      );

    } catch (error) {

      console.error(
        "❌ Failed to fetch tasks:",
        error
      );

      toast.error(
        "Failed to load tasks"
      );

    } finally {

      setLoading(false);
    }
  };



  // ======================================================
  // ================= INITIAL FETCH ======================
  // ======================================================

  useEffect(() => {

    fetchTasks();

  }, []);



  // ======================================================
  // ================= ACCEPT TASK ========================
  // ======================================================

  const handleAccept =
    async (reportId) => {

      try {

        setProcessingId(reportId);

        await axios.put(

          "/api/reports/respond-task",

          {

            reportId,

            action: "accept",
          }
        );

        toast.success(
          "Task accepted successfully"
        );

        setTasks((prev) =>

          prev.map((task) =>

            task._id === reportId

              ? {

                  ...task,

                  status:
                    "In Progress",

                  acceptedAt:
                    new Date(),
                }

              : task
          )
        );

      } catch (error) {

        console.error(
          "❌ Accept Error:",
          error
        );

        toast.error(

          error.response?.data
            ?.message ||

          "Failed to accept task"
        );

      } finally {

        setProcessingId(null);
      }
    };



  // ======================================================
  // ================= DECLINE TASK =======================
  // ======================================================

  const handleDecline =
    async (reportId) => {

      try {

        setProcessingId(reportId);

        await axios.put(

          "/api/reports/respond-task",

          {

            reportId,

            action: "decline",
          }
        );

        toast.success(
          "Task declined"
        );

        setTasks((prev) =>

          prev.filter(
            (task) =>
              task._id !== reportId
          )
        );

      } catch (error) {

        console.error(
          "❌ Decline Error:",
          error
        );

        toast.error(

          error.response?.data
            ?.message ||

          "Failed to decline task"
        );

      } finally {

        setProcessingId(null);
      }
    };



  // ======================================================
  // ===================== LOADING ========================
  // ======================================================

  if (loading) {

    return (

      <div className="
        flex
        justify-center
        items-center
        min-h-[60vh]
      ">

        <div className="
          w-12
          h-12
          border-4
          border-emerald-200
          border-t-emerald-600
          rounded-full
          animate-spin
        "></div>

      </div>
    );
  }



  // ======================================================
  // ======================= UI ===========================
  // ======================================================

  return (

    <div className="
      min-h-screen
      bg-gradient-to-br
      from-emerald-50
      via-white
      to-teal-50
      p-6
    ">

      <div className="
        max-w-7xl
        mx-auto
      ">

        {/* ====================================================== */}
        {/* ================= HEADER ============================== */}
        {/* ====================================================== */}

        <div className="
          flex
          justify-between
          items-center
          mb-8
        ">

          <div>

            <h2 className="
              text-4xl
              font-bold
              text-gray-900
            ">

              My Assigned Tasks

            </h2>

            <p className="
              text-emerald-600
              mt-1
            ">

              Tasks assigned to you

            </p>

          </div>

          <div className="
            bg-emerald-100
            text-emerald-700
            px-5
            py-3
            rounded-2xl
            font-semibold
          ">

            {tasks.length} Tasks

          </div>

        </div>



        {/* ====================================================== */}
        {/* ================= EMPTY STATE ======================== */}
        {/* ====================================================== */}

        {
          tasks.length === 0 ? (

            <div className="
              bg-white
              rounded-3xl
              shadow-xl
              p-16
              text-center
            ">

              <h3 className="
                text-2xl
                font-bold
                text-gray-700
              ">

                No Assigned Tasks

              </h3>

              <p className="
                text-gray-500
                mt-3
              ">

                You currently have no tasks assigned

              </p>

            </div>

          ) : (

            <div className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-3
              gap-7
            ">

              {
                tasks.map((task, index) => (

                  <motion.div

                    key={task._id}

                    initial={{
                      opacity: 0,
                      y: 30,
                    }}

                    animate={{
                      opacity: 1,
                      y: 0,
                    }}

                    transition={{
                      delay:
                        index * 0.05,
                    }}

                    className="
                      bg-white
                      rounded-3xl
                      overflow-hidden
                      shadow-xl
                      border
                      border-emerald-100
                    "
                  >

                    {/* ====================================================== */}
                    {/* ================= IMAGE ============================== */}
                    {/* ====================================================== */}

                    {
                      task.image && (

                        <img

                          src={task.image}

                          alt="Issue"

                          onClick={() =>
                            setFullscreenImage(
                              task.image
                            )
                          }

                          className="
                            w-full
                            h-56
                            object-cover
                            cursor-pointer
                            hover:scale-[1.02]
                            transition
                          "
                        />
                      )
                    }



                    {/* ====================================================== */}
                    {/* ================= CONTENT ============================ */}
                    {/* ====================================================== */}

                    <div className="p-6">

                      {/* PROBLEM */}

                      <div className="
                        flex
                        items-start
                        justify-between
                        gap-3
                      ">

                        <h3 className="
                          text-2xl
                          font-bold
                          text-gray-900
                        ">

                          {
                            task.problemType
                          }

                        </h3>

                        <span className={`
                          px-4
                          py-1.5
                          rounded-full
                          text-sm
                          font-semibold

                          ${
                            task.priority === "High"

                              ? "bg-red-100 text-red-700"

                              : task.priority === "Medium"

                              ? "bg-amber-100 text-amber-700"

                              : "bg-emerald-100 text-emerald-700"
                          }
                        `}>

                          {
                            task.priority
                          }

                        </span>

                      </div>



                      {/* DESCRIPTION */}

                      <p className="
                        text-gray-600
                        mt-4
                        leading-relaxed
                      ">

                        {
                          task.description
                        }

                      </p>



                      {/* DETAILS */}

                      <div className="
                        mt-6
                        space-y-3
                        text-sm
                      ">

                        <div className="
                          flex
                          items-center
                          gap-2
                        ">

                          <FiAlertTriangle className="
                            text-emerald-600
                          " />

                          <span>

                            <strong>Status:</strong>

                            {" "}

                            {
                              task.status
                            }

                          </span>

                        </div>



                        <div className="
                          flex
                          items-center
                          gap-2
                        ">

                          <FiUser className="
                            text-blue-600
                          " />

                          <span>

                            <strong>Assigned By:</strong>

                            {" "}

                            {
                              task.assignedByName || "N/A"
                            }

                          </span>

                        </div>



                        <div className="
                          flex
                          items-center
                          gap-2
                        ">

                          <FiMapPin className="
                            text-red-500
                          " />

                          <span>

                            <strong>Location:</strong>

                            {" "}

                            {
                              task.location
                                ?.locationName ||

                              "Unknown"
                            }

                          </span>

                        </div>



                        <div className="
                          flex
                          items-center
                          gap-2
                        ">

                          <FiClock className="
                            text-amber-500
                          " />

                          <span>

                            <strong>Date:</strong>

                            {" "}

                            {
                              new Date(
                                task.createdAt
                              ).toLocaleString()
                            }

                          </span>

                        </div>



                        <div>

                          <strong>
                            Department:
                          </strong>

                          {" "}

                          {
                            task.department
                          }

                        </div>



                        <div>

                          <strong>
                            City:
                          </strong>

                          {" "}

                          {
                            task.city
                          }

                        </div>

                      </div>



                      {/* ====================================================== */}
                      {/* ================= MAP BUTTON ========================= */}
                      {/* ====================================================== */}

                      {
                        task.location?.latitude && (

                          <button

                            onClick={() =>

                              window.open(

                                `https://www.google.com/maps/search/?api=1&query=${task.location.latitude},${task.location.longitude}`,

                                "_blank"
                              )
                            }

                            className="
                              w-full
                              mt-5
                              bg-blue-50
                              hover:bg-blue-100
                              text-blue-700
                              py-3
                              rounded-2xl
                              font-semibold
                              transition
                            "
                          >

                            View Location

                          </button>
                        )
                      }



                      {/* ====================================================== */}
                      {/* ================= ACTION BUTTONS ===================== */}
                      {/* ====================================================== */}

                      {
                        task.status ===
                        "Staff Assigned" && (

                          <div className="
                            flex
                            gap-3
                            mt-5
                          ">

                            {/* ACCEPT */}

                            <button

                              onClick={() =>
                                handleAccept(
                                  task._id
                                )
                              }

                              disabled={
                                processingId ===
                                task._id
                              }

                              className="
                                flex-1
                                bg-green-600
                                hover:bg-green-700
                                text-white
                                py-3
                                rounded-2xl
                                font-semibold
                                transition
                                disabled:opacity-50
                                flex
                                items-center
                                justify-center
                                gap-2
                              "
                            >

                              <FiCheckCircle />

                              {
                                processingId ===
                                task._id

                                  ? "Processing..."

                                  : "Accept"
                              }

                            </button>



                            {/* DECLINE */}

                            <button

                              onClick={() =>
                                handleDecline(
                                  task._id
                                )
                              }

                              disabled={
                                processingId ===
                                task._id
                              }

                              className="
                                flex-1
                                bg-red-600
                                hover:bg-red-700
                                text-white
                                py-3
                                rounded-2xl
                                font-semibold
                                transition
                                disabled:opacity-50
                                flex
                                items-center
                                justify-center
                                gap-2
                              "
                            >

                              <FiXCircle />

                              {
                                processingId ===
                                task._id

                                  ? "Processing..."

                                  : "Decline"
                              }

                            </button>

                          </div>
                        )
                      }



                      {/* ====================================================== */}
                      {/* ================= ACCEPTED INFO ====================== */}
                      {/* ====================================================== */}

                      {
                        task.status ===
                          "In Progress" &&

                        task.acceptedAt && (

                          <div className="
                            mt-5
                            bg-green-50
                            text-green-700
                            px-4
                            py-3
                            rounded-2xl
                            text-sm
                            font-semibold
                          ">

                            Accepted At:

                            {" "}

                            {
                              new Date(
                                task.acceptedAt
                              ).toLocaleString()
                            }

                          </div>
                        )
                      }

                    </div>

                  </motion.div>
                ))
              }

            </div>
          )
        }

      </div>



      {/* ====================================================== */}
      {/* ================= FULLSCREEN IMAGE =================== */}
      {/* ====================================================== */}

      {
        fullscreenImage && (

          <div
            className="
              fixed
              inset-0
              bg-black/90
              z-50
              flex
              items-center
              justify-center
              p-4
            "

            onClick={() =>
              setFullscreenImage(null)
            }
          >

            <img

              src={fullscreenImage}

              alt="Fullscreen"

              className="
                max-h-[95%]
                max-w-[95%]
                rounded-3xl
              "
            />

          </div>
        )
      }

    </div>
  );
};

export default JuniorStaffTasks;