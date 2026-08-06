import React, { useEffect, useState, useMemo } from "react";
import axios from "../api/axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  FiMapPin,
  FiCheckCircle,
  FiXCircle,
  FiUser,
  FiAlertTriangle,
  FiCalendar,
  FiLayers,
  FiRefreshCw,
  FiFilter,
  FiArrowDown,
  FiArrowUp,
} from "react-icons/fi";

const JuniorStaffTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  // Filter & Sort states
  const [showPendingOnly, setShowPendingOnly] = useState(true); // default = Pending
  const [sortNewestFirst, setSortNewestFirst] = useState(true); // default = newest first

  // ================= FETCH =================
  const fetchTasks = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const response = await axios.get("/api/reports/my-assigned-tasks");
      setTasks(response.data.reports || []);

      if (isRefresh) toast.success("Tasks refreshed");
    } catch (error) {
      console.error("❌ Failed to fetch tasks:", error);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ================= FILTER + SORT =================
  const displayedTasks = useMemo(() => {
    let filtered = [...tasks];

    // Filter: Pending only (Staff Assigned)
    if (showPendingOnly) {
      filtered = filtered.filter((task) => task.status === "Staff Assigned");
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return sortNewestFirst ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [tasks, showPendingOnly, sortNewestFirst]);

  // ================= HELPERS =================
  const formatRelativeTime = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatFullDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ================= ACCEPT =================
  const handleAccept = async (reportId) => {
    try {
      setProcessingId(reportId);
      await axios.put("/api/reports/respond-task", {
        reportId,
        action: "accept",
      });
      toast.success("Task accepted successfully");
      setTasks((prev) =>
        prev.map((task) =>
          task._id === reportId
            ? { ...task, status: "In Progress", acceptedAt: new Date() }
            : task
        )
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to accept task");
    } finally {
      setProcessingId(null);
    }
  };

  // ================= DECLINE =================
  const handleDecline = async (reportId) => {
    try {
      setProcessingId(reportId);
      await axios.put("/api/reports/respond-task", {
        reportId,
        action: "decline",
      });
      toast.success("Task declined");
      setTasks((prev) => prev.filter((task) => task._id !== reportId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to decline task");
    } finally {
      setProcessingId(null);
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col gap-5 mb-6">
          {/* Title Row */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                My Assigned Tasks
              </h2>
              <p className="text-emerald-600 mt-1 text-sm">
                {showPendingOnly ? "Showing pending tasks only" : "Showing all tasks"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Refresh */}
              <button
                onClick={() => fetchTasks(true)}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 text-emerald-700 font-semibold rounded-2xl transition disabled:opacity-60 shadow-sm text-sm"
              >
                <FiRefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>

              {/* Count */}
              <div className="bg-white border border-emerald-100 shadow-sm text-emerald-700 px-4 py-2.5 rounded-2xl font-semibold text-sm flex items-center gap-2">
                <FiLayers className="text-emerald-500" />
                {displayedTasks.length} Task{displayedTasks.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>

          {/* Filter & Sort Buttons */}
          <div className="flex flex-wrap gap-3">
            {/* Pending Filter Toggle */}
            <button
              onClick={() => setShowPendingOnly((prev) => !prev)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-sm transition shadow-sm border ${
                showPendingOnly
                  ? "bg-amber-100 border-amber-300 text-amber-800"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <FiFilter size={16} />
              {showPendingOnly ? "Pending Only" : "Show All"}
            </button>

            {/* Sort by Date Toggle */}
            <button
              onClick={() => setSortNewestFirst((prev) => !prev)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 text-emerald-700 font-semibold rounded-2xl transition shadow-sm text-sm"
            >
              {sortNewestFirst ? (
                <>
                  <FiArrowDown size={16} />
                  Newest First
                </>
              ) : (
                <>
                  <FiArrowUp size={16} />
                  Oldest First
                </>
              )}
            </button>
          </div>
        </div>

        {/* ================= EMPTY STATE ================= */}
        {displayedTasks.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl border border-emerald-50 p-12 sm:p-16 text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <FiCheckCircle className="text-3xl text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">
              {showPendingOnly ? "No Pending Tasks" : "No Assigned Tasks"}
            </h3>
            <p className="text-gray-500 mt-2">
              {showPendingOnly
                ? "You have no pending tasks right now. Try showing all or refresh."
                : "You currently have no tasks assigned."}
            </p>
            <div className="flex justify-center gap-3 mt-6">
              {showPendingOnly && (
                <button
                  onClick={() => setShowPendingOnly(false)}
                  className="px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-2xl text-sm transition"
                >
                  Show All Tasks
                </button>
              )}
              <button
                onClick={() => fetchTasks(true)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl text-sm transition flex items-center gap-2"
              >
                <FiRefreshCw size={15} />
                Refresh
              </button>
            </div>
          </div>
        ) : (
          /* ========== SCROLLABLE CONTAINER ========== */
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-emerald-100 shadow-inner p-4 sm:p-5">
            <div className="overflow-y-auto max-h-[68vh] pr-2 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {displayedTasks.map((task, index) => (
                  <motion.div
                    key={task._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03, duration: 0.3 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-md border border-emerald-100 hover:shadow-lg hover:border-emerald-200 transition-all duration-300 flex flex-col"
                  >
                    {/* IMAGE */}
                    {task.image && (
                      <div className="relative group">
                        <img
                          src={task.image}
                          alt="Issue"
                          onClick={() => setFullscreenImage(task.image)}
                          className="w-full h-44 object-cover cursor-pointer transition duration-300 group-hover:scale-[1.03]"
                        />
                      </div>
                    )}

                    {/* CONTENT */}
                    <div className="p-5 flex flex-col flex-1">
                      {/* TITLE + PRIORITY */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="text-lg font-bold text-gray-900 leading-snug">
                          {task.problemType}
                        </h3>
                        <span
                          className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-bold ${
                            task.priority === "High"
                              ? "bg-red-100 text-red-700"
                              : task.priority === "Medium"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>

                      {/* DESCRIPTION */}
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
                        {task.description || "No description provided."}
                      </p>

                      {/* META */}
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <FiAlertTriangle className="text-emerald-600 shrink-0" size={15} />
                          <span>
                            <span className="font-medium text-gray-700">Status:</span>{" "}
                            <span
                              className={`font-semibold ${
                                task.status === "In Progress"
                                  ? "text-blue-600"
                                  : task.status === "Staff Assigned"
                                  ? "text-amber-600"
                                  : "text-gray-700"
                              }`}
                            >
                              {task.status}
                            </span>
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <FiUser className="text-blue-500 shrink-0" size={15} />
                          <span>
                            <span className="font-medium text-gray-700">Assigned By:</span>{" "}
                            {task.assignedByName || "N/A"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <FiMapPin className="text-red-500 shrink-0" size={15} />
                          <span className="truncate">
                            <span className="font-medium text-gray-700">Location:</span>{" "}
                            {task.location?.locationName || "Unknown"}
                          </span>
                        </div>

                        {/* DATE */}
                        <div className="flex items-start gap-2 bg-gray-50 rounded-xl px-3 py-2">
                          <FiCalendar className="text-amber-500 shrink-0 mt-0.5" size={15} />
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-800 text-sm">
                              {formatRelativeTime(task.createdAt)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatFullDate(task.createdAt)}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 pt-1">
                          <span>
                            <strong className="text-gray-600">Dept:</strong> {task.department || "—"}
                          </span>
                          <span>
                            <strong className="text-gray-600">City:</strong> {task.city || "—"}
                          </span>
                        </div>
                      </div>

                      {/* MAP BUTTON */}
                      {task.location?.latitude && (
                        <button
                          onClick={() =>
                            window.open(
                              `https://www.google.com/maps/search/?api=1&query=${task.location.latitude},${task.location.longitude}`,
                              "_blank"
                            )
                          }
                          className="w-full mb-3 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2.5 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2"
                        >
                          <FiMapPin size={15} />
                          View Location
                        </button>
                      )}

                      {/* ACTION BUTTONS */}
                      {task.status === "Staff Assigned" && (
                        <div className="flex gap-2.5 mt-auto">
                          <button
                            onClick={() => handleAccept(task._id)}
                            disabled={processingId === task._id}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-semibold text-sm transition disabled:opacity-50 flex items-center justify-center gap-1.5"
                          >
                            <FiCheckCircle size={15} />
                            {processingId === task._id ? "..." : "Accept"}
                          </button>

                          <button
                            onClick={() => handleDecline(task._id)}
                            disabled={processingId === task._id}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl font-semibold text-sm transition disabled:opacity-50 flex items-center justify-center gap-1.5"
                          >
                            <FiXCircle size={15} />
                            {processingId === task._id ? "..." : "Decline"}
                          </button>
                        </div>
                      )}

                      {/* ACCEPTED INFO */}
                      {task.status === "In Progress" && task.acceptedAt && (
                        <div className="mt-auto pt-2 bg-emerald-50 text-emerald-700 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2">
                          <FiCheckCircle size={13} />
                          Accepted {formatRelativeTime(task.acceptedAt)}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FULLSCREEN IMAGE */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setFullscreenImage(null)}
        >
          <img
            src={fullscreenImage}
            alt="Fullscreen"
            className="max-h-[92%] max-w-[92%] rounded-2xl shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Custom scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #ecfdf5;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6ee7b7;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #34d399;
        }
      `}</style>
    </div>
  );
};

export default JuniorStaffTasks;