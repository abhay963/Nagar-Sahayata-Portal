import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";

const ActivityLog = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedReport, setSelectedReport] = useState(null);

  const fetchReports = async () => {
    try {
      const res = await axios.get("/api/reports");
      setReports(res.data.reports);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const filteredReports = reports
    .filter((report) => {
      const matchesSearch =
        report.problemType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || report.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-emerald-600">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-medium">Loading activity logs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-3xl flex items-center justify-center text-3xl shadow-lg">
                📋
              </div>
              <h2 className="text-5xl font-bold text-gray-900 tracking-tight">
                Activity Logs
              </h2>
            </div>
            <p className="text-emerald-600 mt-2 text-xl">Higher Authority Monitoring System</p>
          </div>

          <button
            onClick={fetchReports}
            className="px-6 py-3 bg-white border border-emerald-200 hover:border-emerald-300 rounded-2xl text-sm font-semibold text-emerald-700 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            ↻ Refresh Data
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-3xl shadow shadow-emerald-100 p-6 flex flex-col md:flex-row gap-4 mb-8 border border-emerald-100">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by problem or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-emerald-50 border border-emerald-100 focus:border-emerald-400 rounded-2xl px-6 py-4 outline-none text-gray-700"
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-emerald-400 text-xl">🔍</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-emerald-50 border border-emerald-100 focus:border-emerald-400 rounded-2xl px-6 py-4 outline-none cursor-pointer md:w-72"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Resolved">Resolved</option>
            <option value="Unable">Unable</option>
            <option value="Declined">Declined</option>
          </select>

          <div className="flex items-center text-emerald-700 font-medium whitespace-nowrap px-4">
            {filteredReports.length} Reports
          </div>
        </div>

        {/* Compact List */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-emerald-100">
          <div className="grid grid-cols-12 gap-4 px-8 py-5 bg-emerald-50 text-emerald-700 font-semibold text-sm border-b border-emerald-100">
            <div className="col-span-2">Report ID</div>
            <div className="col-span-5">Problem</div>
            <div className="col-span-2">Department</div>
            <div className="col-span-3">Status</div>
          </div>

          {filteredReports.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              No matching reports found
            </div>
          )}

          {filteredReports.map((report, index) => (
            <motion.div
              key={report._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              onClick={() => setSelectedReport(report)}
              className="grid grid-cols-12 gap-4 px-8 py-6 border-b border-emerald-100 hover:bg-emerald-50 cursor-pointer transition-all group"
            >
              <div className="col-span-2 font-mono text-gray-500">
                #{report._id.slice(-8)}
              </div>
              <div className="col-span-5 font-medium text-gray-900 group-hover:text-emerald-700 transition">
                {report.problemType}
              </div>
             <div className="col-span-2 text-gray-600">
  {report.department}
</div>
              <div className="col-span-3">
                <span
                  className={`inline-flex px-5 py-2 rounded-full text-sm font-medium ${
                    report.status === "Resolved"
                      ? "bg-emerald-100 text-emerald-700"
                      : report.status === "Pending Approval"
                      ? "bg-amber-100 text-amber-700"
                      : report.status === "Unable" || report.status === "Declined"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {report.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {selectedReport && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="px-10 py-7 border-b flex justify-between items-center bg-gradient-to-r from-emerald-50 to-white">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{selectedReport.problemType}</h2>
                  <p className="text-emerald-600 font-mono mt-1">#{selectedReport._id}</p>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-5xl text-gray-400 hover:text-gray-600 transition-all hover:scale-110 cursor-pointer"
                >
                  ×
                </button>
              </div>

              <div className="p-10 overflow-y-auto flex-1">
           
{/* ================= DESCRIPTION ================= */}

<p className="text-gray-700 leading-relaxed text-lg mb-10">
  {selectedReport.description}
</p>


{/* ================= COMPLETE DETAILS ================= */}

<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">

  {/* Report Details */}
  <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100">
    <h3 className="text-xl font-bold text-emerald-700 mb-5">
      📋 Report Details
    </h3>

    <div className="space-y-4 text-sm">

      <div>
        <p className="text-gray-500">Report ID</p>
        <p className="font-semibold">
          {selectedReport.reportId || selectedReport._id}
        </p>
      </div>

      <div>
        <p className="text-gray-500">Problem Type</p>
        <p className="font-semibold">
          {selectedReport.problemType}
        </p>
      </div>

      <div>
        <p className="text-gray-500">Department</p>
        <p className="font-semibold">
          {selectedReport.department}
        </p>
      </div>

      <div>
        <p className="text-gray-500">Priority</p>
        <p className="font-semibold">
          {selectedReport.priority}
        </p>
      </div>

      <div>
        <p className="text-gray-500">Status</p>
        <p className="font-semibold">
          {selectedReport.status}
        </p>
      </div>

      <div>
        <p className="text-gray-500">City</p>
        <p className="font-semibold">
          {selectedReport.city}
        </p>
      </div>

    </div>
  </div>



  {/* Citizen Details */}
  <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100">
    <h3 className="text-xl font-bold text-blue-700 mb-5">
      👤 Citizen Details
    </h3>

    <div className="space-y-4 text-sm">

      <div>
        <p className="text-gray-500">Citizen Name</p>
        <p className="font-semibold">
          {selectedReport.citizenName || "Not Available"}
        </p>
      </div>

      <div>
        <p className="text-gray-500">Citizen Contact</p>
        <p className="font-semibold">
          {selectedReport.citizenContact || "Not Available"}
        </p>
      </div>

      <div>
        <p className="text-gray-500">Location Name</p>
        <p className="font-semibold">
          {selectedReport.location?.locationName || "Not Available"}
        </p>
      </div>

      <div>
        <p className="text-gray-500">Latitude</p>
        <p className="font-semibold">
          {selectedReport.location?.latitude}
        </p>
      </div>

      <div>
        <p className="text-gray-500">Longitude</p>
        <p className="font-semibold">
          {selectedReport.location?.longitude}
        </p>
      </div>

    </div>
  </div>



  {/* Assignment Details */}
  <div className="bg-purple-50 rounded-3xl p-6 border border-purple-100">
    <h3 className="text-xl font-bold text-purple-700 mb-5">
      🛡 Assignment Details
    </h3>

    <div className="space-y-4 text-sm">

      <div>
        <p className="text-gray-500">Assigned To</p>
        <p className="font-semibold">
          {selectedReport.assignedToName || "Not Assigned"}
        </p>
      </div>

      <div>
        <p className="text-gray-500">Assigned Department</p>
        <p className="font-semibold">
          {selectedReport.assignedToDepartment || "N/A"}
        </p>
      </div>

      <div>
        <p className="text-gray-500">Assigned By</p>
        <p className="font-semibold">
          {selectedReport.assignedByName || "N/A"}
        </p>
      </div>

      <div>
        <p className="text-gray-500">Assigned At</p>
        <p className="font-semibold">
          {selectedReport.assignedAt
            ? new Date(selectedReport.assignedAt).toLocaleString()
            : "N/A"}
        </p>
      </div>

    </div>
  </div>



  {/* Resolution Details */}
  <div className="bg-green-50 rounded-3xl p-6 border border-green-100">
    <h3 className="text-xl font-bold text-green-700 mb-5">
      ✅ Resolution Details
    </h3>

    <div className="space-y-4 text-sm">

      <div>
        <p className="text-gray-500">Resolved Description</p>
        <p className="font-semibold">
          {selectedReport.resolvedDescription || "Not Available"}
        </p>
      </div>

      <div>
        <p className="text-gray-500">Unable Reason</p>
        <p className="font-semibold">
          {selectedReport.unableReason || "N/A"}
        </p>
      </div>

      <div>
        <p className="text-gray-500">Verified At</p>
        <p className="font-semibold">
          {selectedReport.verifiedAt
            ? new Date(selectedReport.verifiedAt).toLocaleString()
            : "Not Verified"}
        </p>
      </div>

      <div>
        <p className="text-gray-500">Resolved At</p>
        <p className="font-semibold">
          {selectedReport.resolvedAt
            ? new Date(selectedReport.resolvedAt).toLocaleString()
            : "Not Resolved"}
        </p>
      </div>

    </div>
  </div>

</div>
                {/* Images */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  {selectedReport.image && (
                    <div>
                      <p className="font-semibold mb-3 text-emerald-800 flex items-center gap-2">
                        📸 Original Issue
                      </p>
                      <div className="overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all cursor-pointer">
                        <img
                          src={selectedReport.imageBase64}
                          alt="Original Issue"
                          className="w-full h-auto max-h-[380px] object-contain bg-gray-50 hover:scale-105 transition-transform duration-700"
                          onClick={() => window.open(selectedReport.imageBase64, "_blank")}
                        />
                      </div>
                    </div>
                  )}

                 {selectedReport.resolvedImage&& (
                    <div>
                      <p className="font-semibold mb-3 text-emerald-700 flex items-center gap-2">
                        ✅ Resolution Proof
                      </p>
                      <div className="overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all cursor-pointer">
                        <img
                          src={selectedReport.resolvedImageBase64}
                          alt="Resolution Proof"
                          className="w-full h-auto max-h-[380px] object-contain bg-gray-50 hover:scale-105 transition-transform duration-700"
                          onClick={() => window.open(selectedReport.resolvedImageBase64, "_blank")}
                        />
                      </div>
                    </div>
                  )}

                  { selectedReport.unableImage&& (
                    <div>
                      <p className="font-semibold mb-3 text-red-700 flex items-center gap-2">
                        ❌ Unable Proof
                      </p>
                      <div className="overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all cursor-pointer">
                        <img
                          src={selectedReport.unableImageBase64}
                          alt="Unable Proof"
                          className="w-full h-auto max-h-[380px] object-contain bg-gray-50 hover:scale-105 transition-transform duration-700"
                          onClick={() => window.open(selectedReport.unableImageBase64, "_blank")}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Animated Timeline */}
                <div>
                  <h3 className="text-2xl font-semibold mb-8 text-gray-900">Task Timeline</h3>
                  
                  <div className="relative pl-12">
                    {/* Background Line */}
                    <div className="absolute left-5 top-2 bottom-2 w-1 bg-emerald-100 rounded-full" />

                    {/* Animated Growing Line */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "100%" }}
                      transition={{ duration: 1.4, ease: "easeOut" }}
                      className="absolute left-5 top-2 w-1 bg-emerald-600 rounded-full origin-top"
                    />

                    <div className="space-y-14">
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
                          delay={0.3}
                        />
                      )}

                      {selectedReport.acceptedAt && (
                        <AnimatedTimelineItem 
                          title="Task Accepted" 
                          time={selectedReport.acceptedAt} 
                          color="emerald" 
                          delay={0.5}
                        />
                      )}

                      {selectedReport.declinedAt && (
                        <AnimatedTimelineItem 
                          title="Task Declined" 
                          subtitle={selectedReport.declinedReason} 
                          time={selectedReport.declinedAt} 
                          color="red" 
                          delay={0.6}
                        />
                      )}

                      {selectedReport.submittedForApprovalAt && (
                        <AnimatedTimelineItem 
                          title="Submitted For Approval" 
                          subtitle={selectedReport.resolvedDescription} 
                          time={selectedReport.submittedForApprovalAt} 
                          color="amber" 
                          delay={0.7}
                        />
                      )}

                      {selectedReport.unableAt && (
                        <AnimatedTimelineItem 
                          title="Unable To Complete" 
                          subtitle={selectedReport.unableReason} 
                          time={selectedReport.unableAt} 
                          color="red" 
                          delay={0.8}
                        />
                      )}

                      {selectedReport.resolvedAt && (
                        <AnimatedTimelineItem 
                          title="Issue Resolved Successfully" 
                          time={selectedReport.resolvedAt} 
                          color="emerald" 
                          delay={1}
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

const AnimatedTimelineItem = ({ title, subtitle, time, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.7, delay }}
    className="relative cursor-default"
  >
    {/* Dot */}
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: delay + 0.3, type: "spring", stiffness: 200 }}
      className={`absolute -left-[22px] w-9 h-9 rounded-full border-4 border-white bg-${color}-600 flex items-center justify-center shadow-lg`}
    >
      <div className="w-3.5 h-3.5 bg-white rounded-full" />
    </motion.div>

    <div className="ml-4">
      <p className="font-semibold text-xl text-gray-900">{title}</p>
      {subtitle && <p className="text-gray-600 mt-2 text-[15px] leading-relaxed">{subtitle}</p>}
      <p className="text-sm text-gray-500 mt-3 font-medium">
        {new Date(time).toLocaleString("en-IN", { 
          dateStyle: "medium", 
          timeStyle: "short" 
        })}
      </p>
    </div>
  </motion.div>
);

export default ActivityLog;