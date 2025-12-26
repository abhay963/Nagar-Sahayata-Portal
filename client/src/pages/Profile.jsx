import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, logout, setUser, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    empId: "",
    department: "",
    contact: "",
    address: "",
  });
  const [errors, setErrors] = useState({});

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        You are not logged in. Please{" "}
        <a href="/login" className="text-blue-600 underline">
          login
        </a>.
      </div>
    );
  }

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        empId: user.empId || "",
        department: user.department || "",
        contact: user.contact || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errs.email = "Email is invalid";
    if (!formData.empId.trim()) errs.empId = "Employee ID is required";
    if (!formData.department.trim()) errs.department = "Department is required";
    if (!formData.contact.trim()) errs.contact = "Contact number is required";
    if (!formData.address.trim()) errs.address = "Address is required";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      const res = await axios.put("/api/users/update-profile", formData);
      setUser(res.data.updatedUser);
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed:", err);
      toast.error(err.response?.data?.message || "Failed to update profile.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      empId: user.empId || "",
      department: user.department || "",
      contact: user.contact || "",
      address: user.address || "",
    });
    setErrors({});
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4] py-10 px-4 font-sans">
      <div className="max-w-5xl mx-auto bg-white border border-gray-300 rounded-md shadow-md">
        <div className="bg-[#006400] text-white text-center py-4 rounded-t-md border-b border-green-800">
          <h1 className="text-2xl font-semibold uppercase tracking-wide">Profile</h1>
          <p className="text-sm font-light">Government of Jharkhand</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-8">
          <div className="flex flex-col items-center">
            {/* Always Show Initials */}
            <div className="w-36 h-36 rounded-full flex items-center justify-center mb-4 bg-gradient-to-br from-green-200 to-green-500 text-white text-5xl font-bold uppercase shadow-inner">
              {getInitials(user.name)}
            </div>
            <p className="text-lg font-semibold mt-2">{user.name}</p>
            <p className="text-sm text-gray-700">{user.role}</p>
          </div>

          {/* Form Fields */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <EditableField label="Full Name" name="name" value={formData.name} isEditing={isEditing} onChange={handleChange} error={errors.name} />
            <EditableField label="Email" name="email" value={formData.email} isEditing={isEditing} onChange={handleChange} error={errors.email} />
            <EditableField label="Employee ID" name="empId" value={formData.empId} isEditing={isEditing} onChange={handleChange} error={errors.empId} />
            <EditableField label="Department" name="department" value={formData.department} isEditing={isEditing} onChange={handleChange} error={errors.department} />
            <EditableField label="Phone" name="contact" value={formData.contact} isEditing={isEditing} onChange={handleChange} error={errors.contact} />
            <EditableField label="Address" name="address" value={formData.address} isEditing={isEditing} onChange={handleChange} error={errors.address} />
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Joining Date</p>
              <p className="text-sm font-semibold text-gray-800 mt-1">
                {user.joiningDate ? new Date(user.joiningDate).toLocaleDateString("en-IN") : "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 p-4 text-center space-x-4">
          {isEditing ? (
            <>
<button onClick={handleSave} className="bg-green-700 hover:bg-green-900 text-white px-5 py-2 rounded text-sm cursor-pointer">
  Save
</button>
<button onClick={handleCancel} className="bg-gray-500 hover:bg-gray-700 text-white px-5 py-2 rounded text-sm cursor-pointer">
  Cancel
</button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-800 text-white px-6 py-2 rounded text-sm cursor-pointer">
              Edit Profile
            </button>
          )}
          <button
            onClick={() => {
              logout();
              window.location.href = "/login";
            }}
            className="bg-red-600 hover:bg-red-800 text-white px-6 py-2 rounded text-sm cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

const EditableField = ({ label, value, isEditing, name, onChange, error, type = "text" }) => {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase">{label}</p>
      {isEditing ? (
        <>
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className={`mt-1 w-full border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          />
          {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </>
      ) : (
        <p className="text-sm font-semibold text-gray-800 mt-1">{value || "N/A"}</p>
      )}
    </div>
  );
};

export default Profile;
