import React, {
  useState,
  useEffect,
  useMemo,
} from "react";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";
import axios from "../api/axios";
import {
  Search,
  RefreshCw,
  UserPlus,
  MapPin,
  AlertCircle,
  CheckCircle2,
  X,
  FileText,
  Clock,
  Tag,
  AlignLeft,
  Image as ImageIcon,
} from "lucide-react";

const AddReportForm = ({ currentUser }) => {
  // ======================================================
  // ===================== STATES =========================
  // ======================================================
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [selectedReport, setSelectedReport] = useState(null); // opens the single modal
  const [loading, setLoading] = useState(true);
  const [juniorStaffList, setJuniorStaffList] = useState([]);
  const [assigning, setAssigning] = useState(false);
  const [formData, setFormData] = useState({
    assignedTo: "",
  });
  const [debouncedSearch] = useDebounce(searchTerm, 300);
  const [refreshing, setRefreshing] = useState(false);

  // ======================================================
  // ================= FETCH REPORTS ======================
  // ======================================================
  const fetchReports = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await axios.get(
        `/api/reports/department/${currentUser.department}`
      );

      console.log("📄 Department Reports:", response.data);

      const reportsData = response.data.reports || [];

      const reportsWithLocation = reportsData.map((report) => ({
        ...report,
        locationName:
          report.location?.locationName || "Unknown Location",
      }));

      const pendingReports = reportsWithLocation.filter(
        (report) => report.status === "Pending"
      );

      setReports(pendingReports);
    } catch (error) {
      console.error("❌ Error fetching reports:", error);
      toast.error("Failed to load reports.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (currentUser?.department) {
      fetchReports();
    }
  }, [currentUser]);

  // ======================================================
  // ========== FETCH SAME DEPARTMENT JUNIOR STAFF =======
  // ======================================================
  useEffect(() => {
    const fetchJuniorStaff = async () => {
      try {
        const response = await axios.get(
          `/api/users/junior-staff/${currentUser.department}`
        );

        console.log("👷 Junior Staff:", response.data);

        const staffData = response.data.users || [];

        setJuniorStaffList(
          Array.isArray(staffData) ? staffData : []
        );
      } catch (error) {
        console.error("❌ Failed to fetch staff:", error);
        toast.error("Failed to load junior staff.");
      }
    };

    if (currentUser?.department) {
      fetchJuniorStaff();
    }
  }, [currentUser]);

  // ======================================================
  // ================= FILTER REPORTS =====================
  // ======================================================
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const locationName =
        report.locationName?.toLowerCase() || "";

      const matchesSearch =
        report.problemType
          ?.toLowerCase()
          .includes(debouncedSearch.toLowerCase()) ||
        report.description
          ?.toLowerCase()
          .includes(debouncedSearch.toLowerCase()) ||
        locationName.includes(debouncedSearch.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || report.status === statusFilter;

      const matchesCategory =
        categoryFilter === "All" ||
        report.problemType === categoryFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        report.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory &&
        matchesPriority
      );
    });
  }, [
    reports,
    debouncedSearch,
    statusFilter,
    categoryFilter,
    priorityFilter,
  ]);

  // ======================================================
  // ================= HANDLE INPUT =======================
  // ======================================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ======================================================
  // ================= ASSIGN REPORT ======================
  // ======================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedReport) {
      toast.error("Select report first");
      return;
    }

    if (!formData.assignedTo) {
      toast.error("Select junior staff");
      return;
    }

    try {
      setAssigning(true);

      await axios.put("/api/reports/assign", {
        reportId: selectedReport._id,
        assignedTo: formData.assignedTo,
      });

      toast.success("Task assigned successfully!");

      setReports((prev) =>
        prev.map((report) =>
          report._id === selectedReport._id
            ? {
                ...report,
                status: "Staff Assigned",
                assignedTo: formData.assignedTo,
              }
            : report
        )
      );

      setSelectedReport(null);
      setFormData({
        assignedTo: "",
      });
    } catch (error) {
      console.error("❌ Assignment error:", error);
      toast.error(
        error.response?.data?.message || "Failed to assign task"
      );
    } finally {
      setAssigning(false);
    }
  };

  // ======================================================
  // ===================== LOADING ========================
  // ======================================================
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-medium">Loading reports...</p>
      </div>
    );
  }

  // ======================================================
  // ======================= UI ===========================
  // ======================================================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Assign Report
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Click any report to view full details & assign
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchReports(true)}
          disabled={refreshing}
          className="
            inline-flex items-center gap-2
            px-4 py-2.5
            rounded-xl
            bg-white
            border border-emerald-200
            text-emerald-700
            font-medium text-sm
            shadow-sm
            hover:bg-emerald-50 hover:border-emerald-300
            active:scale-[0.98]
            transition-all
            disabled:opacity-60 disabled:cursor-not-allowed
          "
        >
          <RefreshCw
            className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by problem, description or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="
            w-full
            pl-10 pr-4 py-3
            rounded-xl
            border border-gray-200
            bg-gray-50/50
            text-sm
            placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500
            transition
          "
        />
      </div>

      {/* Reports Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white">
                <th className="px-4 py-3.5 text-left font-semibold">Problem</th>
                <th className="px-4 py-3.5 text-left font-semibold">Location</th>
                <th className="px-4 py-3.5 text-left font-semibold">Priority</th>
                <th className="px-4 py-3.5 text-left font-semibold">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-12">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <AlertCircle className="w-8 h-8 opacity-50" />
                      <p className="font-medium">No pending reports found</p>
                      <p className="text-xs">Try adjusting your search or refresh</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr
                    key={report._id}
                    onClick={() => {
                      setSelectedReport(report);
                      setFormData({ assignedTo: "" });
                    }}
                    className="cursor-pointer transition-colors hover:bg-emerald-50/70"
                  >
                    <td className="px-4 py-3.5 font-medium text-gray-900">
                      {report.problemType}
                    </td>
                    <td className="px-4 py-3.5 text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate max-w-[180px]">
                          {report.locationName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`
                          inline-flex px-2.5 py-1 rounded-full text-xs font-medium
                          ${
                            report.priority === "High"
                              ? "bg-red-100 text-red-700"
                              : report.priority === "Medium"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-sky-100 text-sky-700"
                          }
                        `}
                      >
                        {report.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                        {report.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================== SINGLE MODAL (Details + Assign) ===================== */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              setSelectedReport(null);
              setFormData({ assignedTo: "" });
            }}
          />

          {/* Modal */}
          <div className="
            relative z-10
            w-full max-w-lg
            max-h-[90vh]
            bg-white
            rounded-3xl
            shadow-2xl
            flex flex-col
            overflow-hidden
          ">
            {/* Sticky Header */}
            <div className="
              shrink-0
              bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600
              px-6 py-5
              flex items-start justify-between
            ">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white/15 backdrop-blur-sm">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Report Details
                  </h3>
                  <p className="text-xs text-white/80 mt-0.5">
                    View full info & assign to junior staff
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedReport(null);
                  setFormData({ assignedTo: "" });
                }}
                className="
                  p-2 rounded-xl
                  bg-white/10 hover:bg-white/20
                  text-white
                  transition
                "
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Image (if available) */}
              {(selectedReport.image || selectedReport.images?.[0] || selectedReport.photo) && (
                <div className="rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                  <img
                    src={
                      selectedReport.image ||
                      selectedReport.images?.[0] ||
                      selectedReport.photo
                    }
                    alt="Report"
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}

              {/* Problem Type */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Problem Type
                  </p>
                  <p className="text-base font-semibold text-gray-900 mt-0.5">
                    {selectedReport.problemType}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Location
                  </p>
                  <p className="text-base font-semibold text-gray-900 mt-0.5">
                    {selectedReport.locationName}
                  </p>
                </div>
              </div>

              {/* Priority & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Priority
                    </p>
                    <span
                      className={`
                        inline-flex mt-1 px-2.5 py-1 rounded-full text-xs font-medium
                        ${
                          selectedReport.priority === "High"
                            ? "bg-red-100 text-red-700"
                            : selectedReport.priority === "Medium"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-sky-100 text-sky-700"
                        }
                      `}
                    >
                      {selectedReport.priority}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Status
                    </p>
                    <span className="inline-flex mt-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                      {selectedReport.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                  <AlignLeft className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Description
                  </p>
                  <p className="text-sm text-gray-700 mt-1 leading-relaxed whitespace-pre-wrap">
                    {selectedReport.description || "No description provided."}
                  </p>
                </div>
              </div>

              {/* Extra fields (any additional data the report may have) */}
              {selectedReport.createdAt && (
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    Reported on:{" "}
                    {new Date(selectedReport.createdAt).toLocaleString()}
                  </p>
                </div>
              )}

              {selectedReport.reportedBy && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Reported By
                  </p>
                  <p className="text-sm text-gray-700">
                    {typeof selectedReport.reportedBy === "object"
                      ? selectedReport.reportedBy.name || selectedReport.reportedBy.email
                      : selectedReport.reportedBy}
                  </p>
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-gray-100 pt-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-gray-900">
                      Assign to Junior Staff
                    </h4>
                    <p className="text-xs text-gray-500">
                      Select a staff member to handle this report
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Assign To
                    </label>
                    <select
                      name="assignedTo"
                      value={formData.assignedTo}
                      onChange={handleChange}
                      className="
                        w-full
                        px-4 py-3
                        rounded-xl
                        border border-gray-200
                        bg-white
                        text-sm
                        focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500
                        transition
                      "
                      required
                    >
                      <option value="">Select Junior Staff</option>
                      {juniorStaffList.map((staff) => (
                        <option key={staff._id} value={staff._id}>
                          {staff.name} - {staff.department}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={assigning}
                    className="
                      w-full
                      inline-flex items-center justify-center gap-2
                      px-6 py-3
                      rounded-xl
                      bg-gradient-to-r from-green-600 to-emerald-600
                      text-white font-semibold text-sm
                      shadow-md shadow-emerald-600/20
                      hover:from-green-700 hover:to-emerald-700
                      active:scale-[0.98]
                      transition-all
                      disabled:opacity-60 disabled:cursor-not-allowed
                    "
                  >
                    {assigning ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Assigning...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Assign Task
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddReportForm;