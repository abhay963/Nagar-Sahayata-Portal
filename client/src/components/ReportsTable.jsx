import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useDebounce } from "use-debounce";
import axios from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";

const ReportsTable = ({ role, department }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [selectedReport, setSelectedReport] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

  const [debouncedSearch] = useDebounce(searchTerm, 300);

  // Role checks
  const isHigherAuthority =
    role === "Higher Authority" ||
    role === "Admin" ||
    role === "Super Admin";

  // Fetch reports
  const fetchReports = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await axios.get("/api/reports");
      const reportsData = res.data.reports || [];

      const processedReports = reportsData.map((report) => ({
        ...report,
        locationName:
          report.location?.locationName || report.address || "N/A",
      }));

      setReports(processedReports);
    } catch (error) {
      console.error("❌ Error fetching reports:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [role, fetchReports]);

  // Sorting
  const sortedReports = useMemo(() => {
    let sortable = [...reports];
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        let aVal = a[sortConfig.key] || "";
        let bVal = b[sortConfig.key] || "";
        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [reports, sortConfig]);

  // Filtering
  const filteredReports = useMemo(() => {
    return sortedReports.filter((report) => {
      const matchesSearch =
        report.problemType?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        report.description?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        report.locationName?.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || report.status === statusFilter;
      const matchesPriority =
        priorityFilter === "All" || report.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [sortedReports, debouncedSearch, statusFilter, priorityFilter]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical":
        return "bg-red-200 text-red-800";
      case "High":
        return "bg-red-100 text-red-700";
      case "Medium":
        return "bg-amber-100 text-amber-700";
      case "Normal":
        return "bg-emerald-100 text-emerald-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-emerald-100 text-emerald-700";
      case "Pending Approval":
        return "bg-amber-100 text-amber-700";
      case "Declined":
      case "Unable To Complete":
        return "bg-red-100 text-red-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Pending":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
        <p className="text-emerald-700 font-medium">Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            Reports Management
          </h2>
          <p className="text-emerald-600 mt-1 text-sm">
            {isHigherAuthority
              ? "All Departments"
              : `Department: ${department || "N/A"}`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm bg-emerald-100 text-emerald-700 px-4 py-2 rounded-2xl font-medium">
            {filteredReports.length} Reports
          </div>

          <button
            onClick={() => fetchReports(true)}
            disabled={refreshing}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-4 py-2 rounded-2xl font-medium transition-all text-sm shadow-sm"
          >
            <span className={refreshing ? "animate-spin inline-block" : ""}>
              {refreshing ? "⟳" : "🔄"}
            </span>
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-emerald-50/60 rounded-2xl p-4 mb-5 border border-emerald-100 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="md:col-span-2 relative">
          <input
            type="text"
            placeholder="Search by problem, description or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-emerald-100 focus:border-emerald-400 rounded-xl px-5 py-3 outline-none text-gray-700 text-sm"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 text-sm">
            🔍
          </span>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-emerald-100 focus:border-emerald-400 rounded-xl px-4 py-3 outline-none cursor-pointer text-sm"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Pending Approval">Pending Approval</option>
          <option value="Resolved">Resolved</option>
          <option value="Declined">Declined</option>
          <option value="Unable To Complete">Unable To Complete</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="bg-white border border-emerald-100 focus:border-emerald-400 rounded-xl px-4 py-3 outline-none cursor-pointer text-sm"
        >
          <option value="All">All Priority</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Normal">Normal</option>
        </select>
      </div>

      {/* ===================== SCROLLABLE TABLE CONTAINER ===================== */}
      <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
        {/* Fixed header */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                <th
                  className="p-4 text-left text-sm font-semibold cursor-pointer hover:bg-emerald-700/80 transition"
                  onClick={() => handleSort("problemType")}
                >
                  Problem{" "}
                  {sortConfig.key === "problemType" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th className="p-4 text-left text-sm font-semibold">Location</th>
                <th
                  className="p-4 text-left text-sm font-semibold cursor-pointer hover:bg-emerald-700/80 transition"
                  onClick={() => handleSort("priority")}
                >
                  Priority{" "}
                  {sortConfig.key === "priority" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th className="p-4 text-left text-sm font-semibold">Status</th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Scrollable body */}
        <div className="max-h-[420px] overflow-y-auto">
          <table className="w-full">
            <tbody>
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-16 text-gray-500">
                    No reports found
                  </td>
                </tr>
              ) : (
                filteredReports.map((report, index) => (
                  <motion.tr
                    key={report._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => setSelectedReport(report)}
                    className="border-b border-emerald-50 hover:bg-emerald-50/70 cursor-pointer transition-colors group"
                  >
                    <td className="p-4 font-medium text-gray-900 group-hover:text-emerald-700 text-sm">
                      {report.problemType}
                    </td>
                    <td className="p-4 text-gray-600 text-sm">
                      {report.locationName}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                          report.priority
                        )}`}
                      >
                        {report.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          report.status
                        )}`}
                      >
                        {report.status}
                      </span>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================== DETAIL MODAL ===================== */}
      <AnimatePresence>
        {selectedReport && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Sticky Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 relative flex-shrink-0">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="absolute top-5 right-5 text-3xl hover:scale-110 transition leading-none"
                >
                  ×
                </button>
                <h2 className="text-2xl md:text-3xl font-bold pr-10">
                  {selectedReport.problemType}
                </h2>
                <p className="text-emerald-100 mt-1 text-sm">
                  Status: {selectedReport.status}
                </p>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto flex-1 p-6 md:p-8 space-y-8 text-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                  <div>
                    <strong>Problem Type:</strong> {selectedReport.problemType}
                  </div>
                  <div>
                    <strong>Department:</strong>{" "}
                    {selectedReport.department || "N/A"}
                  </div>
                  <div>
                    <strong>City:</strong> {selectedReport.city || "N/A"}
                  </div>
                  <div>
                    <strong>Location:</strong> {selectedReport.locationName}
                  </div>
                  <div>
                    <strong>Priority:</strong>{" "}
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${getPriorityColor(
                        selectedReport.priority
                      )}`}
                    >
                      {selectedReport.priority}
                    </span>
                  </div>
                  <div>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${getStatusColor(
                        selectedReport.status
                      )}`}
                    >
                      {selectedReport.status}
                    </span>
                  </div>
                  <div>
                    <strong>Citizen Name:</strong>{" "}
                    {selectedReport.citizenName || "N/A"}
                  </div>
                  <div>
                    <strong>Citizen Contact:</strong>{" "}
                    {selectedReport.citizenContact || "N/A"}
                  </div>
                  <div>
                    <strong>Assigned To:</strong>{" "}
                    {selectedReport.assignedToName || "Not Assigned"}
                  </div>
                  <div>
                    <strong>Assigned By:</strong>{" "}
                    {selectedReport.assignedByName || "N/A"}
                  </div>
                  <div>
                    <strong>Assigned Department:</strong>{" "}
                    {selectedReport.assignedToDepartment || "N/A"}
                  </div>
                  <div>
                    <strong>Created At:</strong>{" "}
                    {selectedReport.createdAt
                      ? new Date(selectedReport.createdAt).toLocaleString()
                      : "N/A"}
                  </div>
                  <div>
                    <strong>Assigned At:</strong>{" "}
                    {selectedReport.assignedAt
                      ? new Date(selectedReport.assignedAt).toLocaleString()
                      : "N/A"}
                  </div>
                  <div>
                    <strong>Accepted At:</strong>{" "}
                    {selectedReport.acceptedAt
                      ? new Date(selectedReport.acceptedAt).toLocaleString()
                      : "N/A"}
                  </div>
                  <div>
                    <strong>Resolved At:</strong>{" "}
                    {selectedReport.resolvedAt
                      ? new Date(selectedReport.resolvedAt).toLocaleString()
                      : "N/A"}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <strong className="block mb-2 text-base">Description</strong>
                  <p className="leading-relaxed bg-emerald-50 p-4 rounded-2xl text-sm">
                    {selectedReport.description || "No description provided"}
                  </p>
                </div>

                {/* Images */}
                <div className="space-y-5">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    🖼 Report Attachments
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {selectedReport.image && (
                      <div className="bg-white border border-emerald-100 rounded-2xl overflow-hidden shadow-sm">
                        <div className="px-4 py-3 bg-emerald-50 border-b border-emerald-100">
                          <h4 className="font-semibold text-emerald-700 text-sm">
                            📸 Original Issue Image
                          </h4>
                        </div>
                        <div className="p-3">
                          <img
                            src={selectedReport.image}
                            alt="Original"
                            onClick={() =>
                              setFullscreenImage(selectedReport.image)
                            }
                            className="w-full h-56 object-cover rounded-xl cursor-pointer hover:scale-[1.02] transition-transform"
                          />
                        </div>
                      </div>
                    )}

                    {selectedReport.resolvedImage && (
                      <div className="bg-white border border-green-100 rounded-2xl overflow-hidden shadow-sm">
                        <div className="px-4 py-3 bg-green-50 border-b border-green-100">
                          <h4 className="font-semibold text-green-700 text-sm">
                            ✅ Resolution Proof
                          </h4>
                        </div>
                        <div className="p-3">
                          <img
                            src={selectedReport.resolvedImage}
                            alt="Resolved"
                            onClick={() =>
                              setFullscreenImage(selectedReport.resolvedImage)
                            }
                            className="w-full h-56 object-cover rounded-xl cursor-pointer hover:scale-[1.02] transition-transform"
                          />
                        </div>
                      </div>
                    )}

                    {selectedReport.unableImage && (
                      <div className="bg-white border border-red-100 rounded-2xl overflow-hidden shadow-sm">
                        <div className="px-4 py-3 bg-red-50 border-b border-red-100">
                          <h4 className="font-semibold text-red-700 text-sm">
                            ❌ Unable Completion Proof
                          </h4>
                        </div>
                        <div className="p-3">
                          <img
                            src={selectedReport.unableImage}
                            alt="Unable"
                            onClick={() =>
                              setFullscreenImage(selectedReport.unableImage)
                            }
                            className="w-full h-56 object-cover rounded-xl cursor-pointer hover:scale-[1.02] transition-transform"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {!selectedReport.image &&
                    !selectedReport.resolvedImage &&
                    !selectedReport.unableImage && (
                      <p className="text-gray-500 italic text-sm">
                        No attachments available
                      </p>
                    )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Fullscreen Image */}
      <AnimatePresence>
        {fullscreenImage && (
          <div
            className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4"
            onClick={() => setFullscreenImage(null)}
          >
            <motion.img
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              src={fullscreenImage}
              alt="Fullscreen"
              className="max-h-[95%] max-w-[95%] rounded-2xl object-contain"
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReportsTable;