import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";

const ActivityLog = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedReport, setSelectedReport] = useState(null);

  const fetchReports = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await axios.get("/api/reports");
      setReports(res.data.reports || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const filteredReports = reports
    .filter((report) => {
      const matchesSearch =
        report.problemType
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        report.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || report.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-emerald-100 text-emerald-700";
      case "Pending Approval":
        return "bg-amber-100 text-amber-700";
      case "Unable":
      case "Unable To Complete":
      case "Declined":
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
      <div className="flex flex-col items-center justify-center py-20 text-emerald-600">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4" />
        <p className="text-lg font-medium">Loading activity logs...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-2xl flex items-center justify-center text-2xl shadow-md">
            📋
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              Activity Logs
            </h2>
            <p className="text-emerald-600 text-sm mt-0.5">
              Higher Authority Monitoring System
            </p>
          </div>
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
              {refreshing ? "⟳" : "↻"}
            </span>
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-emerald-50/60 rounded-2xl p-4 mb-5 border border-emerald-100 flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by problem or description..."
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
          className="bg-white border border-emerald-100 focus:border-emerald-400 rounded-xl px-4 py-3 outline-none cursor-pointer text-sm md:w-64"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Pending Approval">Pending Approval</option>
          <option value="Resolved">Resolved</option>
          <option value="Unable To Complete">Unable To Complete</option>
          <option value="Declined">Declined</option>
        </select>
      </div>

      {/* ===================== SCROLLABLE LIST ===================== */}
      <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
        {/* Fixed Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-semibold">
          <div className="col-span-2">Report ID</div>
          <div className="col-span-5">Problem</div>
          <div className="col-span-2">Department</div>
          <div className="col-span-3">Status</div>
        </div>

        {/* Scrollable Body */}
        <div className="max-h-[420px] overflow-y-auto">
          {filteredReports.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              No matching reports found
            </div>
          ) : (
            filteredReports.map((report, index) => (
              <motion.div
                key={report._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                onClick={() => setSelectedReport(report)}
                className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-emerald-50 hover:bg-emerald-50/70 cursor-pointer transition-colors group"
              >
                <div className="col-span-2 font-mono text-gray-500 text-sm">
                  #{report._id?.slice(-8)}
                </div>

                <div className="col-span-5 font-medium text-gray-900 group-hover:text-emerald-700 transition text-sm line-clamp-2">
                  {report.problemType}
                </div>

                <div className="col-span-2 text-gray-600 text-sm">
                  {report.department || "N/A"}
                </div>

                <div className="col-span-3">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      report.status
                    )}`}
                  >
                    {report.status}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* ===================== DETAIL MODAL ===================== */}
      <AnimatePresence>
        {selectedReport && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Sticky Header */}
              <div className="px-6 md:px-8 py-5 border-b flex justify-between items-start bg-gradient-to-r from-emerald-50 to-white flex-shrink-0">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {selectedReport.problemType}
                  </h2>
                  <p className="text-emerald-600 font-mono mt-1 text-sm">
                    #{selectedReport._id}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-4xl text-gray-400 hover:text-gray-600 transition leading-none"
                >
                  ×
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto flex-1 p-6 md:p-8 space-y-8">
                {/* Description */}
                <p className="text-gray-700 leading-relaxed">
                  {selectedReport.description || "No description provided"}
                </p>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Report Details */}
                  <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                    <h3 className="text-lg font-bold text-emerald-700 mb-4">
                      📋 Report Details
                    </h3>
                    <div className="space-y-3 text-sm">
                      <DetailItem label="Report ID" value={selectedReport.reportId || selectedReport._id} />
                      <DetailItem label="Problem Type" value={selectedReport.problemType} />
                      <DetailItem label="Department" value={selectedReport.department} />
                      <DetailItem label="Priority" value={selectedReport.priority} />
                      <DetailItem label="Status" value={selectedReport.status} />
                      <DetailItem label="City" value={selectedReport.city} />
                    </div>
                  </div>

                  {/* Citizen Details */}
                  <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                    <h3 className="text-lg font-bold text-blue-700 mb-4">
                      👤 Citizen Details
                    </h3>
                    <div className="space-y-3 text-sm">
                      <DetailItem label="Citizen Name" value={selectedReport.citizenName || "Not Available"} />
                      <DetailItem label="Citizen Contact" value={selectedReport.citizenContact || "Not Available"} />
                      <DetailItem
                        label="Location Name"
                        value={
                          selectedReport.location?.locationName ||
                          selectedReport.address ||
                          "Not Available"
                        }
                      />
                      <DetailItem label="Latitude" value={selectedReport.location?.latitude} />
                      <DetailItem label="Longitude" value={selectedReport.location?.longitude} />
                    </div>
                  </div>

                  {/* Assignment Details */}
                  <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100">
                    <h3 className="text-lg font-bold text-purple-700 mb-4">
                      🛡 Assignment Details
                    </h3>
                    <div className="space-y-3 text-sm">
                      <DetailItem label="Assigned To" value={selectedReport.assignedToName || "Not Assigned"} />
                      <DetailItem label="Assigned Department" value={selectedReport.assignedToDepartment || "N/A"} />
                      <DetailItem label="Assigned By" value={selectedReport.assignedByName || "N/A"} />
                      <DetailItem
                        label="Assigned At"
                        value={
                          selectedReport.assignedAt
                            ? new Date(selectedReport.assignedAt).toLocaleString()
                            : "N/A"
                        }
                      />
                    </div>
                  </div>

                  {/* Resolution Details */}
                  <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
                    <h3 className="text-lg font-bold text-green-700 mb-4">
                      ✅ Resolution Details
                    </h3>
                    <div className="space-y-3 text-sm">
                      <DetailItem
                        label="Resolved Description"
                        value={selectedReport.resolvedDescription || "Not Available"}
                      />
                      <DetailItem
                        label="Unable Reason"
                        value={selectedReport.unableReason || "N/A"}
                      />
                      <DetailItem
                        label="Verified At"
                        value={
                          selectedReport.verifiedAt
                            ? new Date(selectedReport.verifiedAt).toLocaleString()
                            : "Not Verified"
                        }
                      />
                      <DetailItem
                        label="Resolved At"
                        value={
                          selectedReport.resolvedAt
                            ? new Date(selectedReport.resolvedAt).toLocaleString()
                            : "Not Resolved"
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedReport.image && (
                    <ImageBlock
                      title="📸 Original Issue"
                      image={selectedReport.image}
                      color="emerald"
                    />
                  )}
                  {selectedReport.resolvedImage && (
                    <ImageBlock
                      title="✅ Resolution Proof"
                      image={selectedReport.resolvedImage}
                      color="green"
                    />
                  )}
                  {selectedReport.unableImage && (
                    <ImageBlock
                      title="❌ Unable Proof"
                      image={selectedReport.unableImage}
                      color="red"
                    />
                  )}
                </div>

                {/* Timeline */}
                <div>
                  <h3 className="text-xl font-semibold mb-6 text-gray-900">
                    Task Timeline
                  </h3>

                  <div className="relative pl-10 py-2">
                    {/* Background Line */}
                    <div className="absolute left-4 top-0 bottom-0 w-1 bg-emerald-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "100%" }}
                        transition={{ duration: 1.8, ease: "easeInOut" }}
                        className="absolute left-0 top-0 w-full bg-emerald-500 rounded-full"
                      />
                    </div>

                    <div className="space-y-10">
                      <AnimatedTimelineItem
                        title="Issue Created"
                        time={selectedReport.createdAt}
                        color="emerald"
                        delay={0.1}
                      />

                      {selectedReport.assignedAt && (
                        <AnimatedTimelineItem
                          title="Assigned to Junior Staff"
                          subtitle={selectedReport.assignedToName}
                          time={selectedReport.assignedAt}
                          color="blue"
                          delay={0.25}
                        />
                      )}

                      {selectedReport.acceptedAt && (
                        <AnimatedTimelineItem
                          title="Task Accepted"
                          time={selectedReport.acceptedAt}
                          color="emerald"
                          delay={0.4}
                        />
                      )}

                      {selectedReport.declinedAt && (
                        <AnimatedTimelineItem
                          title="Task Declined"
                          subtitle={selectedReport.declinedReason}
                          time={selectedReport.declinedAt}
                          color="red"
                          delay={0.5}
                        />
                      )}

                      {selectedReport.submittedForApprovalAt && (
                        <AnimatedTimelineItem
                          title="Submitted For Approval"
                          subtitle={selectedReport.resolvedDescription}
                          time={selectedReport.submittedForApprovalAt}
                          color="amber"
                          delay={0.6}
                        />
                      )}

                      {selectedReport.unableAt && (
                        <AnimatedTimelineItem
                          title="Unable To Complete"
                          subtitle={selectedReport.unableReason}
                          time={selectedReport.unableAt}
                          color="red"
                          delay={0.7}
                        />
                      )}

                      {selectedReport.resolvedAt && (
                        <AnimatedTimelineItem
                          title="Issue Resolved Successfully"
                          time={selectedReport.resolvedAt}
                          color="emerald"
                          delay={0.85}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ======================================================
// HELPER COMPONENTS
// ======================================================

const DetailItem = ({ label, value }) => (
  <div>
    <p className="text-gray-500 text-xs">{label}</p>
    <p className="font-medium text-gray-800">{value || "N/A"}</p>
  </div>
);

const ImageBlock = ({ title, image, color }) => {
  const colorMap = {
    emerald: "text-emerald-800",
    green: "text-green-700",
    red: "text-red-700",
  };

  return (
    <div>
      <p className={`font-semibold mb-2 text-sm ${colorMap[color]}`}>
        {title}
      </p>
      <div
        className="overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer border border-gray-100"
        onClick={() => window.open(image, "_blank")}
      >
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover bg-gray-50 hover:scale-105 transition-transform duration-500"
        />
      </div>
    </div>
  );
};

const AnimatedTimelineItem = ({ title, subtitle, time, color, delay }) => {
  const colorClasses = {
    emerald: "bg-emerald-600",
    blue: "bg-blue-600",
    red: "bg-red-600",
    amber: "bg-amber-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.2, type: "spring", stiffness: 200 }}
        className={`absolute -left-[26px] w-7 h-7 rounded-full border-4 border-white ${colorClasses[color]} flex items-center justify-center shadow-md z-10`}
      >
        <div className="w-2.5 h-2.5 bg-white rounded-full" />
      </motion.div>

      <div className="ml-2">
        <p className="font-semibold text-gray-900">{title}</p>
        {subtitle && (
          <p className="text-gray-600 text-sm mt-1 leading-relaxed">
            {subtitle}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1.5 font-medium">
          {new Date(time).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </div>
    </motion.div>
  );
};

export default ActivityLog;