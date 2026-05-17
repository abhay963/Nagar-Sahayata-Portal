import React, {
  useEffect,
  useState,
} from "react";

import axios from "../api/axios";

import {
  toast,
} from "react-toastify";



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

      <p className="
        text-center
        py-10
      ">

        Loading tasks...

      </p>
    );
  }



  // ======================================================
  // ======================= UI ===========================
  // ======================================================

  return (

    <div className="
      max-w-7xl
      mx-auto
      p-6
    ">

      <h2 className="
        text-3xl
        font-bold
        mb-6
      ">

        My Assigned Tasks

      </h2>



      {
        tasks.length === 0 ? (

          <div className="
            bg-white
            rounded-xl
            shadow
            p-10
            text-center
          ">

            <p className="
              text-gray-500
              text-lg
            ">

              No assigned tasks found

            </p>

          </div>

        ) : (

          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
            gap-6
          ">

            {
              tasks.map((task) => (

                <div

                  key={task._id}

                  className="
                    bg-white
                    rounded-2xl
                    shadow-md
                    overflow-hidden
                    border
                  "
                >

                  {/* ====================================================== */}
                  {/* ================= TASK IMAGE ========================= */}
                  {/* ====================================================== */}

                  {
                    task.imageBase64 && (

                      <img

                        src={
                          `data:image/jpeg;base64,${task.imageBase64}`
                        }

                        alt="Issue"

                        className="
                          w-full
                          h-52
                          object-cover
                        "
                      />
                    )
                  }



                  <div className="p-5">

                    {/* ====================================================== */}
                    {/* ================= PROBLEM ============================ */}
                    {/* ====================================================== */}

                    <h3 className="
                      text-xl
                      font-bold
                      mb-2
                    ">

                      {
                        task.problemType
                      }

                    </h3>



                    {/* ====================================================== */}
                    {/* ================= DESCRIPTION ======================== */}
                    {/* ====================================================== */}

                    <p className="
                      text-gray-600
                      mb-4
                    ">

                      {
                        task.description
                      }

                    </p>



                    {/* ====================================================== */}
                    {/* ================= DETAILS ============================ */}
                    {/* ====================================================== */}

                    <div className="
                      space-y-2
                      text-sm
                    ">

                      <p>

                        <span className="
                          font-semibold
                        ">

                          Department:
                        </span>

                        {" "}

                        {
                          task.department
                        }

                      </p>



                      <p>

                        <span className="
                          font-semibold
                        ">

                          Priority:
                        </span>

                        {" "}

                        {
                          task.priority
                        }

                      </p>



                      <p>

                        <span className="
                          font-semibold
                        ">

                          Status:
                        </span>

                        {" "}

                        {
                          task.status
                        }

                      </p>



                      <p>

                        <span className="
                          font-semibold
                        ">

                          Location:
                        </span>

                        {" "}

                        {
                          task.location
                            ?.locationName ||

                          "Unknown"
                        }

                      </p>



                      <p>

                        <span className="
                          font-semibold
                        ">

                          Assigned By:
                        </span>

                        {" "}

                        {
                          task.assignedStaffName
                        }

                      </p>



                      <p>

                        <span className="
                          font-semibold
                        ">

                          Date:
                        </span>

                        {" "}

                        {
                          new Date(
                            task.createdAt
                          ).toLocaleString()
                        }

                      </p>

                    </div>



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

                          {/* ACCEPT BUTTON */}

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
                              text-white
                              py-2
                              rounded-lg
                              hover:bg-green-700
                              transition
                              disabled:opacity-50
                            "
                          >

                            {
                              processingId ===
                              task._id

                                ? "Processing..."

                                : "Accept"
                            }

                          </button>



                          {/* DECLINE BUTTON */}

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
                              text-white
                              py-2
                              rounded-lg
                              hover:bg-red-700
                              transition
                              disabled:opacity-50
                            "
                          >

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

                        <p className="
                          mt-4
                          text-green-700
                          text-sm
                          font-medium
                        ">

                          Accepted At:
                          {" "}

                          {
                            new Date(
                              task.acceptedAt
                            ).toLocaleString()
                          }

                        </p>
                      )
                    }

                  </div>

                </div>
              ))
            }

          </div>
        )
      }

    </div>
  );
};



export default JuniorStaffTasks;