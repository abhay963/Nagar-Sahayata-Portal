import React, { useState, useEffect, useMemo } from "react";
import { useDebounce } from "use-debounce";

const ReportsTable = () => {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [selectedReport, setSelectedReport] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

  const [debouncedSearch] = useDebounce(searchTerm, 300);

  // Define the new predefined categories
  const civicDepartments = useMemo(() => ([
    "Public Works",
    "Sanitation",
    "Street Lighting",
    "Parks and Recreation",
    "Water and Drainage",
    "Traffic and Transportation",
    "Urban Planning",
    "Animal Control",
    "Environmental Services",
    "Other",
  ]), []);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/reports");
        const data = await res.json();

        // Process reports: get location name and map problemType to a valid category
        const reportsWithLocation = await Promise.all(
          data.map(async (report) => {
            if (report.location?.latitude && report.location?.longitude) {
              try {
                const geoRes = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${report.location.latitude}&lon=${report.location.longitude}`
                );
                const geoData = await geoRes.json();
                report.locationName = geoData.display_name;
              } catch {
                report.locationName = report.locationn || "N/A";
              }
            } else {
              report.locationName = report.locationn || "N/A";
            }

            // Map existing problemType to the new categories
            const problemType = report.problemType?.toLowerCase() || "";
            if (problemType.includes("road") || problemType.includes("public works") || problemType.includes("road maintenance")) {
              report.mappedProblemType = "Public Works";
            } else if (problemType.includes("sanitation") || problemType.includes("trash")) {
              report.mappedProblemType = "Sanitation";
            } else if (problemType.includes("street lighting") || problemType.includes("lights")) {
              report.mappedProblemType = "Street Lighting";
            } else if (problemType.includes("park") || problemType.includes("recreation")) {
              report.mappedProblemType = "Parks and Recreation";
            } else if (problemType.includes("water") || problemType.includes("drainage")) {
              report.mappedProblemType = "Water and Drainage";
            } else if (problemType.includes("traffic") || problemType.includes("transportation")) {
              report.mappedProblemType = "Traffic and Transportation";
            } else if (problemType.includes("urban planning") || problemType.includes("zoning")) {
              report.mappedProblemType = "Urban Planning";
            } else if (problemType.includes("animal")) {
              report.mappedProblemType = "Animal Control";
            } else if (problemType.includes("environment") || problemType.includes("pollution")) {
              report.mappedProblemType = "Environmental Services";
            } else {
              report.mappedProblemType = "Other";
            }
            return report;
          })
        );

        setReports(reportsWithLocation);
      } catch (err) {
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [civicDepartments]);

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

  const filteredReports = useMemo(() => {
    return sortedReports.filter((report) => {
      const locationName = report.locationn || "";

      const matchesSearch =
        report.problemType?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        report.description?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        locationName.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesStatus = statusFilter === "All" || report.status === statusFilter;
      // Use mappedProblemType for filtering
      const matchesCategory =
        categoryFilter === "All" || report.mappedProblemType === categoryFilter;
      const matchesPriority =
        priorityFilter === "All" || report.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
    });
  }, [sortedReports, debouncedSearch, statusFilter, categoryFilter, priorityFilter]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const openReport = (report) => {
    setSelectedReport(report);
  };

  const closeReport = () => {
    setSelectedReport(null);
  };

  if (loading) return <p className="text-center py-10">Loading reports...</p>;

  return (
    <div className="bg-white shadow-md rounded-2xl p-5 text-black">
      <h2 className="text-2xl font-bold mb-4">Reported Issues</h2>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-3 lg:space-y-0 mb-4">
        <input
          type="text"
          placeholder="Search by issue or location"
          className="p-2 border border-gray-300 rounded-lg w-full lg:w-1/4 bg-white text-black placeholder-black"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ caretColor: "black" }}
        />
        <select
          className="p-2 border border-gray-300 rounded-lg bg-white text-black"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
        <select
          className="p-2 border border-gray-300 rounded-lg bg-white text-black"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All">All Categories</option>
          {civicDepartments.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select
          className="p-2 border border-gray-300 rounded-lg bg-white text-black"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="All">All Priorities</option>
          <option value="Normal">Normal</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg">
        <table className="w-full text-sm text-black border-collapse rounded-lg overflow-hidden shadow-lg">
          <thead className="bg-green-600 text-white sticky top-0 z-20">
            <tr>
              {[{ label: "#", key: "" },
                { label: "Problem Type", key: "mappedProblemType" },
                { label: "Location", key: "locationName" },
                { label: "Priority", key: "priority" },
                { label: "Status", key: "status" }].map((col) => (
                <th
                  key={col.label}
                  className="py-3 px-4 text-left font-semibold cursor-pointer"
                  onClick={() => col.key && handleSort(col.key)}
                >
                  {col.label}{" "}
                  {sortConfig.key === col.key ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredReports.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-400">
                  No reports found.
                </td>
              </tr>
            ) : (
              filteredReports.map((report, index) => (
                <tr
                  key={report._id || index}
                  className={`border-b hover:bg-green-50 transition cursor-pointer ${
                    report.priority === "high" ? "animate-pulse bg-red-50" : ""
                  }`}
                  onClick={() => openReport(report)}
                >
                  <td className="py-2 px-4">{index + 1}</td>
                  {/* Use mappedProblemType for display */}
                  <td className="py-2 px-4">{report.mappedProblemType}</td>
                  <td className="py-2 px-4">{report.locationName}</td>
                  <td className="py-2 px-4">
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          report.priority === "high"
                            ? "bg-red-600 text-white"
                            : report.priority === "medium"
                            ? "bg-yellow-500 text-black"
                            : report.priority === "Normal"
                            ? "bg-green-500 text-white"
                            : "bg-gray-500 text-white"
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedReport && (
        <div className="fixed inset-0 flex items-center justify-center z-40 pt-16 p-4">
          {/* Soft tricolor overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-300 via-white to-green-300 transition-opacity duration-500"></div>

          {/* Modal card */}
          <div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl
                         bg-white p-6 sm:p-8 z-50 transform transition-all duration-300 ease-out"
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-red-600 hover:text-red-800 text-2xl font-bold cursor-pointer transition-colors duration-300"
              onClick={closeReport}
            >
              ✖
            </button>

            {/* Header */}
            <h3 className="text-3xl font-extrabold mb-6 text-center text-green-900">
              {selectedReport.mappedProblemType}
            </h3>

            {/* Image */}
            {(selectedReport.imageUri || selectedReport.imageBase64) && (
              <img
                src={
                  selectedReport.imageUri
                    ? selectedReport.imageUri
                    : `data:image/jpeg;base64,${selectedReport.imageBase64}`
                }
                alt={selectedReport.problemType}
                className="w-full h-52 sm:h-64 object-cover rounded-xl mb-6 border border-green-300 shadow-md cursor-zoom-in transition-transform duration-500 hover:scale-105"
                onClick={() =>
                  setFullscreenImage(
                    selectedReport.imageUri ||
                      `data:image/jpeg;base64,${selectedReport.imageBase64}`
                  )
                }
              />
            )}

            {/* Report details */}
            <div className="space-y-3 text-gray-800">
              <p><strong>Location:</strong> {selectedReport.locationName}</p>
              <p><strong>Status:</strong> {selectedReport.status}</p>
              <p><strong>Priority:</strong> {selectedReport.priority}</p>
              <p><strong>Description:</strong> {selectedReport.description}</p>
              <p>
                <strong>Coordinates:</strong>{" "}
                {selectedReport.location?.latitude && selectedReport.location?.longitude
                  ? `${selectedReport.location.latitude.toFixed(6)}, ${selectedReport.location.longitude.toFixed(6)}`
                  : "N/A"}
              </p>
              <p><strong>Date:</strong> {new Date(selectedReport.timestamp).toLocaleDateString()}</p>
            </div>

            {/* View on Map button */}
            {selectedReport.location?.latitude && selectedReport.location?.longitude && (
              <div className="mt-6 text-center">
                <a
                  href={`https://www.google.com/maps?q=${selectedReport.location.latitude},${selectedReport.location.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-2 bg-green-600 text-white rounded-full shadow hover:bg-green-700 transition-colors duration-300"
                >
                  View on Map
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fullscreen Image with Zoom */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-60"
          onClick={() => setFullscreenImage(null)}
        >
          <FullscreenImageModal
            image={fullscreenImage}
            onClose={() => setFullscreenImage(null)}
          />
        </div>
      )}
    </div>
  );
};

// Fullscreen Image Component with Zoom and Drag
const FullscreenImageModal = ({ image, onClose }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Reset zoom and position when opening new image
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [image]);

  // 🔍 Zoom in/out with mouse scroll
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomSpeed = 0.1;
    setScale((prevScale) => {
      let newScale = prevScale + (e.deltaY < 0 ? zoomSpeed : -zoomSpeed);
      return Math.min(Math.max(newScale, 1), 5); // Limit between 1x and 5x
    });
  };

  // 🖱️ Start dragging
  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setStartDrag({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  // 🖱️ Dragging
  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - startDrag.x,
        y: e.clientY - startDrag.y,
      });
    }
  };

  // 🖱️ Stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 🔄 Double click to reset
  const handleDoubleClick = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
      onWheel={handleWheel}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDoubleClick={handleDoubleClick}
    >
      <img
        src={image}
        alt="Fullscreen"
        className="max-w-full max-h-full object-contain select-none"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transition: isDragging ? "none" : "transform 0.2s ease",
          cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in",
        }}
        onMouseDown={handleMouseDown}
        draggable={false} // Prevent default drag image behavior
      />
      <button
        className="absolute top-4 right-4 text-white text-2xl font-bold cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        ✖
      </button>
    </div>
  );
};


export default ReportsTable;