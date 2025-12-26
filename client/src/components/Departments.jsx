import React from "react";

const Departments = () => {
  const departments = [
    { id: 1, name: "Sanitation", head: "Mr. Rajeev Sinha", contact: "9876543210", email: "sanitation@jharkhand.gov.in" },
    { id: 2, name: "Water Supply", head: "Ms. Rekha Kumari", contact: "9123456780", email: "water@jharkhand.gov.in" },
    { id: 3, name: "Electricity", head: "Mr. Anil Verma", contact: "9988776655", email: "electricity@jharkhand.gov.in" },
    { id: 4, name: "Road Maintenance", head: "Ms. Sunita Das", contact: "9090909090", email: "roads@jharkhand.gov.in" },
    { id: 5, name: "Environment", head: "Dr. Rakesh Jha", contact: "8008008000", email: "environment@jharkhand.gov.in" },
    { id: 6, name: "Public Infrastructure", head: "Mr. Ravi Mishra", contact: "7007007007", email: "infra@jharkhand.gov.in" },
  ];

  return (
    <div className="bg-white shadow-md rounded-2xl p-5">
      <h2 className="text-xl font-bold mb-4">Departments</h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Department Name</th>
              <th className="px-4 py-2 border">Head</th>
              <th className="px-4 py-2 border">Contact</th>
              <th className="px-4 py-2 border">Email</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.id} className="text-center hover:bg-green-50">
                <td className="border px-4 py-2">{dept.id}</td>
                <td className="border px-4 py-2 font-semibold">{dept.name}</td>
                <td className="border px-4 py-2">{dept.head}</td>
                <td className="border px-4 py-2">{dept.contact}</td>
                <td className="border px-4 py-2">{dept.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Departments;
