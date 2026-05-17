// Import React
import React from "react";



// ======================================================
// ================= DUMMY STAFF DATA ===================
// ======================================================

// Temporary static data
// Later replace with backend API data
const dummyStaff = Array.from(

  // Create 30 dummy users
  { length: 30 },

  (_, index) => ({

    // Unique ID
    id: index + 1,

    // Dynamic name
    name: `Staff Member ${index + 1}`,

    // Department
    department: "Public Works",

    // Staff role
    role: "Field Agent",

    // Dummy phone number
    contact: "9999999999",
  })
);



// ======================================================
// ================= STAFF DIRECTORY ====================
// ======================================================

const StaffDirectory = () => {


  // Debug log
  console.log(
    "👥 Staff Directory Loaded"
  );


  // Check total staff
  console.log(
    "📋 Total Staff:",
    dummyStaff.length
  );


  return (

    <div className="
      bg-white
      shadow-md
      rounded-2xl
      p-6
    ">

      {/* ================= PAGE TITLE ================= */}

      <h2 className="
        text-2xl
        font-bold
        mb-4
      ">

        Staff Directory

      </h2>



      {/* ================= STAFF LIST ================= */}

      <div className="
        space-y-2
        max-h-[400px]
        overflow-y-auto
      ">

        {
          dummyStaff.map((staff) => (

            <div

              key={staff.id}

              className="
                p-3
                border
                rounded
                hover:bg-gray-100
                transition
              "
            >

              {/* Staff Name */}
              <h3 className="
                font-semibold
              ">

                {staff.name}

              </h3>


              {/* Department */}
              <p>

                Department:
                {" "}
                {staff.department}

              </p>


              {/* Role */}
              <p>

                Role:
                {" "}
                {staff.role}

              </p>


              {/* Contact */}
              <p>

                Contact:
                {" "}
                {staff.contact}

              </p>

            </div>
          ))
        }

      </div>

    </div>
  );
};


// Export component
export default StaffDirectory;