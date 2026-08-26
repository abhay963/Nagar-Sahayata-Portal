import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";
import { toast } from "react-toastify";
import { Camera, Save, X, LogOut, User } from "lucide-react";

const Profile = () => {
  const { user, logout, setUser, loading } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // ================= DEPARTMENTS =================

  const civicDepartments = [
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
  ];

  // ================= JHARKHAND CITIES =================

  const jharkhandCities = [
    "Bokaro",
    "Chaibasa",
    "Chatra",
    "Deoghar",
    "Dhanbad",
    "Dumka",
    "Garhwa",
    "Giridih",
    "Godda",
    "Gumla",
    "Hazaribagh",
    "Jamshedpur",
    "Jamtara",
    "Khunti",
    "Koderma",
    "Latehar",
    "Lohardaga",
    "Medininagar",
    "Pakur",
    "Ramgarh",
    "Ranchi",
    "Sahebganj",
    "Saraikela",
    "Simdega",
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    empId: "",
    department: "",
    city: "",
    contact: "",
    address: "",
    profileImage: null,
  });

  const [errors, setErrors] = useState({});

  // =========================================================
  // CHECK WHETHER CURRENT USER IS A CITIZEN
  // =========================================================

  const isCitizen = user?.role?.toLowerCase() === "citizen";

  // =========================================================
  // PREFILL FORM DATA
  // =========================================================

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        empId: user.empId || "",
        department: user.department || "",
        city: user.city || "",
        contact: user.contact || "",
        address: user.address || "",
        profileImage: null,
      });

      setPreviewImage(null);
    }
  }, [user]);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>

          <p className="mt-4 text-gray-600 font-medium">
            Loading Profile...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // USER NOT LOGGED IN
  // =========================================================

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-xl font-medium text-gray-700">
        You are not logged in.
      </div>
    );
  }

  // =========================================================
  // VALIDATION
  // =========================================================

  const validate = () => {
    const errs = {};

    // Name
    if (!formData.name?.trim()) {
      errs.name = "Name is required";
    }

    // Email
    if (!formData.email?.trim()) {
      errs.email = "Email is required";
    }

    // Employee ID
    // Citizen does NOT need Employee ID
    if (!isCitizen && !formData.empId?.trim()) {
      errs.empId = "Employee ID is required";
    }

    // Department
    // Citizen does NOT need Department
    // Higher Authority also does not require Department
    if (
      !isCitizen &&
      user.role !== "Higher Authority" &&
      !formData.department?.trim()
    ) {
      errs.department = "Department is required";
    }

    // City
    if (!formData.city?.trim()) {
      errs.city = "City is required";
    }

    // Contact
    if (!formData.contact?.trim()) {
      errs.contact = "Contact number is required";
    }

    return errs;
  };

  // =========================================================
  // HANDLE INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      const file = files[0];

      setFormData((prev) => ({
        ...prev,
        profileImage: file,
      }));

      // Create preview
      const reader = new FileReader();

      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };

      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // =========================================================
  // SAVE PROFILE
  // =========================================================

  const handleSave = async () => {
    const validationErrors = validate();

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fix the highlighted errors");
      return;
    }

    try {
      setSaving(true);

      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (
          formData[key] !== null &&
          formData[key] !== undefined
        ) {
          data.append(key, formData[key]);
        }
      });

      const res = await axios.put(
        "/api/users/update-profile",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser(res.data.updatedUser);

      setIsEditing(false);
      setPreviewImage(null);

      toast.success("Profile updated successfully!");
    } catch (err) {
      console.log("Response:", err.response?.data);
      console.log("Errors:", err.response?.data?.errors);

      toast.error(
        err.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // CANCEL EDITING
  // =========================================================

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    setPreviewImage(null);

    // Reset form to original user data
    setFormData({
      name: user.name || "",
      email: user.email || "",
      empId: user.empId || "",
      department: user.department || "",
      city: user.city || "",
      contact: user.contact || "",
      address: user.address || "",
      profileImage: null,
    });
  };

  // =========================================================
  // GET INITIALS
  // =========================================================

  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const currentImage = previewImage || user.profileImage;

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* ================= HEADER ================= */}

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            My Profile
          </h1>

          <p className="text-gray-600 mt-2">
            Nagar Sahayata Portal
          </p>
        </div>

        {/* ================= PROFILE CARD ================= */}

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          <div className="grid md:grid-cols-12">

            {/* =================================================
                LEFT SIDEBAR - PROFILE PICTURE
            ================================================= */}

            <div className="md:col-span-4 bg-gradient-to-br from-green-700 to-green-800 p-10 flex flex-col items-center text-white">

              {/* Profile Image */}

              <div className="relative group">

                <div className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-white/30 shadow-2xl">

                  {currentImage ? (
                    <img
                      src={currentImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/10 flex items-center justify-center text-7xl font-bold">
                      {getInitials(user.name)}
                    </div>
                  )}

                </div>

                {/* Camera Button */}

                {isEditing && (
                  <label className="absolute bottom-3 right-3 bg-white text-green-700 p-3 rounded-xl cursor-pointer shadow-lg hover:bg-green-50 transition-all active:scale-95">

                    <Camera className="w-5 h-5" />

                    <input
                      type="file"
                      name="profileImage"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                    />

                  </label>
                )}

              </div>

              {/* Name */}

              <h2 className="mt-8 text-3xl font-semibold text-center">
                {user.name}
              </h2>

              {/* Role */}

              <p className="mt-1 text-green-200">
                {user.role}
              </p>

              {/* =================================================
                  EMPLOYEE ID
                  HIDDEN FOR CITIZENS
              ================================================= */}

              {!isCitizen && (
                <div className="mt-6 bg-white/10 rounded-2xl px-6 py-3 text-center w-full">

                  <p className="text-xs uppercase tracking-widest text-green-200">
                    Employee ID
                  </p>

                  <p className="text-xl font-mono font-bold mt-1">
                    {user.empId || "—"}
                  </p>

                </div>
              )}

            </div>

            {/* =================================================
                RIGHT CONTENT
            ================================================= */}

            <div className="md:col-span-8 p-10">

              {/* ================= TITLE ================= */}

              <div className="flex justify-between items-center mb-8">

                <h3 className="text-2xl font-semibold text-gray-900">
                  Personal Information
                </h3>

                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />

                    Edit Profile
                  </button>
                )}

              </div>

              {/* ================= INFORMATION GRID ================= */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                {/* =================================================
                    FULL NAME
                ================================================= */}

                <EditableField
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  isEditing={isEditing}
                  onChange={handleChange}
                  error={errors.name}
                />

                {/* =================================================
                    EMAIL
                ================================================= */}

                <EditableField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  isEditing={isEditing}
                  onChange={handleChange}
                  error={errors.email}
                />

                {/* =================================================
                    DEPARTMENT
                    HIDDEN FOR CITIZENS
                ================================================= */}

                {!isCitizen && (
                  <div>

                    <label className="block text-sm font-medium text-gray-500 mb-1.5">
                      Department
                    </label>

                    {isEditing &&
                    user.role !== "Higher Authority" ? (
                      <>
                        <select
                          name="department"
                          value={formData.department}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                            errors.department
                              ? "border-red-500"
                              : "border-gray-300 focus:border-green-500"
                          }`}
                        >
                          <option value="">
                            Select Department
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

                        {errors.department && (
                          <p className="text-red-500 text-xs mt-1.5">
                            {errors.department}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-gray-800 font-semibold py-3 px-1">
                        {formData.department || "—"}
                      </p>
                    )}

                  </div>
                )}

                {/* =================================================
                    CITY
                ================================================= */}

                <div>

                  <label className="block text-sm font-medium text-gray-500 mb-1.5">
                    City
                  </label>

                  {isEditing ? (
                    <>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                          errors.city
                            ? "border-red-500"
                            : "border-gray-300 focus:border-green-500"
                        }`}
                      >
                        <option value="">
                          Select City
                        </option>

                        {jharkhandCities.map((cityName) => (
                          <option
                            key={cityName}
                            value={cityName}
                          >
                            {cityName}
                          </option>
                        ))}
                      </select>

                      {errors.city && (
                        <p className="text-red-500 text-xs mt-1.5">
                          {errors.city}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-800 font-semibold py-3 px-1">
                      {formData.city || "—"}
                    </p>
                  )}

                </div>

                {/* =================================================
                    CONTACT
                ================================================= */}

                <EditableField
                  label="Contact Number"
                  name="contact"
                  type="tel"
                  value={formData.contact}
                  isEditing={isEditing}
                  onChange={handleChange}
                  error={errors.contact}
                />

                {/* =================================================
                    ADDRESS
                ================================================= */}

                <EditableField
                  label="Address"
                  name="address"
                  value={formData.address}
                  isEditing={isEditing}
                  onChange={handleChange}
                />

                {/* =================================================
                    ROLE
                    HIDDEN FOR CITIZENS
                ================================================= */}

                {!isCitizen && (
                  <DisplayField
                    label="Role"
                    value={user.role}
                  />
                )}

                {/* =================================================
                    ACCOUNT STATUS
                    HIDDEN FOR CITIZENS
                ================================================= */}

                {!isCitizen && (
                  <DisplayField
                    label="Account Status"
                    value={user.accountStatus}
                  />
                )}

                {/* =================================================
                    CREATED AT
                    HIDDEN FOR CITIZENS
                ================================================= */}

                {!isCitizen && (
                  <DisplayField
                    label="Created At"
                    value={
                      user.createdAt
                        ? new Date(
                            user.createdAt
                          ).toLocaleString("en-IN")
                        : "N/A"
                    }
                  />
                )}

                {/* =================================================
                    JOINING DATE
                    KEPT FOR EMPLOYEES
                ================================================= */}

                {!isCitizen && (
                  <DisplayField
                    label="Joining Date"
                    value={
                      user.joiningDate
                        ? new Date(
                            user.joiningDate
                          ).toLocaleDateString("en-IN")
                        : "N/A"
                    }
                  />
                )}

              </div>

              {/* =================================================
                  ACTION BUTTONS
              ================================================= */}

              <div className="mt-10 flex flex-wrap gap-4">

                {isEditing ? (
                  <>

                    {/* SAVE */}

                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 sm:flex-none px-8 py-3.5 bg-green-700 hover:bg-green-800 disabled:bg-green-300 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all"
                    >
                      <Save className="w-5 h-5" />

                      {saving
                        ? "Saving Changes..."
                        : "Save Changes"}
                    </button>

                    {/* CANCEL */}

                    <button
                      onClick={handleCancel}
                      className="flex-1 sm:flex-none px-8 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-medium flex items-center justify-center gap-2"
                    >
                      <X className="w-5 h-5" />

                      Cancel
                    </button>

                  </>
                ) : null}

                {/* LOGOUT */}

                <button
                  onClick={() => {
                    logout();
                    window.location.href = "/";
                  }}
                  className="flex-1 sm:flex-none px-8 py-3.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-2xl font-medium flex items-center justify-center gap-2 transition-all"
                >
                  <LogOut className="w-5 h-5" />

                  Logout
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

// =========================================================
// REUSABLE EDITABLE FIELD
// =========================================================

const EditableField = ({
  label,
  name,
  value,
  isEditing,
  onChange,
  error,
  type = "text",
}) => (
  <div>

    <label className="block text-sm font-medium text-gray-500 mb-1.5">
      {label}
    </label>

    {isEditing ? (
      <>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
            error
              ? "border-red-500"
              : "border-gray-300 focus:border-green-500"
          }`}
        />

        {error && (
          <p className="text-red-500 text-xs mt-1.5">
            {error}
          </p>
        )}
      </>
    ) : (
      <p className="text-gray-800 font-semibold py-3 px-1">
        {value || "—"}
      </p>
    )}

  </div>
);

// =========================================================
// REUSABLE DISPLAY FIELD
// =========================================================

const DisplayField = ({
  label,
  value,
  className = "",
}) => (
  <div>

    <p className="text-sm font-medium text-gray-500 mb-1.5">
      {label}
    </p>

    <p
      className={`text-gray-700 font-semibold py-3 px-1 break-all ${className}`}
    >
      {value || "—"}
    </p>

  </div>
);

export default Profile;