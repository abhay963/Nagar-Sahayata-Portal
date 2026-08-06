import React, { useEffect, useState, useMemo } from "react";
import axios from "../api/axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMapPin,
  FiCheckCircle,
  FiXCircle,
  FiCalendar,
  FiX,
  FiImage,
  FiUpload,
  FiRefreshCw,
  FiLayers,
} from "react-icons/fi";

const AcceptedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [taskInputs, setTaskInputs] = useState({});
  const [selectedTask, setSelectedTask] = useState(null);
  const [updating, setUpdating] = useState(false);

  // ================= FETCH =================
  const fetchTasks = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await axios.get("/api/reports/my-assigned-tasks");
      const acceptedTasks = (res.data.reports || []).filter(
        (task) => task.status === "In Progress"
      );
      setTasks(acceptedTasks);

      if (isRefresh) toast.success("Tasks refreshed");
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ================= SORT (newest first) =================
  const sortedTasks = useMemo(() => {
    return [...tasks].sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );
  }, [tasks]);

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
    if (diffHours < 24) return `${diffHours}h ago`;
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

  // ================= IMAGE =================
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) return reject("No file selected");
      if (!file.type.startsWith("image/")) return reject("Only image files allowed");
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = async (e, taskId) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      const base64 = await convertToBase64(file);
      setTaskInputs((prev) => ({
        ...prev,
        [taskId]: { ...prev[taskId], imageBase64: base64, file },
      }));
    } catch (error) {
      toast.error("Failed to upload image");
    }
  };

  const handleDescriptionChange = (value, taskId) => {
    setTaskInputs((prev) => ({
      ...prev,
      [taskId]: { ...prev[taskId], description: value },
    }));
  };

  // ================= UPDATE =================
  const updateTask = async (reportId, action) => {
    try {
      const currentTask = taskInputs[reportId];
      if (!currentTask?.description || !currentTask?.file) {
        return toast.error("Please add description and image");
      }

      setUpdating(true);
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("reportId", reportId);
      formData.append("action", action);
      formData.append("description", currentTask.description);

      if (action === "resolved") formData.append("resolvedImage", currentTask.file);
      if (action === "unable") formData.append("unableImage", currentTask.file);

      await axios.put("/api/reports/update-task-progress", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Task updated successfully");
      setTaskInputs((prev) => ({
        ...prev,
        [reportId]: { description: "", imageBase64: "", file: null },
      }));
      setSelectedTask(null);
      fetchTasks(true);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update task");
    } finally {
      setUpdating(false);
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-emerald-700 mt-5 text-lg font-medium">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 pb-16">
      {/* ================= HEADER ================= */}
      <div className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-emerald-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Accepted Tasks
            </h1>
            <p className="text-emerald-600 text-sm font-medium mt-0.5">
              In Progress · Click any card to update
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Refresh Button */}
            <button
              onClick={() => fetchTasks(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 text-emerald-700 font-semibold rounded-2xl transition disabled:opacity-60 shadow-sm"
            >
              <FiRefreshCw
                size={18}
                className={refreshing ? "animate-spin" : ""}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>

            {/* Count Badge */}
            <div className="px-5 py-2.5 bg-emerald-100 text-emerald-700 rounded-2xl text-sm font-semibold flex items-center gap-2">
              <FiLayers size={16} />
              {sortedTasks.length} Active
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN ================= */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        {sortedTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-emerald-100 rounded-3xl p-16 text-center shadow-xl"
          >
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheckCircle className="text-4xl text-emerald-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              No Active Tasks
            </h3>
            <p className="text-gray-500 mb-6">
              You're all caught up! Accept new tasks and click Refresh.
            </p>
            <button
              onClick={() => fetchTasks(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl transition"
            >
              <FiRefreshCw size={18} />
              Refresh Now
            </button>
          </motion.div>
        ) : (
          /* Scrollable Container */
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-emerald-100 shadow-inner p-4 sm:p-5">
            <div className="overflow-y-auto max-h-[72vh] pr-2 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {sortedTasks.map((task, index) => (
                  <motion.div
                    key={task._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    onClick={() => setSelectedTask(task)}
                    className="bg-white rounded-2xl overflow-hidden shadow-md border border-emerald-100 hover:shadow-xl hover:border-emerald-300 transition-all duration-300 cursor-pointer group"
                  >
                    {/* Image */}
                    {task.image ? (
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={task.image}
                          alt="Issue"
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full shadow">
                            IN PROGRESS
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="h-40 bg-emerald-50 flex items-center justify-center relative">
                        <FiImage className="text-4xl text-emerald-300" />
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full shadow">
                            IN PROGRESS
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-emerald-700 transition">
                        {task.problemType}
                      </h3>
                      <p className="text-gray-500 text-sm mt-2 line-clamp-2 leading-relaxed">
                        {task.description || "No description"}
                      </p>

                      <div className="mt-4 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <FiCalendar className="text-amber-500" />
                          <span className="font-medium text-gray-700">
                            {formatRelativeTime(task.createdAt)}
                          </span>
                        </div>
                        <span className="text-emerald-600 font-semibold group-hover:underline">
                          Update →
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===================== POPUP ===================== */}
      <AnimatePresence>
        {selectedTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedTask(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-white">
                <div>
                  <div className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full mb-2">
                    IN PROGRESS
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedTask.problemType}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-gray-100 flex items-center justify-center transition shadow-sm"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="overflow-y-auto flex-1 px-6 py-5 custom-scrollbar">
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-500 mb-1">
                    Original Issue
                  </h4>
                  <p className="text-gray-800 leading-relaxed">
                    {selectedTask.description}
                  </p>
                </div>

                {selectedTask.image && (
                  <div className="mb-6 rounded-2xl overflow-hidden border border-gray-100">
                    <img
                      src={selectedTask.image}
                      alt="Issue"
                      className="w-full max-h-52 object-cover"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 mb-8 text-sm">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="text-gray-500 text-xs mb-1">Date</div>
                    <div className="font-medium text-gray-800">
                      {formatFullDate(selectedTask.createdAt)}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="text-gray-500 text-xs mb-1">Location</div>
                    <div className="font-medium text-gray-800 truncate">
                      {selectedTask.location?.locationName || "Unknown"}
                    </div>
                  </div>
                </div>

                {/* Form */}
                <div className="space-y-5 border-t border-gray-100 pt-6">
                  <h3 className="text-lg font-bold text-gray-900">
                    Update Progress
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-emerald-700 mb-2">
                      Work Description *
                    </label>
                    <textarea
                      placeholder="Describe what you did or the current status..."
                      value={taskInputs[selectedTask._id]?.description || ""}
                      onChange={(e) =>
                        handleDescriptionChange(e.target.value, selectedTask._id)
                      }
                      className="w-full h-28 border border-emerald-200 focus:border-emerald-500 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition resize-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-700 mb-2">
                      Progress Photo *
                    </label>
                    <label className="block border-2 border-dashed border-emerald-200 hover:border-emerald-400 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-emerald-50/40">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, selectedTask._id)}
                        className="hidden"
                      />
                      {taskInputs[selectedTask._id]?.imageBase64 ? (
                        <div>
                          <img
                            src={taskInputs[selectedTask._id].imageBase64}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-xl mx-auto border border-emerald-200 mb-3"
                          />
                          <p className="text-emerald-700 font-medium text-sm">
                            ✓ Image Selected (click to change)
                          </p>
                        </div>
                      ) : (
                        <div>
                          <FiUpload className="text-3xl text-emerald-500 mx-auto mb-2" />
                          <p className="text-emerald-700 font-medium text-sm">
                            Upload Before / After Photo
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 px-6 py-5 bg-gray-50 flex gap-3">
                <button
                  onClick={() => updateTask(selectedTask._id, "resolved")}
                  disabled={updating}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-2xl transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <FiCheckCircle size={18} />
                  {updating ? "Updating..." : "Mark as Resolved"}
                </button>

                <button
                  onClick={() => updateTask(selectedTask._id, "unable")}
                  disabled={updating}
                  className="flex-1 bg-white border-2 border-red-200 hover:border-red-400 text-gray-700 hover:text-red-600 font-semibold py-3.5 rounded-2xl transition flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <FiXCircle size={18} />
                  Can't Complete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Scrollbar */}
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

export default AcceptedTasks;