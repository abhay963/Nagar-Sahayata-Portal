import React from "react";

const dummyStaff = Array.from({ length: 30 }, (_, index) => ({
  id: index + 1,
  name: `Staff Member ${index + 1}`,
  department: "Public Works",
  role: "Field Agent",
  contact: "9999999999",
}));

const StaffDirectory = () => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-4">Staff Directory</h2>
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {dummyStaff.map((staff) => (
          <div key={staff.id} className="p-3 border rounded hover:bg-gray-100 transition">
            <h3 className="font-semibold">{staff.name}</h3>
            <p>Department: {staff.department}</p>
            <p>Role: {staff.role}</p>
            <p>Contact: {staff.contact}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffDirectory;
