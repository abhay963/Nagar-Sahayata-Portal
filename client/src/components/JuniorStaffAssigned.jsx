import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const JuniorStaffAssigned = () => {
  // ======================================================
  // STATES
  // ======================================================

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedTask, setSelectedTask] = useState(null);

  // ======================================================
  // FETCH TASKS
  // ======================================================

  const fetchTasks = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const res = await axios.get(
        "/api/reports/staff-assigned-tasks"
      );

      setTasks(res.data.reports || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ======================================================
  // VERIFY TASK
  // ======================================================

  const verifyTask = async (reportId, action) => {
    try {
      await axios.put(
        "/api/reports/verify-task-resolution",
        {
          reportId,
          action,
        }
      );

      toast.success(`Task ${action}d successfully`);

      await fetchTasks();

      if (selectedTask?._id === reportId) {
        setSelectedTask(null);
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
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
  // CLOSE MODAL WITH ESCAPE
  // ======================================================

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSelectedTask(null);
      }
    };

    if (selectedTask) {
      document.addEventListener(
        "keydown",
        handleEscape
      );
    }

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [selectedTask]);

  // ======================================================
  // FILTERING
  // ======================================================

  const filteredTasks = tasks
    .filter((task) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        task.problemType
          ?.toLowerCase()
          .includes(search) ||
        task.description
          ?.toLowerCase()
          .includes(search) ||
        task.assignedToName
          ?.toLowerCase()
          .includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        task.status === statusFilter;

      return matchesSearch && matchesStatus;
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
      <div className="flex flex-col items-center justify-center py-20 text-emerald-600">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4" />

        <p className="text-lg font-medium">
          Loading assigned tasks...
        </p>
      </div>
    );
  }

  // ======================================================
  // MAIN UI
  // ======================================================

  return (
    <div className="w-full">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-2xl flex items-center justify-center text-2xl shadow-md">
            👷
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              Junior Staff Tasks
            </h2>

            <p className="text-emerald-600 text-sm mt-0.5">
              Review & Verify Assigned Tasks
            </p>
          </div>

        </div>

        <div className="flex items-center gap-3">

          <div className="text-sm bg-emerald-100 text-emerald-700 px-4 py-2 rounded-2xl font-medium">
            {filteredTasks.length} Tasks
          </div>

          <button
            onClick={() => fetchTasks(true)}
            disabled={refreshing}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-4 py-2 rounded-2xl font-medium transition-all text-sm shadow-sm"
          >
            <span
              className={
                refreshing
                  ? "animate-spin inline-block"
                  : ""
              }
            >
              {refreshing ? "⟳" : "↻"}
            </span>

            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>

        </div>

      </div>

      {/* ==================================================
          FILTERS
      ================================================== */}

      <div className="bg-emerald-50/60 rounded-2xl p-4 mb-5 border border-emerald-100 flex flex-col md:flex-row gap-3">

        <div className="flex-1 relative">

          <input
            type="text"
            placeholder="Search by problem, description or staff..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            className="w-full bg-white border border-emerald-100 focus:border-emerald-400 rounded-xl px-5 py-3 outline-none text-gray-700 text-sm"
          />

          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 text-sm">
            🔍
          </span>

        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          className="bg-white border border-emerald-100 focus:border-emerald-400 rounded-xl px-4 py-3 outline-none cursor-pointer text-sm md:w-64"
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

      </div>

      {/* ==================================================
          TASK LIST
      ================================================== */}

      <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">

        {/* TABLE HEADER */}

        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-semibold">

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

        {/* TABLE BODY */}

        <div className="max-h-[420px] overflow-y-auto">

          {filteredTasks.length === 0 ? (

            <div className="text-center py-16 text-gray-500">
              No matching tasks found
            </div>

          ) : (

            filteredTasks.map(
              (task, index) => (

                <motion.div
                  key={task._id}
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.02,
                  }}
                  onClick={() =>
                    setSelectedTask(task)
                  }
                  className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-emerald-50 hover:bg-emerald-50/70 cursor-pointer transition-colors group"
                >

                  <div className="col-span-2 font-mono text-gray-500 text-sm">
                    #{task._id?.slice(-8)}
                  </div>

                  <div className="col-span-4 font-medium text-gray-900 group-hover:text-emerald-700 transition text-sm line-clamp-2">
                    {task.problemType}
                  </div>

                  <div className="col-span-2 text-gray-600 truncate text-sm">
                    {task.assignedToName ||
                      "N/A"}
                  </div>

                  <div className="col-span-2 text-gray-600 text-sm">
                    {task.department ||
                      "N/A"}
                  </div>

                  <div className="col-span-2">

                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
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
            )

          )}

        </div>

      </div>

      {/* ==================================================
          DETAIL MODAL
      ================================================== */}

      <AnimatePresence>

        {selectedTask && (

          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3"
            onMouseDown={(e) => {
              if (
                e.target === e.currentTarget
              ) {
                setSelectedTask(null);
              }
            }}
          >

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.96,
                y: 15,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.96,
                y: 15,
              }}
              transition={{
                duration: 0.2,
              }}

              /* ===============================
                 SMALLER MODAL
                 =============================== */

              className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
            >

              {/* ==================================================
                  MODAL HEADER
              ================================================== */}

              <div className="px-5 py-4 border-b bg-gradient-to-r from-emerald-50 to-white flex justify-between items-start flex-shrink-0">

                <div className="min-w-0">

                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 truncate">
                    {selectedTask.problemType}
                  </h2>

                  <p className="text-emerald-600 font-mono mt-0.5 text-xs">
                    #{selectedTask._id?.slice(-8)}
                  </p>

                </div>

                <button
                  onClick={() =>
                    setSelectedTask(null)
                  }
                  className="ml-3 w-9 h-9 flex items-center justify-center rounded-full text-2xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition flex-shrink-0"
                >
                  ×
                </button>

              </div>

              {/* ==================================================
                  SCROLLABLE CONTENT
              ================================================== */}

              <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">

                {/* DESCRIPTION */}

                <div>

                  <p className="text-gray-700 text-sm leading-relaxed">
                    {selectedTask.description ||
                      "No description provided"}
                  </p>

                </div>

                {/* ==================================================
                    IMAGES
                ================================================== */}

                {(selectedTask.image ||
                  selectedTask.resolvedImage ||
                  selectedTask.unableImage) && (

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                    {selectedTask.image && (
                      <ImageCard
                        title="📸 Original Issue"
                        image={
                          selectedTask.image
                        }
                      />
                    )}

                    {selectedTask.resolvedImage && (
                      <ImageCard
                        title="✅ Resolution Proof"
                        image={
                          selectedTask.resolvedImage
                        }
                      />
                    )}

                    {selectedTask.unableImage && (
                      <ImageCard
                        title="❌ Unable Proof"
                        image={
                          selectedTask.unableImage
                        }
                      />
                    )}

                  </div>

                )}

                {/* ==================================================
                    RESOLUTION DESCRIPTION
                ================================================== */}

                {selectedTask.resolvedDescription && (

                  <div className="bg-emerald-50 px-4 py-3 rounded-xl">

                    <h3 className="font-semibold text-emerald-700 mb-1 text-sm">
                      Resolution Description
                    </h3>

                    <p className="text-gray-700 text-sm">
                      {
                        selectedTask.resolvedDescription
                      }
                    </p>

                  </div>

                )}

                {/* ==================================================
                    UNABLE REASON
                ================================================== */}

                {selectedTask.unableReason && (

                  <div className="bg-red-50 px-4 py-3 rounded-xl">

                    <h3 className="font-semibold text-red-700 mb-1 text-sm">
                      Unable To Complete Reason
                    </h3>

                    <p className="text-gray-700 text-sm">
                      {
                        selectedTask.unableReason
                      }
                    </p>

                  </div>

                )}

              </div>

              {/* ==================================================
                  ACTION BUTTONS
                  ALWAYS AT BOTTOM
              ================================================== */}

              {selectedTask.status ===
                "Pending Approval" && (

                <div className="p-4 border-t bg-gray-50 flex flex-col sm:flex-row gap-2 flex-shrink-0">

                  <button
                    onClick={() =>
                      verifyTask(
                        selectedTask._id,
                        "approve"
                      )
                    }
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-3 rounded-xl font-semibold text-sm transition-all active:scale-[0.98]"
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
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 px-3 rounded-xl font-semibold text-sm transition-all active:scale-[0.98]"
                  >
                    ❌ Reject & Move Back
                  </button>

                </div>

              )}

              {/* ==================================================
                  UNABLE TO COMPLETE BUTTONS
              ================================================== */}

              {selectedTask.status ===
                "Unable To Complete" && (

                <div className="p-4 border-t bg-red-50 flex flex-col sm:flex-row gap-2 flex-shrink-0">

                  <button
                    onClick={() =>
                      verifyTask(
                        selectedTask._id,
                        "reassign"
                      )
                    }
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-3 rounded-xl font-semibold text-sm transition-all"
                  >
                    🔄 Reassign Again
                  </button>

                  <button
                    onClick={() =>
                      verifyTask(
                        selectedTask._id,
                        "move-to-pending"
                      )
                    }
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2.5 px-3 rounded-xl font-semibold text-sm transition-all"
                  >
                    📌 Move To Pending
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

const ImageCard = ({ title, image }) => (
  <div className="min-w-0">

    <p className="font-semibold mb-1.5 text-gray-800 text-xs truncate">
      {title}
    </p>

    <div
      className="overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100"
      onClick={() =>
        window.open(image, "_blank")
      }
    >

      <img
        src={image}
        alt="Task"
        className="w-full h-28 sm:h-24 object-cover bg-gray-50 hover:scale-105 transition-transform duration-300"
      />

    </div>

  </div>
);

export default JuniorStaffAssigned;