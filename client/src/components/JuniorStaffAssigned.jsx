import React, {
  useEffect,
  useState,
} from "react";

import axios from "../api/axios";
import { toast } from "react-toastify";
import {
  motion,
  AnimatePresence,
} from "framer-motion";

const JuniorStaffAssigned = () => {

  // ======================================================
  // STATES
  // ======================================================

  const [tasks, setTasks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [selectedTask, setSelectedTask] =
    useState(null);

  // ======================================================
  // FETCH TASKS
  // ======================================================

  const fetchTasks = async () => {

    try {

      setLoading(true);

      const res = await axios.get(
        "/api/reports/staff-assigned-tasks"
      );

      setTasks(
        res.data.reports || []
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
  // VERIFY TASK
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

      if (
        selectedTask?._id === reportId
      ) {

        setSelectedTask(null);

      }

    } catch (error) {

      console.error(error);

      toast.error(
        error?.response?.data
          ?.message ||
        "Failed to verify task"
      );
    }
  };

  // ======================================================
  // USE EFFECT
  // ======================================================

  useEffect(() => {

    fetchTasks();

  }, []);

  // ======================================================
  // FILTERING
  // ======================================================

  const filteredTasks = tasks

    .filter((task) => {

      const matchesSearch =

        task.problemType
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          )

        ||

        task.description
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          )

        ||

        task.assignedToName
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );

      const matchesStatus =

        statusFilter === "All"

          ||

        task.status ===
          statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    })

    .sort(
      (a, b) =>

        new Date(b.createdAt) -

        new Date(a.createdAt)
    );

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {

    return (

      <div className="flex flex-col items-center justify-center min-h-[70vh] text-emerald-600">

        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4" />

        <p className="text-lg font-medium">
          Loading assigned tasks...
        </p>

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 p-6">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">

          <div>

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-3xl flex items-center justify-center text-3xl shadow-lg">

                👷

              </div>

              <h2 className="text-5xl font-bold text-gray-900 tracking-tight">

                Junior Staff Tasks

              </h2>

            </div>

            <p className="text-emerald-600 mt-2 text-xl">

              Review & Verify Assigned Tasks

            </p>

          </div>

          <button
            onClick={fetchTasks}

            className="px-6 py-3 bg-white border border-emerald-200 hover:border-emerald-300 rounded-2xl text-sm font-semibold text-emerald-700 flex items-center gap-2 transition-all active:scale-95"
          >

            ↻ Refresh

          </button>

        </div>

        {/* FILTERS */}

        <div className="bg-white rounded-3xl shadow shadow-emerald-100 p-6 flex flex-col md:flex-row gap-4 mb-8 border border-emerald-100">

          <div className="flex-1 relative">

            <input
              type="text"

              placeholder="Search by problem, description or staff..."

              value={searchTerm}

              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }

              className="w-full bg-emerald-50 border border-emerald-100 focus:border-emerald-400 rounded-2xl px-6 py-4 outline-none text-gray-700"
            />

            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-emerald-400 text-xl">

              🔍

            </span>

          </div>

          <select
            value={statusFilter}

            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }

            className="bg-emerald-50 border border-emerald-100 focus:border-emerald-400 rounded-2xl px-6 py-4 outline-none cursor-pointer md:w-72"
          >

            <option value="All">
              All Status
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="In Progress">
              In Progress
            </option>

            <option value="Pending Approval">
              Pending Approval
            </option>

            <option value="Resolved">
              Resolved
            </option>

            <option value="Unable To Complete">
              Unable To Complete
            </option>

          </select>

          <div className="flex items-center text-emerald-700 font-medium whitespace-nowrap px-4">

            {filteredTasks.length} Tasks

          </div>

        </div>

        {/* TABLE */}

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-emerald-100">

          <div className="grid grid-cols-12 gap-4 px-8 py-5 bg-emerald-50 text-emerald-700 font-semibold text-sm border-b border-emerald-100">

            <div className="col-span-2">
              Task ID
            </div>

            <div className="col-span-4">
              Problem
            </div>

            <div className="col-span-2">
              Junior Staff
            </div>

            <div className="col-span-2">
              Department
            </div>

            <div className="col-span-2">
              Status
            </div>

          </div>

          {filteredTasks.length === 0 && (

            <div className="text-center py-20 text-gray-500">

              No matching tasks found

            </div>
          )}

          {filteredTasks.map(
            (task, index) => (

              <motion.div
                key={task._id}

                initial={{
                  opacity: 0,
                  y: 10,
                }}

                animate={{
                  opacity: 1,
                  y: 0,
                }}

                transition={{
                  delay:
                    index * 0.04,
                }}

                onClick={() =>
                  setSelectedTask(task)
                }

                className="grid grid-cols-12 gap-4 px-8 py-6 border-b border-emerald-100 hover:bg-emerald-50 cursor-pointer transition-all group"
              >

                <div className="col-span-2 font-mono text-gray-500">

                  #{task._id?.slice(-8)}

                </div>

                <div className="col-span-4 font-medium text-gray-900 group-hover:text-emerald-700 transition line-clamp-2">

                  {task.problemType}

                </div>

                <div className="col-span-2 text-gray-600 truncate">

                  {task.assignedToName ||
                    "N/A"}

                </div>

                <div className="col-span-2 text-gray-600">

                  {task.department}

                </div>

                <div className="col-span-2">

                  <span
                    className={`inline-flex px-5 py-2 rounded-full text-sm font-medium ${
                      task.status ===
                      "Resolved"

                        ? "bg-emerald-100 text-emerald-700"

                        : task.status ===
                          "Pending Approval"

                        ? "bg-amber-100 text-amber-700"

                        : task.status ===
                          "Unable To Complete"

                        ? "bg-red-100 text-red-700"

                        : "bg-blue-100 text-blue-700"
                    }`}
                  >

                    {task.status}

                  </span>

                </div>

              </motion.div>
            )
          )}

        </div>

      </div>

      {/* MODAL */}

      <AnimatePresence>

        {selectedTask && (

          <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50 flex items-center justify-center p-4">

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 40,
              }}

              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}

              exit={{
                opacity: 0,
                scale: 0.95,
                y: 40,
              }}

              className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden max-h-[96vh] flex flex-col"
            >

              {/* HEADER */}

              <div className="px-10 py-7 border-b flex justify-between items-start bg-gradient-to-r from-emerald-50 to-white">

                <div>

                  <h2 className="text-3xl font-bold text-gray-900">

                    {selectedTask.problemType}

                  </h2>

                  <p className="text-emerald-600 font-mono mt-1">

                    #{selectedTask._id?.slice(-8)}

                  </p>

                </div>

                <button
                  onClick={() =>
                    setSelectedTask(null)
                  }

                  className="text-5xl text-gray-400 hover:text-gray-600 transition-all hover:scale-110"
                >

                  ×

                </button>

              </div>

              {/* CONTENT */}

              <div className="overflow-y-auto flex-1 p-10 space-y-10">

                <p className="text-gray-700 leading-relaxed text-lg">

                  {selectedTask.description}

                </p>

                {/* IMAGES */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                  {selectedTask.image && (

                    <ImageCard
                      title="📸 Original Issue"
                      image={selectedTask.image}
                    />
                  )}

                  {selectedTask.resolvedImage && (

                    <ImageCard
                      title="✅ Resolution Proof"
                      image={selectedTask.resolvedImage}
                    />
                  )}

                  {selectedTask.unableImage && (

                    <ImageCard
                      title="❌ Unable Proof"
                      image={selectedTask.unableImage}
                    />
                  )}

                </div>

                {/* DESCRIPTIONS */}

                {selectedTask.resolvedDescription && (

                  <div className="bg-emerald-50 p-6 rounded-3xl">

                    <h3 className="font-semibold text-emerald-700 mb-3">

                      Resolution Description

                    </h3>

                    <p className="text-gray-700">

                      {
                        selectedTask.resolvedDescription
                      }

                    </p>

                  </div>
                )}

                {selectedTask.unableReason && (

                  <div className="bg-red-50 p-6 rounded-3xl">

                    <h3 className="font-semibold text-red-700 mb-3">

                      Unable To Complete Reason

                    </h3>

                    <p className="text-gray-700">

                      {
                        selectedTask.unableReason
                      }

                    </p>

                  </div>
                )}

              </div>

              {/* ACTIONS */}

              {selectedTask.status ===
                "Pending Approval" && (

                <div className="p-8 border-t bg-gray-50 flex gap-4">

                  <button
                    onClick={() =>
                      verifyTask(
                        selectedTask._id,
                        "approve"
                      )
                    }

                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-semibold transition-all active:scale-[0.985]"
                  >

                    ✅ Mark as Resolved

                  </button>

                  <button
                    onClick={() =>
                      verifyTask(
                        selectedTask._id,
                        "reject"
                      )
                    }

                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-semibold transition-all active:scale-[0.985]"
                  >

                    ❌ Reject & Move Back to In Progress

                  </button>

                </div>
              )}

            </motion.div>

          </div>
        )}

      </AnimatePresence>

    </div>
  );
};

// ======================================================
// IMAGE CARD
// ======================================================

const ImageCard = ({
  title,
  image,
}) => (

  <div>

    <p className="font-semibold mb-3 text-gray-800">

      {title}

    </p>

    <div
      className="overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all cursor-pointer"

      onClick={() =>
        window.open(image, "_blank")
      }
    >

      <img
        src={image}

        alt="Task"

        className="w-full h-auto max-h-[340px] object-contain bg-gray-50 hover:scale-105 transition-transform duration-700"
      />

    </div>

  </div>
);

export default JuniorStaffAssigned;