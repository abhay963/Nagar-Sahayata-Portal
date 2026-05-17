import React, {
  useEffect,
  useState,
} from "react";

import axios from "../api/axios";

import { toast }
from "react-toastify";

const JuniorStaffAssigned = () => {

  // ======================================================
  // ================= STATES =============================
  // ======================================================

  const [tasks, setTasks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  // ======================================================
  // ================= FETCH TASKS ========================
  // ======================================================

  const fetchTasks = async () => {

    try {

      const res =
        await axios.get(
          "/api/reports/staff-assigned-tasks"
        );

      setTasks(
        res.data.reports
      );

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to fetch tasks"
      );

    } finally {

      setLoading(false);
    }
  };


  // ======================================================
  // ================= VERIFY TASK ========================
  // ======================================================

  const verifyTask = async (
    reportId,
    action
  ) => {

    try {

      await axios.put(

        "/api/reports/verify-task-resolution",

        {

          reportId,

          action,
        }
      );

      toast.success(
        `Task ${action}d successfully`
      );

      fetchTasks();

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to verify task"
      );
    }
  };


  // ======================================================
  // ================= USE EFFECT =========================
  // ======================================================

  useEffect(() => {

    fetchTasks();

  }, []);


  // ======================================================
  // ================= LOADING ============================
  // ======================================================

  if (loading) {

    return (

      <div className="
        text-center
        py-10
      ">

        Loading...

      </div>
    );
  }


  // ======================================================
  // ================= MAIN UI ===========================
  // ======================================================

  return (

    <div className="
      space-y-6
    ">

      {
        tasks.length === 0 && (

          <div className="
            bg-white
            p-6
            rounded-xl
            shadow
            text-center
          ">

            No assigned tasks found

          </div>
        )
      }


      {
        tasks.map((task) => (

          <div

            key={task._id}

            className="
              bg-white
              rounded-2xl
              shadow
              border
              p-6
            "
          >

            {/* ========================================= */}
            {/* ============== HEADER =================== */}
            {/* ========================================= */}

            <div className="
              flex
              justify-between
              items-center
              flex-wrap
              gap-3
            ">

              <div>

                <h2 className="
                  text-2xl
                  font-bold
                  text-gray-800
                ">

                  {task.problemType}

                </h2>

                <p className="
                  text-gray-600
                  mt-2
                ">

                  {task.description}

                </p>

              </div>


              {/* ===================================== */}
              {/* ============== STATUS =============== */}
              {/* ===================================== */}

              <span

                className={`

                  px-4
                  py-2
                  rounded-full
                  text-sm
                  font-semibold

                  ${

                    task.status ===
                    "Resolved"

                    ?

                    "bg-green-100 text-green-700"

                    :

                    task.status ===
                    "Pending Approval"

                    ?

                    "bg-yellow-100 text-yellow-700"

                    :

                    task.status ===
                    "Unable To Complete"

                    ?

                    "bg-red-100 text-red-700"

                    :

                    "bg-blue-100 text-blue-700"
                  }

                `}
              >

                {task.status}

              </span>

            </div>


            {/* ========================================= */}
            {/* ============= ORIGINAL IMAGE ============ */}
            {/* ========================================= */}

            {
              task.imageBase64 && (

                <div className="mt-5">

                  <p className="
                    font-semibold
                    mb-2
                  ">

                    Original Issue

                  </p>

                  <img

                    src={task.imageBase64}

                    alt="Issue"

                    className="
                      w-full
                      md:w-80
                      rounded-xl
                    "
                  />

                </div>
              )
            }


            {/* ========================================= */}
            {/* =========== RESOLUTION IMAGE ============ */}
            {/* ========================================= */}

            {
              task.resolvedImageBase64 && (

                <div className="mt-5">

                  <p className="
                    font-semibold
                    text-green-700
                    mb-2
                  ">

                    Resolution Proof

                  </p>

                  <img

                    src={
                      task.resolvedImageBase64
                    }

                    alt="Resolved"

                    className="
                      w-full
                      md:w-80
                      rounded-xl
                    "
                  />

                </div>
              )
            }


            {/* ========================================= */}
            {/* ============ UNABLE IMAGE =============== */}
            {/* ========================================= */}

            {
              task.unableImageBase64 && (

                <div className="mt-5">

                  <p className="
                    font-semibold
                    text-red-700
                    mb-2
                  ">

                    Unable To Complete Proof

                  </p>

                  <img

                    src={
                      task.unableImageBase64
                    }

                    alt="Unable"

                    className="
                      w-full
                      md:w-80
                      rounded-xl
                    "
                  />

                </div>
              )
            }


            {/* ========================================= */}
            {/* ===== RESOLUTION DESCRIPTION ============ */}
            {/* ========================================= */}

            {
              task.resolvedDescription && (

                <div className="
                  mt-5
                  bg-green-50
                  p-4
                  rounded-xl
                ">

                  <h3 className="
                    font-semibold
                    text-green-700
                  ">

                    Resolution Description

                  </h3>

                  <p className="mt-2">

                    {
                      task.resolvedDescription
                    }

                  </p>

                </div>
              )
            }


            {/* ========================================= */}
            {/* ========= UNABLE DESCRIPTION ============ */}
            {/* ========================================= */}

            {
              task.unableReason && (

                <div className="
                  mt-5
                  bg-red-50
                  p-4
                  rounded-xl
                ">

                  <h3 className="
                    font-semibold
                    text-red-700
                  ">

                    Unable To Complete

                  </h3>

                  <p className="mt-2">

                    {
                      task.unableReason
                    }

                  </p>

                </div>
              )
            }


            {/* ========================================= */}
            {/* ========= TASK INFORMATION ============== */}
            {/* ========================================= */}

            <div className="
              grid
              md:grid-cols-2
              gap-4
              mt-6
            ">

              <div className="
                bg-gray-50
                p-4
                rounded-xl
              ">

                <p>

                  <strong>
                    Junior Staff:
                  </strong>

                  {" "}

                  {
                    task.assignedStaffName
                  }

                </p>

                <p className="mt-2">

                  <strong>
                    Department:
                  </strong>

                  {" "}

                  {
                    task.department
                  }

                </p>

              </div>


              <div className="
                bg-gray-50
                p-4
                rounded-xl
              ">

                <p>

                  <strong>
                    Accepted At:
                  </strong>

                  {" "}

                  {
                    task.acceptedAt

                    ?

                    new Date(
                      task.acceptedAt
                    ).toLocaleString()

                    :

                    "Not accepted"
                  }

                </p>

                <p className="mt-2">

                  <strong>
                    Assigned At:
                  </strong>

                  {" "}

                  {
                    task.assignedAt

                    ?

                    new Date(
                      task.assignedAt
                    ).toLocaleString()

                    :

                    "N/A"
                  }

                </p>

              </div>

            </div>


            {/* ========================================= */}
            {/* ============== TIMELINE ================= */}
            {/* ========================================= */}

            <div className="
              mt-8
              border-l-4
              border-blue-500
              pl-6
              space-y-5
            ">

              {/* ===================================== */}
              {/* ========= CREATED =================== */}
              {/* ===================================== */}

              <div>

                <h3 className="
                  font-bold
                  text-gray-800
                ">

                  Issue Created

                </h3>

                <p className="
                  text-sm
                  text-gray-600
                ">

                  {
                    new Date(
                      task.createdAt
                    ).toLocaleString()
                  }

                </p>

              </div>


              {/* ===================================== */}
              {/* ========= ASSIGNED ================== */}
              {/* ===================================== */}

              {
                task.assignedAt && (

                  <div>

                    <h3 className="
                      font-bold
                      text-blue-700
                    ">

                      Assigned To Junior Staff

                    </h3>

                    <p className="
                      text-sm
                      text-gray-600
                    ">

                      {
                        task.assignedStaffName
                      }

                    </p>

                    <p className="
                      text-sm
                      text-gray-600
                    ">

                      {
                        new Date(
                          task.assignedAt
                        ).toLocaleString()
                      }

                    </p>

                  </div>
                )
              }


              {/* ===================================== */}
              {/* ========== ACCEPTED ================ */}
              {/* ===================================== */}

              {
                task.acceptedAt && (

                  <div>

                    <h3 className="
                      font-bold
                      text-green-700
                    ">

                      Task Accepted

                    </h3>

                    <p className="
                      text-sm
                      text-gray-600
                    ">

                      {
                        new Date(
                          task.acceptedAt
                        ).toLocaleString()
                      }

                    </p>

                  </div>
                )
              }


              {/* ===================================== */}
              {/* ========== DECLINED ================ */}
              {/* ===================================== */}

              {
                task.declinedAt && (

                  <div>

                    <h3 className="
                      font-bold
                      text-red-700
                    ">

                      Task Declined

                    </h3>

                    <p className="
                      text-sm
                      text-gray-600
                    ">

                      {
                        task.declinedReason
                      }

                    </p>

                  </div>
                )
              }


              {/* ===================================== */}
              {/* ======= PENDING APPROVAL =========== */}
              {/* ===================================== */}

              {
                task.submittedForApprovalAt && (

                  <div>

                    <h3 className="
                      font-bold
                      text-yellow-700
                    ">

                      Submitted For Approval

                    </h3>

                    <p className="
                      text-sm
                      text-gray-600
                    ">

                      {
                        new Date(
                          task.submittedForApprovalAt
                        ).toLocaleString()
                      }

                    </p>

                  </div>
                )
              }


              {/* ===================================== */}
              {/* ======== UNABLE TO COMPLETE ======== */}
              {/* ===================================== */}

              {
                task.unableAt && (

                  <div>

                    <h3 className="
                      font-bold
                      text-red-700
                    ">

                      Unable To Complete

                    </h3>

                    <p className="
                      text-sm
                      text-gray-600
                    ">

                      {
                        task.unableReason
                      }

                    </p>

                  </div>
                )
              }


              {/* ===================================== */}
              {/* =========== RESOLVED =============== */}
              {/* ===================================== */}

              {
                task.resolvedAt && (

                  <div>

                    <h3 className="
                      font-bold
                      text-green-700
                    ">

                      Issue Resolved

                    </h3>

                    <p className="
                      text-sm
                      text-gray-600
                    ">

                      {
                        new Date(
                          task.resolvedAt
                        ).toLocaleString()
                      }

                    </p>

                  </div>
                )
              }

            </div>


            {/* ========================================= */}
            {/* ========= APPROVAL BUTTONS ============== */}
            {/* ========================================= */}

            {
              task.status ===
              "Pending Approval"

              && (

                <div className="
                  flex
                  gap-4
                  mt-6
                ">

                  <button

                    onClick={() =>

                      verifyTask(
                        task._id,
                        "approve"
                      )
                    }

                    className="
                      bg-green-600
                      hover:bg-green-700
                      text-white
                      px-5
                      py-3
                      rounded-xl
                      font-semibold
                    "
                  >

                    Mark Resolved

                  </button>


                  <button

                    onClick={() =>

                      verifyTask(
                        task._id,
                        "reject"
                      )
                    }

                    className="
                      bg-red-600
                      hover:bg-red-700
                      text-white
                      px-5
                      py-3
                      rounded-xl
                      font-semibold
                    "
                  >



                    Reject Resolution

                  </button>

                </div>
              )
            }

          </div>
        ))
      }

    </div>
  );
};

export default JuniorStaffAssigned;