// ======================================================
// ================= IMPORTS =============================
// ======================================================
import React, {
  useEffect,
  useState,
} from "react";

import AcceptedTasks from "../components/AcceptedTasks";
import JuniorStaffTasks from "../components/juniortask";
import JuniorStaffAssigned from "../components/JuniorStaffAssigned";

import {
  FileText,
  CheckCircle,
  Clock,
  Building,
  Bell,
  TrendingUp,
  User,
  ShieldCheck,
  Sparkles,
  MapPin,
  Activity,
} from "lucide-react";

import { useTranslation } from "react-i18next";

import CountUp from "react-countup";

import { useAuth } from "../context/AuthContext";

import MapSection from "../components/MapSection";
import ReportsTable from "../components/ReportsTable";
import ActivityLog from "../components/ActivityLog";
import AddReportForm from "../components/AddReportForm";
import AnalyticsCharts from "../components/AnalyticsCharts";
import Footer from "../components/Footer";

import axios from "../api/axios";
  
// ======================================================
// ================= DASHBOARD STATS ====================
// ======================================================

// ======================================================
// ================= DASHBOARD CARDS ====================
// ======================================================


const DashboardCards = ({
  dashboardStats,
}) => {

  const { t } = useTranslation();

  const stats = [

    {
      key: "totalIssues",
      title: "Total Issues",
      value:
        dashboardStats?.totalIssues || 0,
      icon: FileText,
      color:
        "bg-blue-100 text-blue-600",
    },

    {
      key: "resolved",
      title: "Resolved",
      value:
        dashboardStats?.resolved || 0,
      icon: CheckCircle,
      color:
        "bg-green-100 text-green-600",
    },

    {
      key: "pending",
      title: "Pending",
      value:
        dashboardStats?.pending || 0,
      icon: Clock,
      color:
        "bg-yellow-100 text-yellow-600",
    },

    {
      key: "departments",
      title: "Active Departments",
      value:
        dashboardStats?.departments || 0,
      icon: Building,
      color:
        "bg-purple-100 text-purple-600",
    },
  ];

  return (

    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-4
        gap-6
      "
    >

      {stats.map((stat, index) => (

        <div
          key={index}
          className="
            bg-white
            rounded-3xl
            shadow-md
            hover:shadow-xl
            transition-all
            duration-300
            border
            border-gray-100
            p-6
            relative
            overflow-hidden
          "
        >

          {/* Glow Effect */}

          <div
            className="
              absolute
              top-0
              right-0
              w-24
              h-24
              bg-gray-100
              rounded-full
              blur-3xl
              opacity-40
            "
          />

          <div
            className="
              flex
              items-center
              justify-between
              relative
              z-10
            "
          >

            <div>

              <p
                className="
                  text-gray-500
                  text-sm
                  font-medium
                "
              >
                {t(
                  `dashboardCards.${stat.key}`,
                  stat.title
                )}
              </p>

              <h2
                className="
                  text-3xl
                  font-bold
                  text-gray-800
                  mt-2
                "
              >

                <CountUp
                  start={0}
                  end={stat.value}
                  duration={2}
                  separator=","
                  delay={index * 0.2}
                />

              </h2>

              <p
                className="
                  text-xs
                  text-green-600
                  mt-2
                  flex
                  items-center
                  gap-1
                "
              >

                <TrendingUp className="w-3 h-3" />

                Live Data

              </p>

            </div>

            <div
              className={`
                p-4
                rounded-2xl
                ${stat.color}
              `}
            >

              <stat.icon className="w-7 h-7" />

            </div>

          </div>

        </div>
      ))}
    </div>
  );
};
// ======================================================
// ================= WELCOME HERO =======================
// ======================================================

const WelcomeBanner = ({
  user,
  dashboardStats,
    notificationCount,
}) => {

  const currentHour =
    new Date().getHours();

  let greeting =
    "Good Evening";

  if (currentHour < 12) {

    greeting =
      "Good Morning";

  } else if (
    currentHour < 18
  ) {

    greeting =
      "Good Afternoon";
  }

  return (

    <div
      className="
        relative
        overflow-hidden
        rounded-3xl
        bg-gradient-to-r
        from-green-600
        via-emerald-600
        to-teal-600
        text-white
        p-8
        shadow-xl
      "
    >

      {/* Decorative circles */}

      <div className="
        absolute
        -top-10
        -right-10
        w-40
        h-40
        bg-white/10
        rounded-full
      " />

      <div className="
        absolute
        bottom-0
        right-20
        w-28
        h-28
        bg-white/10
        rounded-full
      " />

      <div
        className="
          relative
          z-10
          flex
          flex-col
          lg:flex-row
          justify-between
          gap-8
        "
      >

        {/* LEFT */}

        <div>

          <div className="
            flex
            items-center
            gap-2
            mb-4
          ">

            <Sparkles className="w-5 h-5" />

            <span className="
              text-sm
              font-semibold
              tracking-wide
            ">
              Nagar Sahayata Smart Dashboard
            </span>

          </div>

          <h1 className="
            text-4xl
            font-bold
            leading-tight
          ">

            {greeting},

            <br />

            {user?.name || "User"} 👋

          </h1>

          <p className="
            mt-4
            text-white/90
            max-w-2xl
          ">

            Welcome back to your smart civic management dashboard.
            Monitor complaints, track staff activity, manage departments,
            and improve city services efficiently.

          </p>

          <div className="
            flex
            flex-wrap
            gap-4
            mt-6
          ">

            {/* ROLE */}

            <div className="
              bg-white/10
              backdrop-blur-md
              px-4
              py-3
              rounded-2xl
            ">

              <p className="
                text-sm
                text-white/80
              ">
                Role
              </p>

              <p className="
                font-semibold
                flex
                items-center
                gap-2
              ">

                <ShieldCheck className="w-4 h-4" />

                {user?.role}

              </p>

            </div>

            {/* DEPARTMENT */}

            {user?.department && (

              <div className="
                bg-white/10
                backdrop-blur-md
                px-4
                py-3
                rounded-2xl
              ">

                <p className="
                  text-sm
                  text-white/80
                ">
                  Department
                </p>

                <p className="
                  font-semibold
                  flex
                  items-center
                  gap-2
                ">

                  <Building className="w-4 h-4" />

                  {user?.department}

                </p>

              </div>
            )}

            {/* CITY */}

            <div className="
              bg-white/10
              backdrop-blur-md
              px-4
              py-3
              rounded-2xl
            ">

              <p className="
                text-sm
                text-white/80
              ">
                City
              </p>

              <p className="
                font-semibold
                flex
                items-center
                gap-2
              ">

                <MapPin className="w-4 h-4" />

                {user?.city}

              </p>

            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="
          flex
          flex-col
          justify-center
          gap-4
        ">

          {/* ACTIVE REPORTS */}

          <div className="
            bg-white/10
            backdrop-blur-md
            rounded-2xl
            p-5
            min-w-[240px]
          ">

            <div className="
              flex
              items-center
              justify-between
            ">

              <div>

                <p className="
                  text-sm
                  text-white/80
                ">
                  Active Reports
                </p>

                <h2 className="
                  text-3xl
                  font-bold
                  mt-1
                ">

                <CountUp
  start={0}
  end={
    dashboardStats?.pending || 0
  }
  duration={2}
/>
                </h2>

              </div>

              <Activity className="
                w-10
                h-10
                text-white/80
              " />

            </div>

          </div>

          {/* NOTIFICATIONS */}

          <div className="
            bg-white/10
            backdrop-blur-md
            rounded-2xl
            p-5
          ">

            <div className="
              flex
              items-center
              justify-between
            ">

              <div>

                <p className="
                  text-sm
                  text-white/80
                ">
                  Notifications
                </p>

                <h2 className="
                  text-3xl
                  font-bold
                  mt-1
                ">

                  <CountUp
                    start={0}
                    end={
  notificationCount || 0
}
                    duration={2}
                  />

                </h2>

              </div>

              <Bell className="
                w-10
                h-10
                text-white/80
              " />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

// ======================================================
// ================= QUICK ACTIONS ======================
// ======================================================

const QuickActions = () => {
  const actions = [
    {
      title: "View Reports",
      icon: FileText,
      color: "bg-blue-500",
    },

    {
      title: "Track Progress",
      icon: TrendingUp,
      color: "bg-green-500",
    },

    {
      title: "Manage Staff",
      icon: User,
      color: "bg-purple-500",
    },

    {
      title: "Activity Logs",
      icon: Activity,
      color: "bg-orange-500",
    },
  ];

  return (
    <div
      className="
        grid
        grid-cols-2
        md:grid-cols-4
        gap-5
      "
    >
      {actions.map((action, index) => (
        <div
          key={index}
          className="
            bg-white
            rounded-2xl
            shadow-md
            border
            border-gray-100
            p-5
            hover:shadow-xl
            transition-all
            duration-300
            cursor-pointer
          "
        >
          <div
            className={`
              w-14
              h-14
              rounded-2xl
              flex
              items-center
              justify-center
              text-white
              ${action.color}
            `}
          >
            <action.icon className="w-6 h-6" />
          </div>

          <h3 className="mt-4 font-semibold text-gray-800">
            {action.title}
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Access dashboard feature
          </p>
        </div>
      ))}
    </div>
  );
};


// ======================================================
// ==================== DASHBOARD =======================
// ======================================================

const Dashboard = () => {

  const { user } = useAuth();

  // ======================================================
  // ================= STATES =============================
  // ======================================================

  const [dashboardStats, setDashboardStats] =
    useState({

      totalIssues: 0,

      resolved: 0,

      pending: 0,

      departments: 0,
    });

  const [notificationCount, setNotificationCount] =
    useState(0);

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
  // ================= FETCH DATA =========================
  // ======================================================

  useEffect(() => {

    console.log("📊 Dashboard Loaded");

    console.log("👤 Current User:", user);

    console.log("🛡 Role:", user?.role);

    console.log("🏢 Department:", user?.department);

    // ======================================================
    // ================= DASHBOARD STATS ====================
    // ======================================================

    const fetchDashboardStats =
      async () => {

        try {

          const res =
            await axios.get(
              "/api/reports/dashboard-stats"
            );

          setDashboardStats(
            res.data
          );

        } catch (error) {

          console.error(
            "Dashboard Stats Error:",
            error
          );
        }
      };

    // ======================================================
    // ================= NOTIFICATIONS ======================
    // ======================================================

    const fetchNotifications =
      async () => {

        try {

          const res =
            await axios.get(
              "/api/notifications"
            );

          setNotificationCount(

            res.data?.notifications?.length || 0
          );

        } catch (error) {

          console.error(
            "Notification Error:",
            error
          );
        }
      };

    fetchDashboardStats();

    fetchNotifications();

  }, [user]);

  // ======================================================
  // ======================= UI ===========================
  // ======================================================

  return (

    <div className="flex flex-col space-y-8">

      {/* ====================================================== */}
      {/* ================= WELCOME HERO ======================= */}
      {/* ====================================================== */}

      <WelcomeBanner
        user={user}
        dashboardStats={dashboardStats}
        notificationCount={notificationCount}
      />

      {/* ====================================================== */}
      {/* ================= QUICK ACTIONS ====================== */}
      {/* ====================================================== */}

      <QuickActions />

      {/* ====================================================== */}
      {/* ================= DASHBOARD CARDS ==================== */}
      {/* ====================================================== */}

      <DashboardCards
        dashboardStats={dashboardStats}
      />

      {/* ====================================================== */}
      {/* ================= MAP SECTION ======================== */}
      {/* ====================================================== */}

      <div
        className="
          bg-white
          rounded-3xl
          shadow-md
          p-5
          border
          border-gray-100
        "
      >

        <MapSection />

      </div>

      {/* ====================================================== */}
      {/* ================= REPORT SECTION ===================== */}
      {/* ====================================================== */}

      <div
        className="
          bg-white
          rounded-3xl
          shadow-md
          p-5
          border
          border-gray-100
        "
      >

        <ReportsTable
          role={user?.role}
          department={user?.department}
        />

        {/* ====================================================== */}
        {/* ================= STAFF SECTION ====================== */}
        {/* ====================================================== */}

        {isStaff && (

          <div className="mt-10 space-y-10">

            <div>

              <h3 className="
                text-xl
                font-bold
                text-green-700
                mb-4
              ">
                Assign Reports
              </h3>

              <AddReportForm
                currentUser={user}
              />

            </div>

            <div>

              <h3 className="
                text-xl
                font-bold
                text-blue-700
                mb-4
              ">
                Junior Staff Monitoring
              </h3>

              <JuniorStaffAssigned />

            </div>

          </div>
        )}

        {/* ====================================================== */}
        {/* ================= JUNIOR STAFF ======================= */}
        {/* ====================================================== */}

        {isJuniorStaff && (

          <div className="mt-10 space-y-10">

            <div>

              <h3 className="
                text-xl
                font-bold
                text-blue-700
                mb-4
              ">
                Assigned Tasks
              </h3>

              <JuniorStaffTasks />

            </div>

            <div>

              <h3 className="
                text-xl
                font-bold
                text-green-700
                mb-4
              ">
                Accepted Tasks
              </h3>

              <AcceptedTasks />

            </div>

          </div>
        )}

      </div>

      {/* ====================================================== */}
      {/* ================= ACTIVITY LOG ======================= */}
      {/* ====================================================== */}

      {isHigherAuthority && (

        <div
          className="
            bg-white
            rounded-3xl
            shadow-md
            p-5
            border
            border-gray-100
          "
        >

          <ActivityLog />

        </div>
      )}

      {/* ====================================================== */}
      {/* ================= ANALYTICS SECTION ================== */}
      {/* ====================================================== */}

      <div
        className="
          bg-white
          rounded-3xl
          shadow-md
          p-5
          border
          border-gray-100
        "
      >

        <AnalyticsCharts />

      </div>

      {/* ====================================================== */}
      {/* ===================== FOOTER ========================= */}
      {/* ====================================================== */}

      <div
        className="
          bg-white
          rounded-3xl
          shadow-md
          p-5
          border
          border-gray-100
        "
      >

        <Footer />

      </div>

    </div>
  );
};

// ======================================================
// ================= EXPORT COMPONENT ===================
// ======================================================

export default Dashboard;