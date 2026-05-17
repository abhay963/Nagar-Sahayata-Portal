import React, {
  useState,
  useEffect,
  useMemo,
} from "react";

import { toast }
from "react-toastify";

import { useDebounce }
from "use-debounce";

import axios
from "../api/axios";



const AddReportForm = ({
  currentUser,
}) => {

  // ======================================================
  // ===================== STATES =========================
  // ======================================================

  const [reports, setReports] =
    useState([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [categoryFilter, setCategoryFilter] =
    useState("All");

  const [priorityFilter, setPriorityFilter] =
    useState("All");

  const [selectedReport, setSelectedReport] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [

    juniorStaffList,

    setJuniorStaffList

  ] = useState([]);

  const [assigning, setAssigning] =
    useState(false);

  const [

    formData,

    setFormData

  ] = useState({

    assignedTo: "",
  });

  const [debouncedSearch] =
    useDebounce(
      searchTerm,
      300
    );



  // ======================================================
  // ================= FETCH REPORTS ======================
  // ======================================================

  useEffect(() => {

  const fetchReports =
  async () => {

    try {

      setLoading(true);

      const response =
        await axios.get(

          `/api/reports/department/${currentUser.department}`

        );

      console.log(
        "📄 Department Reports:",
        response.data
      );

      const reportsData =
        response.data.reports || [];


      // ======================================================
      // ===== ADD LOCATION NAME TO EACH REPORT ===============
      // ======================================================

      const reportsWithLocation =
        reportsData.map((report) => ({

          ...report,

          locationName:
            report.location?.locationName ||
            "Unknown Location",
        }));


      // ======================================================
      // ===== SHOW ONLY PENDING REPORTS ======================
      // ======================================================

      const pendingReports =
        reportsWithLocation.filter(

          (report) =>

            report.status === "Pending"
        );


      setReports(
        pendingReports
      );

    } catch (error) {

      console.error(
        "❌ Error fetching reports:",
        error
      );

      toast.error(
        "Failed to load reports."
      );

    } finally {

      setLoading(false);
    }
  };

    if (currentUser?.department) {

      fetchReports();
    }

  }, [currentUser]);



  // ======================================================
  // ========== FETCH SAME DEPARTMENT JUNIOR STAFF =======
  // ======================================================

  useEffect(() => {

    const fetchJuniorStaff =
      async () => {

        try {

          const response =
            await axios.get(

              `/api/users/junior-staff/${currentUser.department}`

            );


          console.log(
            "👷 Junior Staff:",
            response.data
          );


          const staffData =
            response.data.users || [];


          setJuniorStaffList(
            Array.isArray(staffData)
              ? staffData
              : []
          );

        } catch (error) {

          console.error(
            "❌ Failed to fetch staff:",
            error
          );

          toast.error(
            "Failed to load junior staff."
          );
        }
      };

    if (currentUser?.department) {

      fetchJuniorStaff();
    }

  }, [currentUser]);



  // ======================================================
  // ================= FILTER REPORTS =====================
  // ======================================================

  const filteredReports =
    useMemo(() => {

      return reports.filter(
        (report) => {

          const locationName =
            report.locationName
              ?.toLowerCase() || "";


          const matchesSearch =

            report.problemType
              ?.toLowerCase()
              .includes(
                debouncedSearch.toLowerCase()
              ) ||

            report.description
              ?.toLowerCase()
              .includes(
                debouncedSearch.toLowerCase()
              ) ||

            locationName.includes(
              debouncedSearch.toLowerCase()
            );


          const matchesStatus =

            statusFilter === "All" ||

            report.status ===
              statusFilter;


          const matchesCategory =

            categoryFilter === "All" ||

            report.problemType ===
              categoryFilter;


          const matchesPriority =

            priorityFilter === "All" ||

            report.priority ===
              priorityFilter;


          return (

            matchesSearch &&

            matchesStatus &&

            matchesCategory &&

            matchesPriority
          );
        }
      );

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

    const {
      name,
      value,
    } = e.target;

    setFormData({

      ...formData,

      [name]: value,
    });
  };



  // ======================================================
  // ================= ASSIGN REPORT ======================
  // ======================================================

  const handleSubmit =
    async (e) => {

      e.preventDefault();


      if (!selectedReport) {

        toast.error(
          "Select report first"
        );

        return;
      }


      if (
        !formData.assignedTo
      ) {

        toast.error(
          "Select junior staff"
        );

        return;
      }


      try {

        setAssigning(true);


        // ======================================================
        // ================= ASSIGN API =========================
        // ======================================================

        await axios.put(
          "/api/reports/assign",
          {

            reportId:
              selectedReport._id,

            assignedTo:
              formData.assignedTo,
          }
        );


        toast.success(
          "Task assigned successfully!"
        );


        // ======================================================
        // ================= UPDATE LOCAL STATE =================
        // ======================================================

        setReports((prev) =>

          prev.map((report) =>

            report._id ===
            selectedReport._id

              ? {

                  ...report,

                  status:
                    "In Progress",

                  assignedTo:
                    formData.assignedTo,
                }

              : report
          )
        );


        setSelectedReport(null);

        setFormData({

          assignedTo: "",
        });

      } catch (error) {

        console.error(
          "❌ Assignment error:",
          error
        );

        toast.error(

          error.response?.data
            ?.message ||

          "Failed to assign task"
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

      <p className="
        text-center
        py-10
      ">

        Loading reports...

      </p>
    );
  }



  // ======================================================
  // ======================= UI ===========================
  // ======================================================

  return (

    <div className="
      bg-white
      p-6
      rounded-2xl
      shadow-md
      max-w-5xl
      mx-auto
    ">

      <h2 className="
        text-2xl
        font-bold
        mb-6
        text-center
      ">

        Assign Report

      </h2>



      {/* ====================================================== */}
      {/* ================= SEARCH ============================= */}
      {/* ====================================================== */}

      <input

        type="text"

        placeholder="Search reports..."

        value={searchTerm}

        onChange={(e) =>
          setSearchTerm(
            e.target.value
          )
        }

        className="
          border
          p-2
          rounded-lg
          w-full
          mb-4
        "
      />



      {/* ====================================================== */}
      {/* ================= REPORTS TABLE ====================== */}
      {/* ====================================================== */}

      <div className="
        overflow-x-auto
        mb-6
      ">

        <table className="
          w-full
          border
        ">

          <thead>

            <tr className="
              bg-green-600
              text-white
            ">

              <th className="p-3">
                Problem
              </th>

              <th className="p-3">
                Location
              </th>

              <th className="p-3">
                Priority
              </th>

              <th className="p-3">
                Status
              </th>

              <th className="p-3">
                Select
              </th>

            </tr>

          </thead>



          <tbody>

            {
              filteredReports.length === 0 ? (

                <tr>

                  <td
                    colSpan="5"
                    className="
                      text-center
                      p-5
                    "
                  >

                    No reports found

                  </td>

                </tr>

              ) : (

                filteredReports.map(
                  (report) => (

                    <tr

                      key={report._id}

                      className={`

                        border-b

                        hover:bg-gray-100

                        cursor-pointer

                        ${
                          selectedReport?._id ===
                          report._id

                            ? "bg-blue-100"

                            : ""
                        }
                      `}

                      onClick={() =>
                        setSelectedReport(
                          report
                        )
                      }
                    >

                      <td className="p-3">

                        {
                          report.problemType
                        }

                      </td>

                      <td className="p-3">

                        {
                          report.locationName
                        }

                      </td>

                      <td className="p-3">

                        {
                          report.priority
                        }

                      </td>

                      <td className="p-3">

                        {
                          report.status
                        }

                      </td>

                      <td className="p-3">

                        <input

                          type="radio"

                          checked={
                            selectedReport?._id ===
                            report._id
                          }

                          readOnly
                        />

                      </td>

                    </tr>
                  )
                )
              )
            }

          </tbody>

        </table>

      </div>



      {/* ====================================================== */}
      {/* ================= ASSIGN FORM ======================== */}
      {/* ====================================================== */}

      {
        selectedReport && (

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            <h3 className="
              text-xl
              font-semibold
            ">

              Assign Selected Report

            </h3>



            {/* ====================================================== */}
            {/* ================= STAFF DROPDOWN ===================== */}
            {/* ====================================================== */}

            <div>

              <label className="
                block
                mb-2
                font-medium
              ">

                Assign To

              </label>



              <select

                name="assignedTo"

                value={formData.assignedTo}

                onChange={handleChange}

                className="
                  w-full
                  border
                  p-2
                  rounded-lg
                "

                required
              >

                <option value="">
                  Select Junior Staff
                </option>



                {
                  juniorStaffList.map(
                    (staff) => (

                      <option

                        key={staff._id}

                        value={staff._id}
                      >

                        {staff.name}
                        {" - "}
                        {staff.department}

                      </option>
                    )
                  )
                }

              </select>

            </div>



            {/* ====================================================== */}
            {/* ================= SUBMIT BUTTON ===================== */}
            {/* ====================================================== */}

            <button

              type="submit"

              disabled={assigning}

              className="
                bg-green-600
                text-white
                px-5
                py-2
                rounded-lg
                hover:bg-green-700
                transition
              "
            >

              {
                assigning

                  ? "Assigning..."

                  : "Assign Task"
              }

            </button>

          </form>
        )
      }

    </div>
  );
};



export default AddReportForm;