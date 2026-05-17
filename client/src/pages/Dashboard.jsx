// Import React hooks
import React, {
  useEffect
} from "react";
import AcceptedTasks
from "../components/AcceptedTasks";
import JuniorStaffTasks
from "../components/juniortask";
import JuniorStaffAssigned
from "../components/JuniorStaffAssigned";
// Dashboard icons
import {

  FileText,

  CheckCircle,

  Clock,

  Building

} from "lucide-react";


// Translation hook
import { useTranslation }
from "react-i18next";


// Animated number counter
import CountUp
from "react-countup";


// Auth context
import { useAuth }
from "../context/AuthContext";


// Dashboard components
import MapSection
from "../components/MapSection";

import ReportsTable
from "../components/ReportsTable";

import ActivityLog
from "../components/ActivityLog";

import AddReportForm
from "../components/AddReportForm";

import AnalyticsCharts
from "../components/AnalyticsCharts";

import Footer
from "../components/Footer";



// ======================================================
// ================= DASHBOARD STATS ====================
// ======================================================

const stats = [

  {

    key: "totalIssues",

    title: "Total Issues",

    value: 1245,

    icon: FileText,

    color:
      "bg-blue-100 text-blue-600",
  },


  {

    key: "resolved",

    title: "Resolved",

    value: 980,

    icon: CheckCircle,

    color:
      "bg-green-100 text-green-600",
  },


  {

    key: "pending",

    title: "Pending",

    value: 265,

    icon: Clock,

    color:
      "bg-yellow-100 text-yellow-600",
  },


  {

    key: "departments",

    title: "Departments",

    value: 12,

    icon: Building,

    color:
      "bg-purple-100 text-purple-600",
  },
];



// ======================================================
// ================= DASHBOARD CARDS ====================
// ======================================================

const DashboardCards = () => {

  const { t } = useTranslation();

  return (

    <div className="
      grid
      grid-cols-1
      sm:grid-cols-2
      lg:grid-cols-4
      gap-6
      mb-8
    ">

      {
        stats.map((stat, index) => (

          <div

            key={index}

            className="
              bg-white
              shadow-md
              rounded-2xl
              p-5
              flex
              items-center
              justify-between
              hover:shadow-lg
              transition
              text-black
              border
              border-gray-200
            "
          >

            {/* LEFT CONTENT */}

            <div>

              <p>

                {
                  t(
                    `dashboardCards.${stat.key}`,
                    stat.title
                  )
                }

              </p>


              <h2 className="
                text-2xl
                font-bold
              ">

                <CountUp

                  start={0}

                  end={stat.value}

                  duration={2}

                  separator=","

                  delay={index * 0.3}
                />

              </h2>

            </div>



            {/* RIGHT ICON */}

            <div className={`
              p-3
              rounded-full
              ${stat.color}
            `}>

              <stat.icon
                className="
                  w-6
                  h-6
                "
              />

            </div>

          </div>
        ))
      }

    </div>
  );
};



// ======================================================
// ==================== DASHBOARD =======================
// ======================================================

const Dashboard = () => {

  // ================= USER =================

  const { user } = useAuth();



  // ======================================================
  // ================= ROLE CHECKS ========================
  // ======================================================

  const isHigherAuthority =
    user?.role === "Higher Authority";

  const isStaff =
    user?.role === "Staff";

  const isJuniorStaff =
    user?.role === "Junior Staff";



  // ======================================================
  // ================= DEBUGGING LOGS =====================
  // ======================================================

  useEffect(() => {

    console.log(
      "📊 Dashboard Loaded"
    );

    console.log(
      "👤 Current User:",
      user
    );

    console.log(
      "🛡 Role:",
      user?.role
    );

    console.log(
      "🏢 Department:",
      user?.department
    );

  }, [user]);



  // ======================================================
  // ======================= UI ===========================
  // ======================================================

  return (

    <div className="
      flex
      flex-col
      space-y-8
    ">

      {/* ====================================================== */}
      {/* ================= DASHBOARD CARDS ==================== */}
      {/* ====================================================== */}

      <DashboardCards />



      {/* ====================================================== */}
      {/* ================= MAP SECTION ======================== */}
      {/* ====================================================== */}

      <div className="
        bg-white
        rounded-lg
        shadow
        p-4
        border
        border-gray-200
      ">

        <MapSection />

      </div>



      {/* ====================================================== */}
      {/* ================= REPORTS SECTION ==================== */}
      {/* ====================================================== */}

      <div className="
        bg-white
        rounded-lg
        shadow
        p-4
        border
        border-gray-200
      ">

        {/* ====================================================== */}
        {/* ================= USER ROLE INFO ===================== */}
        {/* ====================================================== */}

        <div className="mb-6">

          <h2 className="
            text-2xl
            font-bold
            text-gray-800
          ">

            Welcome,
            {" "}
            {user?.name}

          </h2>


          <p className="
            text-sm
            text-gray-600
            mt-1
          ">

            Role:
            {" "}

            <span className="font-semibold">

              {user?.role}

            </span>

          </p>


          {
            user?.department && (

              <p className="
                text-sm
                text-gray-600
              ">

                Department:
                {" "}

                <span className="font-semibold">

                  {user?.department}

                </span>

              </p>
            )
          }

        </div>



        {/* ====================================================== */}
        {/* ================= REPORT TABLE ======================= */}
        {/* ====================================================== */}

        <ReportsTable

          role={user?.role}

          department={user?.department}

        />



        {/* ====================================================== */}
        {/* ================= STAFF ONLY ========================= */}
        {/* ====================================================== */}

 {
  isStaff && (

    <div className="
      mt-8
      space-y-10
    ">

      {/* ========================================= */}
      {/* ========== ASSIGN REPORT ================= */}
      {/* ========================================= */}

      <div>

        <h3 className="
          text-lg
          font-semibold
          text-green-700
          mb-4
        ">

          Assign Reports

        </h3>

        <AddReportForm
          currentUser={user}
        />

      </div>


      {/* ========================================= */}
      {/* ====== JUNIOR STAFF MONITORING ========== */}
      {/* ========================================= */}

      <div>

        <h3 className="
          text-lg
          font-semibold
          text-blue-700
          mb-4
        ">

          Junior Staff Monitoring

        </h3>

        <JuniorStaffAssigned />

      </div>

    </div>
  )
}


        {/* ====================================================== */}
        {/* ============ HIGHER AUTHORITY MESSAGE ================ */}
        {/* ====================================================== */}

        {/* ====================================================== */}
{/* ================= ACTIVITY LOG ======================= */}
{/* ====================================================== */}

{
  isHigherAuthority && (

    <div className="
      bg-white
      rounded-lg
      shadow
      p-4
      border
      border-gray-200
    ">

      <ActivityLog />

    </div>
  )
}



        {/* ====================================================== */}
        {/* ============== JUNIOR STAFF MESSAGE ================= */}
        {/* ====================================================== */}

       {
  isJuniorStaff && (

    <div className="
      mt-8
      space-y-10
    ">

      {/* ========================================= */}
      {/* ========= PENDING ASSIGNED TASKS ======== */}
      {/* ========================================= */}

      <div>

        <h3 className="
          text-lg
          font-semibold
          text-blue-700
          mb-4
        ">

          Assigned Tasks

        </h3>

        <JuniorStaffTasks />

      </div>


      {/* ========================================= */}
      {/* ========= ACCEPTED TASKS ================ */}
      {/* ========================================= */}

      <div>

        <h3 className="
          text-lg
          font-semibold
          text-green-700
          mb-4
        ">

          Accepted Tasks

        </h3>

        <AcceptedTasks />

      </div>

    </div>
  )
}

      </div>



      {/* ====================================================== */}
      {/* ================= ACTIVITY LOG ======================= */}
      {/* ====================================================== */}

     



      {/* ====================================================== */}
      {/* ================= ANALYTICS SECTION ================== */}
      {/* ====================================================== */}

      <div className="
        bg-white
        rounded-lg
        shadow
        p-4
        border
        border-gray-200
      ">

        <AnalyticsCharts />

      </div>



      {/* ====================================================== */}
      {/* ===================== FOOTER ========================= */}
      {/* ====================================================== */}

      <div className="
        bg-white
        rounded-lg
        shadow
        p-4
        border
        border-gray-200
      ">

        <Footer />

      </div>

    </div>
  );
};


// ======================================================
// ================= EXPORT COMPONENT ===================
// ======================================================

export default Dashboard;