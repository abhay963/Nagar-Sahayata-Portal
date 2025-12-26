import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";

const AddReportForm = ({ currentUser }) => {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [juniorStaffList, setJuniorStaffList] = useState([]);
  const [assigning, setAssigning] = useState(false);

  const [debouncedSearch] = useDebounce(searchTerm, 300);

  // 🔥 Fetch reports on mount
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/reports", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch reports");

        const data = await res.json();
        console.log("Reports fetched:", data);

        // Show all reports
        const departmentReports = data;

        // 🔥 Add location names
        const reportsWithLocation = await Promise.all(
          departmentReports.map(async (report) => {
            if (report.location?.latitude && report.location?.longitude) {
              try {
                const geoRes = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${report.location.latitude}&lon=${report.location.longitude}`
                );
                const geoData = await geoRes.json();
                report.locationName = geoData.display_name || "N/A";
              } catch {
                report.locationName = report.location?.locationn || "N/A";
              }
            } else {
              report.locationName = report.location?.locationn || "N/A";
            }
            return report;
          })
        );

        setReports(reportsWithLocation);
      } catch (err) {
        console.error("Error fetching reports:", err);
        toast.error("Failed to load reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [currentUser]);

  // 🔥 Fetch junior staff on mount
  useEffect(() => {
    const fetchJuniorStaff = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/users/junior-staff", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch junior staff");

        const data = await res.json();
        console.log("Junior staff fetched:", data);
        setJuniorStaffList(data);
      } catch (error) {
        console.error("Failed to fetch junior staff:", error);
        toast.error("Failed to load junior staff list.");
      }
    };

    fetchJuniorStaff();
  }, []);

  // 🔥 Filtering reports
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const locationName = report.locationName || "";

      const matchesSearch =
        report.problemType?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        report.description?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        locationName.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesStatus = statusFilter === "All" || report.status === statusFilter;
      const matchesCategory =
        categoryFilter === "All" || report.problemType === categoryFilter;
      const matchesPriority =
        priorityFilter === "All" || report.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
    });
  }, [reports, debouncedSearch, statusFilter, categoryFilter, priorityFilter]);

  const [formData, setFormData] = useState({ assignedTo: "" });

  // 🔥 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 🔥 Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedReport) {
      toast.error("Please select a problem to assign.");
      return;
    }
    if (!formData.assignedTo) {
      toast.error("Please assign this task to a staff member.");
      return;
    }

    setAssigning(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/reports/assign", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reportId: selectedReport._id,
          assignedTo: formData.assignedTo,
        }),
      });

      if (response.ok) {
        toast.success("Junior staff assigned!");
        setSelectedReport(null);
        setFormData({ assignedTo: "" });

        // Update reports locally
        setReports((prev) =>
          prev.map((r) =>
            r._id === selectedReport._id
              ? { ...r, status: "In Progress", assignedTo: formData.assignedTo }
              : r
          )
        );
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to assign task.");
      }
    } catch (error) {
      console.error("Error assigning task:", error);
      toast.error("An error occurred while assigning the task.");
    } finally {
      setAssigning(false);
    }
  };

  if (loading) return <p className="text-center py-10">Loading reports...</p>;

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 mt-6 max-w-4xl mx-auto text-black">
      <h2 className="text-xl font-bold mb-6 text-center">
        Assign Task to Junior Staff
      </h2>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-3 lg:space-y-0 mb-4">
        <input
          type="text"
          placeholder="Search by issue or location"
          className="p-2 border border-gray-300 rounded-lg w-full lg:w-1/4 bg-white text-black placeholder-black"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="p-2 border border-gray-300 rounded-lg bg-white text-black"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Resolved</option>
        </select>
        <select
          className="p-2 border border-gray-300 rounded-lg bg-white text-black"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option>All</option>
          <option>Road</option>
          <option>Electricity</option>
          <option>Sanitation</option>
          <option>Water</option>
          <option>Environment</option>
          <option>Public Infrastructure</option>
        </select>
        <select
          className="p-2 border border-gray-300 rounded-lg bg-white text-black"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option>All</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>

      {/* Reports Table */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Select a Problem to Assign</h3>
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full text-sm text-black border-collapse rounded-lg overflow-hidden shadow-lg">
            <thead className="bg-green-600 text-white sticky top-0 z-20">
              <tr>
                {["#", "Problem Type", "Location", "Priority", "Status", "Select"].map(
                  (col) => (
                    <th key={col} className="py-3 px-4 text-left font-semibold">
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-400">
                    No reports found.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report, index) => (
                  <tr
                    key={report._id || index}
                    className={`border-b hover:bg-green-50 transition cursor-pointer ${
                      selectedReport?._id === report._id ? "bg-blue-100" : ""
                    }`}
                    onClick={() => setSelectedReport(report)}
                  >
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">{report.problemType}</td>
                    <td className="py-2 px-4">{report.locationName}</td>
                    <td className="py-2 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          report.priority === "High"
                            ? "bg-red-600 text-white"
                            : report.priority === "Medium"
                            ? "bg-yellow-500 text-black"
                            : "bg-green-500 text-white"
                        }`}
                      >
                        {report.priority || "N/A"}
                      </span>
                    </td>
                    <td className="py-2 px-4 font-semibold">
                      {report.status === "Resolved"
                        ? "✅ "
                        : report.status === "Pending"
                        ? "⏳ "
                        : "⚠️ "}
                      {report.status}
                    </td>
                    <td className="py-2 px-4">
                      <input
                        type="radio"
                        name="selectedReport"
                        checked={selectedReport?._id === report._id}
                        onChange={() => setSelectedReport(report)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assignment Form */}
      {selectedReport && (
        <form className="space-y-5" onSubmit={handleSubmit}>
          <h3 className="text-lg font-semibold">Assign Selected Problem</h3>
          <div>
            <p>
              <strong>Selected Problem:</strong> {selectedReport.problemType}
            </p>
            <p>
              <strong>Location:</strong> {selectedReport.locationName}
            </p>
            <p>
              <strong>Description:</strong> {selectedReport.description}
            </p>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Assign To</label>
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg bg-white text-black"
              required
            >
              <option value="" disabled>
                -- Select Junior Staff Member --
              </option>
              {juniorStaffList.map((staff) => (
                <option key={staff._id} value={staff._id}>
                  {staff.name} ({staff.role})
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition w-full"
            disabled={assigning}
          >
            {assigning ? "Assigning..." : "Assign Task"}
          </button>
        </form>
      )}
    </div>
  );
};

export default AddReportForm;
