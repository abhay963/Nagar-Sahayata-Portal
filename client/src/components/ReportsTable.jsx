import React, { useState, useEffect, useMemo } from "react";
import { useDebounce } from "use-debounce";
import axios from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";

const ReportsTable = ({ role, department }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [selectedReport, setSelectedReport] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

  const [debouncedSearch] = useDebounce(searchTerm, 300);

  const isHigherAuthority = role === "Higher Authority";
  const isStaff = role === "Staff";
  const isJuniorStaff = role === "Junior Staff";

  // Fetch Reports
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        let apiUrl = "/api/reports";

        if (isStaff || isJuniorStaff) {
          apiUrl = `/api/reports/department/${department}`;
        }

        const res = await axios.get(apiUrl);
        const reportsData = res.data.reports || [];

        const processedReports = reportsData.map((report) => ({
          ...report,
          locationName: report.location?.locationName || "N/A",
        }));

        setReports(processedReports);
      } catch (error) {
        console.error("❌ Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [role, department, isHigherAuthority, isStaff, isJuniorStaff]);

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

      const matchesStatus = statusFilter === "All" || report.status === statusFilter;
      const matchesCategory = categoryFilter === "All" || report.problemType === categoryFilter;
      const matchesPriority = priorityFilter === "All" || report.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
    });
  }, [sortedReports, debouncedSearch, statusFilter, categoryFilter, priorityFilter]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
        <p className="text-emerald-700 font-medium">Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Reports Management</h2>
            <p className="text-emerald-600 mt-1">
              {isHigherAuthority ? "All Departments" : `Department: ${department}`}
            </p>
          </div>
          <div className="text-sm bg-emerald-100 text-emerald-700 px-4 py-2 rounded-2xl font-medium">
            {filteredReports.length} Reports
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-3xl shadow-xl shadow-emerald-100 p-6 mb-8 border border-emerald-100 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <input
              type="text"
              placeholder="Search by problem, description or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-emerald-50 border border-emerald-100 focus:border-emerald-400 rounded-2xl px-6 py-4 outline-none text-gray-700"
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-emerald-400">🔍</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-emerald-50 border border-emerald-100 focus:border-emerald-400 rounded-2xl px-6 py-4 outline-none cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Resolved">Resolved</option>
            <option value="Declined">Declined</option>
            <option value="Unable">Unable</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-emerald-50 border border-emerald-100 focus:border-emerald-400 rounded-2xl px-6 py-4 outline-none cursor-pointer"
          >
            <option value="All">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-emerald-100">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                <th
                  className="p-5 text-left cursor-pointer hover:bg-emerald-700 transition"
                  onClick={() => handleSort("problemType")}
                >
                  Problem {sortConfig.key === "problemType" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th className="p-5 text-left">Location</th>
                <th
                  className="p-5 text-left cursor-pointer hover:bg-emerald-700 transition"
                  onClick={() => handleSort("priority")}
                >
                  Priority {sortConfig.key === "priority" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th className="p-5 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-20 text-gray-500">
                    No reports found
                  </td>
                </tr>
              ) : (
                filteredReports.map((report, index) => (
                  <motion.tr
                    key={report._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => setSelectedReport(report)}
                    className="border-b border-emerald-100 hover:bg-emerald-50 cursor-pointer transition-all group"
                  >
                    <td className="p-5 font-medium text-gray-900 group-hover:text-emerald-700">
                      {report.problemType}
                    </td>
                    <td className="p-5 text-gray-600">{report.locationName}</td>
                    <td className="p-5">
                      <span
                        className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                          report.priority === "High"
                            ? "bg-red-100 text-red-700"
                            : report.priority === "Medium"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {report.priority}
                      </span>
                    </td>
                    <td className="p-5">
                      <span
                        className={`inline-block px-5 py-1.5 rounded-full text-sm font-medium ${
                          report.status === "Resolved"
                            ? "bg-emerald-100 text-emerald-700"
                            : report.status === "Pending Approval"
                            ? "bg-amber-100 text-amber-700"
                            : report.status === "Declined" || report.status === "Unable"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
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

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedReport && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-lg z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
            >
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-8 relative">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="absolute top-6 right-6 text-4xl hover:scale-110 transition"
                >
                  ×
                </button>
                <h2 className="text-3xl font-bold">{selectedReport.problemType}</h2>
                <p className="text-emerald-100 mt-2">#{selectedReport._id}</p>
              </div>

              <div className="p-8 space-y-6 text-gray-700">
                <div>
                  <strong>Location:</strong> {selectedReport.locationName}
                </div>
                <div>
                  <strong>Assigned To:</strong>{" "}
                  {selectedReport.assignedTo?.name || "Not Assigned"}
                </div>
                <div>
                  <strong>Priority:</strong> {selectedReport.priority}
                </div>
                <div>
                  <strong>Status:</strong> {selectedReport.status}
                </div>

                <div>
                  <strong className="block mb-2">Description</strong>
                  <p className="leading-relaxed">{selectedReport.description}</p>
                </div>

                {selectedReport.imageBase64 && (
                  <div>
                    <p className="font-semibold mb-3">Attachment</p>
                    <img
                      src={`data:image/jpeg;base64,${selectedReport.imageBase64}`}
                      alt="Report"
                      className="w-full rounded-2xl shadow-md cursor-pointer hover:scale-[1.02] transition-transform"
                      onClick={() =>
                        setFullscreenImage(`data:image/jpeg;base64,${selectedReport.imageBase64}`)
                      }
                    />
                  </div>
                )}
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
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              src={fullscreenImage}
              alt="Fullscreen"
              className="max-h-[95%] max-w-[95%] rounded-2xl"
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReportsTable;