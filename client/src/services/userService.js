import API from "../api/axios";

// Profile

export const updateProfile = (formData) =>
  API.put("/api/users/update-profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// Staff

export const getJuniorStaff = () =>
  API.get("/api/users/junior-staff");

export const getJuniorStaffByDepartment = (department) =>
  API.get(`/api/users/junior-staff/${department}`);

export const getDepartmentsList = () =>
  API.get("/api/users/departments-list");