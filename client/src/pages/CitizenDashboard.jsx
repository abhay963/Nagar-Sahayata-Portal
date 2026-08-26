import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { createReport, getReports } from "../services/reportService";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import MapSection from "../components/MapSection";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import {
  FileText,
  CheckCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  MapPin,
  Camera,
  AlertCircle,
  ChevronRight,
  Send,
  X,
  User,
  PlusCircle,
  Briefcase,
  AlertTriangle,
} from "lucide-react";

/* =========================================================
   LOCATION PICKER MAP
========================================================= */

const DEFAULT_MAP_CENTER = [23.3441, 85.3096];

const LocationClickHandler = ({ onSelect }) => {
  useMapEvents({
    click(event) {
      onSelect(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
};

const MapCenterUpdater = ({ latitude, longitude }) => {
  const map = useMap();

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      map.setView([latitude, longitude], Math.max(map.getZoom(), 16), {
        animate: true,
      });
    }
  }, [latitude, longitude, map]);

  return null;
};

const LocationPickerModal = ({
  open,
  latitude,
  longitude,
  onSelect,
  onConfirm,
  onClose,
}) => {
  if (!open) return null;

  const mapCenter =
    latitude !== null && longitude !== null
      ? [latitude, longitude]
      : DEFAULT_MAP_CENTER;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          className="relative z-10 w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="px-5 py-4 sm:px-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                Select Complaint Location
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Click anywhere on the map to place the complaint location.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="relative h-[55vh] min-h-[360px] w-full">
            <MapContainer
              center={mapCenter}
              zoom={latitude !== null ? 16 : 13}
              scrollWheelZoom
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <LocationClickHandler onSelect={onSelect} />

              <MapCenterUpdater
                latitude={latitude}
                longitude={longitude}
              />

              {latitude !== null && longitude !== null && (
                <CircleMarker
                  center={[latitude, longitude]}
                  radius={10}
                  pathOptions={{
                    color: "#059669",
                    fillColor: "#10b981",
                    fillOpacity: 0.8,
                    weight: 3,
                  }}
                />
              )}
            </MapContainer>

            <div className="absolute top-4 left-4 z-[500] bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 px-4 py-3 max-w-xs">
              <p className="text-xs font-semibold text-gray-800">
                📍 Click the map
              </p>
              <p className="text-[11px] text-gray-500 mt-1">
                Select the exact place where the civic issue exists.
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50">
            {latitude !== null && longitude !== null ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                    Selected Location
                  </p>

                  <p className="text-sm font-semibold text-gray-800 mt-1 break-all">
                    Latitude: {latitude.toFixed(6)} &nbsp;•&nbsp; Longitude:{" "}
                    {longitude.toFixed(6)}
                  </p>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold text-sm hover:bg-gray-100 transition cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={onConfirm}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition cursor-pointer shadow-md"
                  >
                    Use This Location
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-sm text-gray-500">
                  No location selected yet. Click on the map.
                </p>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold text-sm hover:bg-gray-100 transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

/* =========================================================
   WELCOME BANNER
========================================================= */

const WelcomeBanner = ({ user, reports }) => {
  const currentHour = new Date().getHours();

  let greeting = "Good Evening";

  if (currentHour < 12) {
    greeting = "Good Morning";
  } else if (currentHour < 18) {
    greeting = "Good Afternoon";
  }

  const totalReports = reports.length;
  const resolvedReports = reports.filter(
    (r) => r.status === "Resolved"
  ).length;

  const pendingReports = totalReports - resolvedReports;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white p-8 md:p-10 shadow-2xl shadow-emerald-900/20">

      <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-2xl" />

      <div className="absolute -bottom-20 -left-12 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl" />

      <div className="relative z-10">

        <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
          <Sparkles className="w-4 h-4 text-emerald-100" />

          <span className="text-xs font-semibold tracking-wide uppercase text-emerald-50">
            Citizen Dashboard
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
          {greeting},
          <br />

          <span className="text-white">
            {user?.name} 👋
          </span>
        </h1>

        <p className="mt-5 text-base md:text-lg text-white/85 max-w-2xl leading-relaxed">
          Report local issues like potholes, streetlights, or water leakage,
          and track their resolutions in real-time.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">

          {/* TOTAL */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-5 py-3.5 border border-white/10">
            <p className="text-xs text-white/70 mb-1">
              My Total Reports
            </p>

            <p className="text-2xl font-bold flex gap-2 items-center">
              <FileText className="w-5 h-5 text-emerald-200" />
              {totalReports}
            </p>
          </div>

          {/* RESOLVED */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-5 py-3.5 border border-white/10">
            <p className="text-xs text-white/70 mb-1">
              Resolved
            </p>

            <p className="text-2xl font-bold flex gap-2 items-center text-emerald-100">
              <CheckCircle className="w-5 h-5 text-emerald-200" />
              {resolvedReports}
            </p>
          </div>

          {/* PENDING */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-5 py-3.5 border border-white/10">
            <p className="text-xs text-white/70 mb-1">
              Pending Action
            </p>

            <p className="text-2xl font-bold flex gap-2 items-center text-amber-200">
              <Clock className="w-5 h-5 text-amber-200" />
              {pendingReports}
            </p>
          </div>

          {/* CITY */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-5 py-3.5 border border-white/10">
            <p className="text-xs text-white/70 mb-1">
              Current City
            </p>

            <p className="font-semibold flex gap-2 items-center text-sm truncate">
              <MapPin className="w-4 h-4 text-emerald-200 shrink-0" />

              {user?.city || "N/A"}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};


/* =========================================================
   CITIZEN DASHBOARD
========================================================= */

const CitizenDashboard = () => {

  const { user } = useAuth();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  /* =====================================================
     FORM STATE
  ===================================================== */

  const [problemType, setProblemType] = useState("");
  const [department, setDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [locationName, setLocationName] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationDetected, setLocationDetected] = useState(false);
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);
  const [priority, setPriority] = useState("Normal");

  const [reportImage, setReportImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");


  /* =====================================================
     DEPARTMENTS
  ===================================================== */

  const civicDepartments = [
    "Environmental Services",
    "Water Supply",
    "Road Maintenance",
    "Electricity Department",
    "Sanitation",
    "Health Department",
    "Traffic Management",
    "Public Safety",
    "Waste Management",
    "Parks and Recreation",
    "Sewerage Department",
    "Fire Department",
    "Urban Planning",
    "Transport Department",
    "Housing Board",
  ];


  /* =====================================================
     FETCH REPORTS
  ===================================================== */

  const fetchCitizenReports = async () => {

    try {

      const res = await getReports();

      setReports(res.data.reports || []);

    } catch (err) {

      console.error(err);

      toast.error("Failed to fetch your reports");

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    fetchCitizenReports();

  }, []);


  /* =====================================================
     GET CURRENT LOCATION
  ===================================================== */

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setLocationLoading(true);
    setLocationDetected(false);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: currentLatitude, longitude: currentLongitude } =
          position.coords;

        setLatitude(currentLatitude);
        setLongitude(currentLongitude);
        setLocationDetected(true);
        setLocationLoading(false);

        if (!locationName.trim()) {
          setLocationName("Current GPS location");
        }

        toast.success("Current location detected successfully");
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLocationLoading(false);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error(
              "Location permission denied. Please allow location access in your browser."
            );
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error("Your current location is unavailable.");
            break;
          case error.TIMEOUT:
            toast.error("Location request timed out. Please try again.");
            break;
          default:
            toast.error("Unable to detect your location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  /* =====================================================
     OPEN MAP LOCATION PICKER
  ===================================================== */

  const handleOpenLocationPicker = () => {
    setLocationPickerOpen(true);
  };

  const handleMapLocationSelect = (
    selectedLatitude,
    selectedLongitude
  ) => {
    setLatitude(selectedLatitude);
    setLongitude(selectedLongitude);
  };

  const handleConfirmMapLocation = () => {
    if (latitude === null || longitude === null) {
      toast.error("Please select a location on the map");
      return;
    }

    setLocationDetected(true);
    setLocationPickerOpen(false);

    if (!locationName.trim()) {
      setLocationName("Selected location on map");
    }

    toast.success("Complaint location selected from map");
  };

  /* =====================================================
     IMAGE CHANGE
  ===================================================== */

  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (file) {

      setReportImage(file);

      setImagePreview(URL.createObjectURL(file));

    }
  };


  /* =====================================================
     CLEAR FORM
  ===================================================== */

  const handleClearForm = () => {

    setProblemType("");
    setDepartment("");
    setDescription("");
    setLocationName("");
    setLatitude(null);
    setLongitude(null);
    setLocationDetected(false);
    setLocationLoading(false);
    setLocationPickerOpen(false);
    setPriority("Normal");

    setReportImage(null);
    setImagePreview("");

  };


  /* =====================================================
     SUBMIT REPORT
  ===================================================== */

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      !problemType ||
      !department ||
      !description ||
      !locationName
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (latitude === null || longitude === null) {
      toast.error(
        "Please select the complaint location using GPS or the map"
      );
      return;
    }

    setSubmitting(true);

    try {

      const formData = new FormData();

      formData.append("problemType", problemType);
      formData.append("department", department);
      formData.append("description", description);

      formData.append(
        "city",
        user?.city || "Ranchi"
      );

      formData.append("priority", priority);

      // Send the actual GPS coordinates captured from the browser.
      // If the citizen did not use GPS, keep null/empty instead of
      // incorrectly storing 0,0 as a real location.
      formData.append(
        "latitude",
        latitude !== null ? String(latitude) : ""
      );
      formData.append(
        "longitude",
        longitude !== null ? String(longitude) : ""
      );

      formData.append(
        "locationName",
        locationName
      );

      formData.append(
        "citizenName",
        user?.name || ""
      );

      formData.append(
        "citizenContact",
        user?.contact || ""
      );

      if (reportImage) {

        formData.append(
          "image",
          reportImage
        );

      }

      await createReport(formData);

      toast.success(
        "Complaint submitted successfully!"
      );

      handleClearForm();

      fetchCitizenReports();

    } catch (err) {

      console.error(err);

      toast.error(
        err.response?.data?.message ||
        "Failed to submit complaint"
      );

    } finally {

      setSubmitting(false);

    }
  };


  /* =====================================================
     STATUS BADGE
  ===================================================== */

  const getStatusBadge = (status) => {

    switch (status) {

      case "Pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";

      case "Staff Assigned":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "In Progress":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";

      case "Pending Approval":
        return "bg-purple-50 text-purple-700 border-purple-200";

      case "Unable To Complete":
        return "bg-red-50 text-red-700 border-red-200";

      case "Resolved":
        return "bg-green-50 text-green-700 border-green-200";

      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };


  /* =====================================================
     UI
  ===================================================== */

  return (

    <div className="flex flex-col space-y-8 pb-12">

      {/* =================================================
          WELCOME
      ================================================= */}

      <WelcomeBanner
        user={user}
        reports={reports}
      />


      {/* =================================================
          MAP - AT THE TOP
      ================================================= */}

      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">

        <div className="flex items-center justify-between mb-6">

          <div className="flex items-center gap-3">

            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">

              <MapPin className="w-6 h-6" />

            </div>

            <div>

              <h2 className="text-xl font-bold text-gray-900">
                Civic Issue Map
              </h2>

              <p className="text-xs text-gray-500">
                View reported civic issues and their locations
              </p>

            </div>

          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">

            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />

            Live Issue Map

          </div>

        </div>


        {/* MAP */}

        <div className="w-full h-[500px] rounded-2xl overflow-hidden border border-gray-200">

          <MapSection />

        </div>

      </div>


      {/* =================================================
          FORM + REPORTS
      ================================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">


        {/* =================================================
            LEFT COLUMN - FORM
        ================================================= */}

        <div className="lg:col-span-5 bg-white rounded-3xl shadow-lg border border-gray-100 p-6">

          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">

            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">

              <PlusCircle className="w-6 h-6" />

            </div>

            <div>

              <h2 className="text-xl font-bold text-gray-900">
                File a New Complaint
              </h2>

              <p className="text-xs text-gray-500">
                Provide details of the civic issue
              </p>

            </div>

          </div>


          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* TITLE */}

            <div>

              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Problem Title / Brief *
              </label>

              <div className="relative">

                <FileText className="absolute left-4 top-3.5 text-gray-400 w-4 h-4" />

                <input
                  type="text"
                  placeholder="e.g. Broken pipe leakage on Main Road"
                  value={problemType}
                  onChange={(e) =>
                    setProblemType(e.target.value)
                  }
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm placeholder:text-gray-400 text-gray-900 bg-gray-50/50"
                />

              </div>

            </div>


            {/* DEPARTMENT */}

            <div>

              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Department / Category *
              </label>

              <div className="relative">

                <Briefcase className="absolute left-4 top-3.5 text-gray-400 w-4 h-4" />

                <select
                  value={department}
                  onChange={(e) =>
                    setDepartment(e.target.value)
                  }
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm text-gray-900 bg-gray-50/50 appearance-none cursor-pointer"
                >

                  <option value="">
                    Select Category
                  </option>

                  {civicDepartments.map((dept) => (

                    <option
                      key={dept}
                      value={dept}
                    >
                      {dept}
                    </option>

                  ))}

                </select>

              </div>

            </div>


            {/* DESCRIPTION */}

            <div>

              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Detailed Description *
              </label>

              <textarea
                placeholder="Explain the issue and provide details that help municipal teams understand where or what it is..."
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                required
                rows={4}
                className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm placeholder:text-gray-400 text-gray-900 bg-gray-50/50"
              />

            </div>


            {/* LOCATION */}

            <div>

              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Location Address / Landmark *
              </label>

              <div className="relative">

                <MapPin className="absolute left-4 top-3.5 text-gray-400 w-4 h-4" />

                <input
                  type="text"
                  placeholder="e.g. Near Hanuman Temple, Albert Ekka Chowk"
                  value={locationName}
                  onChange={(e) =>
                    setLocationName(e.target.value)
                  }
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm placeholder:text-gray-400 text-gray-900 bg-gray-50/50"
                />

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  disabled={locationLoading}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border font-semibold text-sm transition-all cursor-pointer ${
                    locationLoading
                      ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
                      : locationDetected
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                      : "bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  }`}
                >
                  <MapPin className="w-4 h-4" />

                  {locationLoading
                    ? "Detecting..."
                    : locationDetected &&
                      latitude !== null &&
                      longitude !== null
                    ? "Current Location ✓"
                    : "Use My Current Location"}
                </button>

                <button
                  type="button"
                  onClick={handleOpenLocationPicker}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-blue-200 bg-white text-blue-700 hover:bg-blue-50 font-semibold text-sm transition-all cursor-pointer"
                >
                  <MapPin className="w-4 h-4" />
                  Select From Map
                </button>
              </div>

              {latitude !== null && longitude !== null && (
                <div className="mt-3 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />

                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-emerald-700">
                        Complaint location selected
                      </p>

                      <p className="text-[11px] text-emerald-600 mt-1 break-all">
                        Latitude: {latitude.toFixed(6)} • Longitude:{" "}
                        {longitude.toFixed(6)}
                      </p>

                      <p className="text-[11px] text-emerald-600 mt-1">
                        You can change it using either option above.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-[11px] text-gray-400 mt-2">
                Not at the problem location? Use{" "}
                <span className="font-semibold">Select From Map</span> and
                click the exact place where the issue exists.
              </p>

            </div>


            {/* PRIORITY */}

            <div>

              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Priority
              </label>

              <div className="relative">

                <AlertTriangle className="absolute left-4 top-3.5 text-gray-400 w-4 h-4" />

                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value)
                  }
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm text-gray-900 bg-gray-50/50 appearance-none cursor-pointer"
                >

                  <option value="Normal">
                    Normal
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="High">
                    High
                  </option>

                  <option value="Critical">
                    Critical
                  </option>

                </select>

              </div>

            </div>


            {/* IMAGE */}

            <div>

              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Attach Image (Optional)
              </label>

              <div className="flex items-center gap-4">

                <label className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer hover:bg-emerald-50/30 hover:border-emerald-500/30 transition-all w-full">

                  <Camera className="w-5 h-5 text-emerald-600" />

                  <span className="text-sm text-gray-500">
                    {reportImage
                      ? "Change Image"
                      : "Upload Photo"}
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                </label>


                {imagePreview && (

                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                  />

                )}

              </div>

            </div>


            {/* SUBMIT */}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={submitting}
              className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                submitting
                  ? "bg-white/10 border border-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
              }`}
            >

              {submitting ? (

                "Submitting..."

              ) : (

                <>
                  <Send className="w-4 h-4" />
                  Submit Complaint
                </>

              )}

            </motion.button>

          </form>

        </div>


        {/* =================================================
            RIGHT COLUMN - REPORTS
        ================================================= */}

        <div className="lg:col-span-7 bg-white rounded-3xl shadow-lg border border-gray-100 p-6 flex flex-col min-h-[500px]">

          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">

            <div className="flex items-center gap-3">

              <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">

                <FileText className="w-6 h-6" />

              </div>

              <div>

                <h2 className="text-xl font-bold text-gray-900">
                  My Reports
                </h2>

                <p className="text-xs text-gray-500">
                  Track status of submitted reports
                </p>

              </div>

            </div>

          </div>


          {/* LOADING */}

          {loading ? (

            <div className="flex flex-col items-center justify-center flex-grow py-16 gap-3">

              <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />

              <p className="text-gray-500 font-medium">
                Loading reports...
              </p>

            </div>

          ) : reports.length === 0 ? (

            /* EMPTY */

            <div className="flex flex-col items-center justify-center flex-grow py-16 text-center text-gray-400">

              <AlertCircle className="w-12 h-12 opacity-40 mb-3" />

              <p className="font-semibold text-lg">
                No complaints submitted yet
              </p>

              <p className="text-sm max-w-sm mt-1">
                Use the form on the left to lodge your first
                complaint. Our team will verify and resolve it
                quickly.
              </p>

            </div>

          ) : (

            /* REPORT LIST */

            <div className="space-y-4 max-h-[620px] overflow-y-auto pr-1">

              {reports.map((report) => (

                <div
                  key={report._id}
                  onClick={() =>
                    setSelectedReport(report)
                  }
                  className="p-4 rounded-2xl border border-gray-100 hover:border-emerald-500/20 hover:bg-emerald-50/10 transition-all cursor-pointer flex gap-4"
                >

                  {/* IMAGE */}

                  <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 shrink-0 overflow-hidden flex items-center justify-center">

                    {report.image ? (

                      <img
                        src={report.image}
                        alt="report"
                        className="w-full h-full object-cover"
                      />

                    ) : (

                      <FileText className="w-6 h-6 text-gray-300" />

                    )}

                  </div>


                  {/* CONTENT */}

                  <div className="flex-1 min-w-0">

                    <div className="flex items-start justify-between gap-2">

                      <h4 className="font-bold text-gray-900 truncate">
                        {report.problemType}
                      </h4>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(
                          report.status
                        )} shrink-0`}
                      >
                        {report.status}
                      </span>

                    </div>


                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">

                      <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />

                      <span className="truncate">
                        {report.location?.locationName ||
                          report.city}
                      </span>

                    </p>


                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-100 text-xs text-gray-400">

                      <span>
                        Ref:{" "}
                        {report.reportId ||
                          "NS-Pending"}
                      </span>

                      <span>
                        {new Date(
                          report.createdAt
                        ).toLocaleDateString()}
                      </span>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>


      {/* =================================================
          LOCATION PICKER MODAL
      ================================================= */}

      <LocationPickerModal
        open={locationPickerOpen}
        latitude={latitude}
        longitude={longitude}
        onSelect={handleMapLocationSelect}
        onConfirm={handleConfirmMapLocation}
        onClose={() => setLocationPickerOpen(false)}
      />

      {/* =================================================
          REPORT DETAILS MODAL
      ================================================= */}

      <AnimatePresence>

        {selectedReport && (

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            {/* BACKDROP */}

            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() =>
                setSelectedReport(null)
              }
            />


            {/* MODAL */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
              }}
              className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]"
            >

              {/* HEADER */}

              <div className="shrink-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 px-6 py-5 flex items-center justify-between text-white">

                <div className="flex items-center gap-3">

                  <div className="p-2 rounded-xl bg-white/10 border border-white/10">

                    <FileText className="w-5 h-5" />

                  </div>

                  <div>

                    <h3 className="font-bold text-lg">
                      Grievance Details
                    </h3>

                    <p className="text-xs text-white/80">
                      Ref:{" "}
                      {selectedReport.reportId ||
                        "NS-Pending"}
                    </p>

                  </div>

                </div>


                <button
                  onClick={() =>
                    setSelectedReport(null)
                  }
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
                >
                  <X size={20} />
                </button>

              </div>


              {/* CONTENT */}

              <div className="p-6 overflow-y-auto space-y-6">

                {/* IMAGE */}

                {selectedReport.image && (

                  <div className="rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">

                    <img
                      src={selectedReport.image}
                      alt="Complaint proof"
                      className="w-full h-48 object-cover"
                    />

                  </div>

                )}


                {/* DETAILS */}

                <div className="grid grid-cols-2 gap-4">

                  <div>

                    <p className="text-xs font-semibold text-gray-400 uppercase">
                      Category
                    </p>

                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {selectedReport.department}
                    </p>

                  </div>


                  <div>

                    <p className="text-xs font-semibold text-gray-400 uppercase">
                      Priority
                    </p>

                    <p className="text-sm font-semibold text-gray-900 mt-1">

                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          selectedReport.priority ===
                            "Critical" ||
                          selectedReport.priority ===
                            "High"
                            ? "bg-red-100 text-red-700"
                            : "bg-sky-100 text-sky-700"
                        }`}
                      >
                        {selectedReport.priority}
                      </span>

                    </p>

                  </div>

                </div>


                {/* TITLE */}

                <div>

                  <p className="text-xs font-semibold text-gray-400 uppercase">
                    Title / Issue
                  </p>

                  <p className="text-sm font-bold text-gray-900 mt-1">
                    {selectedReport.problemType}
                  </p>

                </div>


                {/* DESCRIPTION */}

                <div>

                  <p className="text-xs font-semibold text-gray-400 uppercase">
                    Description
                  </p>

                  <p className="text-sm text-gray-600 mt-1 leading-relaxed whitespace-pre-wrap">
                    {selectedReport.description}
                  </p>

                </div>


                {/* LOCATION */}

                <div className="flex items-start gap-2">

                  <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />

                  <div>

                    <p className="text-xs font-semibold text-gray-400 uppercase">
                      Location
                    </p>

                    <p className="text-sm text-gray-700 mt-1">
                      {selectedReport.location?.locationName ||
                        selectedReport.city}
                    </p>

                  </div>

                </div>


                {/* STATUS */}

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">

                  <div className="flex items-center justify-between">

                    <span className="text-sm font-bold text-gray-700">
                      Resolution Status
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                        selectedReport.status
                      )}`}
                    >
                      {selectedReport.status}
                    </span>

                  </div>


                  {/* RESOLUTION */}

                  {selectedReport.status ===
                    "Resolved" && (

                    <div className="mt-3 pt-3 border-t border-gray-200">

                      <p className="text-xs font-semibold text-gray-400 uppercase">
                        Resolution Details
                      </p>

                      <p className="text-sm text-gray-600 mt-1">
                        {selectedReport.resolvedDescription ||
                          "Resolved by Municipal Officer."}
                      </p>

                      {selectedReport.resolvedAt && (

                        <p className="text-[10px] text-gray-400 mt-1">
                          Resolved on:{" "}
                          {new Date(
                            selectedReport.resolvedAt
                          ).toLocaleDateString()}
                        </p>

                      )}

                    </div>

                  )}


                  {/* UNABLE TO COMPLETE */}

                  {selectedReport.status ===
                    "Unable To Complete" && (

                    <div className="mt-3 pt-3 border-t border-gray-200">

                      <p className="text-xs font-semibold text-gray-400 uppercase">
                        Reason for Incomplete Status
                      </p>

                      <p className="text-sm text-red-600 mt-1">
                        {selectedReport.unableReason ||
                          "Could not be completed due to technical constraints."}
                      </p>

                    </div>

                  )}


                  {/* ASSIGNED OFFICER */}

                  {selectedReport.assignedToName && (

                    <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">

                      <span>
                        Assigned Officer:
                      </span>

                      <span className="font-bold text-gray-700">

                        {selectedReport.assignedToName}

                        {" ("}

                        {selectedReport.assignedToDepartment}

                        {")"}

                      </span>

                    </div>

                  )}

                </div>

              </div>

            </motion.div>

          </div>

        )}

      </AnimatePresence>

    </div>
  );
};


export default CitizenDashboard;