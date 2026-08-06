import React, {
  useEffect,
  useState,
} from "react";

import {
  FileText,
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
  Building,
  Sparkles,
  ShieldCheck,
  MapPin,
  Activity,
} from "lucide-react";

import CountUp from "react-countup";

import { useAuth } from "../context/AuthContext";

import MapSection from "../components/MapSection";
import ReportsTable from "../components/ReportsTable";
import AddReportForm from "../components/AddReportForm";
import JuniorStaffAssigned from "../components/JuniorStaffAssigned";
import Footer from "../components/Footer";

import { getDashboardStats } from "../services/dashboardService";
import AnalyticsCharts from "@/components/AnalyticsCharts";

const DashboardCards = ({
  dashboardStats,
}) => {

  const stats = [

    {
      key: "totalIssues",
      title: "Department Reports",
      value:
        dashboardStats?.totalIssues || 0,
      icon: FileText,
      color:
        "bg-blue-100 text-blue-600",
    },

    {
      key: "assigned",
      title: "Assigned",
      value:
        dashboardStats?.assigned || 0,
      icon: Users,
      color:
        "bg-purple-100 text-purple-600",
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
      key: "resolved",
      title: "Resolved",
      value:
        dashboardStats?.resolved || 0,
      icon: CheckCircle,
      color:
        "bg-green-100 text-green-600",
    },

  ];

  return (

    <div className="
      grid
      grid-cols-1
      sm:grid-cols-2
      lg:grid-cols-4
      gap-6
    ">

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

          <div className="
            flex
            justify-between
            items-center
            relative
            z-10
          ">

            <div>

              <p className="
                text-gray-500
                text-sm
              ">
                {stat.title}
              </p>

              <h2 className="
                text-3xl
                font-bold
                mt-2
                text-gray-800
              ">

                <CountUp
                  end={stat.value}
                  duration={2}
                />

              </h2>

              <p className="
                text-xs
                text-green-600
                mt-2
                flex
                gap-1
                items-center
              ">

                <TrendingUp className="w-3 h-3"/>

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

              <stat.icon className="w-7 h-7"/>

            </div>

          </div>

        </div>

      ))}

    </div>

  );

};

const WelcomeBanner = ({
  user,
  dashboardStats,
}) => {

  const currentHour =
    new Date().getHours();

  let greeting =
    "Good Evening";

  if(currentHour < 12){

    greeting =
      "Good Morning";

  }

  else if(currentHour < 18){

    greeting =
      "Good Afternoon";

  }

  return(

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

      <div className="
        absolute
        -top-10
        -right-10
        w-40
        h-40
        bg-white/10
        rounded-full
      "/>

      <div
        className="
          relative
          z-10
          flex
          justify-between
          flex-col
          lg:flex-row
          gap-8
        "
      >

        <div>

          <div
            className="
              flex
              items-center
              gap-2
              mb-4
            "
          >

            <Sparkles className="w-5 h-5"/>

            <span className="
              text-sm
              font-semibold
            ">
              Staff Dashboard
            </span>

          </div>

          <h1 className="
            text-4xl
            font-bold
          ">

            {greeting},

            <br/>

            {user?.name} 👋

          </h1>

          <p className="
            mt-4
            text-white/90
            max-w-2xl
          ">

            Manage reports of your department,
            assign work to junior staff,
            monitor complaint progress
            and resolve issues efficiently.

          </p>

          <div className="
            flex
            flex-wrap
            gap-4
            mt-6
          ">

            <div className="
              bg-white/10
              rounded-2xl
              px-4
              py-3
            ">

              <p className="text-sm text-white/80">
                Role
              </p>

              <p className="
                font-semibold
                flex
                gap-2
                items-center
              ">

                <ShieldCheck className="w-4 h-4"/>

                {user?.role}

              </p>

            </div>

            <div className="
              bg-white/10
              rounded-2xl
              px-4
              py-3
            ">

              <p className="text-sm text-white/80">
                Department
              </p>

              <p className="
                font-semibold
                flex
                gap-2
                items-center
              ">

                <Building className="w-4 h-4"/>

                {user?.department}

              </p>

            </div>

            <div className="
              bg-white/10
              rounded-2xl
              px-4
              py-3
            ">

              <p className="text-sm text-white/80">
                City
              </p>

              <p className="
                font-semibold
                flex
                gap-2
                items-center
              ">

                <MapPin className="w-4 h-4"/>

                {user?.city}

              </p>

            </div>

          </div>

        </div>

                <div className="flex flex-col justify-center gap-4">

          <div
            className="
              bg-white/10
              backdrop-blur-md
              rounded-2xl
              p-5
              min-w-[240px]
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <div>

                <p className="text-sm text-white/80">
                  Pending Reports
                </p>

                <h2 className="text-3xl font-bold mt-1">

                  <CountUp
                    start={0}
                    end={dashboardStats?.pending || 0}
                    duration={2}
                  />

                </h2>

              </div>

              <Activity className="w-10 h-10 text-white/80" />

            </div>

          </div>

        </div>

      </div>

    </div>

  );

};

const StaffDashboard = () => {

  const { user } = useAuth();

  const [dashboardStats, setDashboardStats] =
    useState({

      totalIssues: 0,

      assigned: 0,

      pending: 0,

      resolved: 0,

    });

  useEffect(() => {

    const fetchDashboardStats =
      async () => {

        try {

          const data =
            await getDashboardStats();

          setDashboardStats({

            totalIssues:
              data.totalIssues || 0,

            assigned:
              data.assigned || 0,

            pending:
              data.pending || 0,

            resolved:
              data.resolved || 0,

          });

        } catch (error) {

          console.error(
            "Dashboard Stats Error:",
            error
          );

        }

      };

    fetchDashboardStats();

  }, [user]);

  return (

    <div className="flex flex-col space-y-8">

      <WelcomeBanner
        user={user}
        dashboardStats={dashboardStats}
      />

      <DashboardCards
        dashboardStats={dashboardStats}
      />

      {/* MAP */}

      <div
        className="
          bg-white
          rounded-3xl
          shadow-md
          border
          border-gray-100
          p-5
        "
      >

        <MapSection />

      </div>

      {/* REPORTS */}

      <div
        className="
          bg-white
          rounded-3xl
          shadow-md
          border
          border-gray-100
          p-5
        "
      >

        <ReportsTable
          role={user?.role}
          department={user?.department}
        />

      </div>

      {/* ADD REPORT */}

      <div
        className="
          bg-white
          rounded-3xl
          shadow-md
          border
          border-gray-100
          p-5
        "
      >

        <AddReportForm
          currentUser={user}
        />

      </div>

      {/* JUNIOR STAFF */}

      <div
        className="
          bg-white
          rounded-3xl
          shadow-md
          border
          border-gray-100
          p-5
        "
      >

        <JuniorStaffAssigned />

        </div>
      <div
        className="
          bg-white
          rounded-3xl
          shadow-md
          border
          border-gray-100
          p-5
        "
      >

        <AnalyticsCharts />

      </div>

      {/* FOOTER */}

      <div
        className="
          bg-white
          rounded-3xl
          shadow-md
          border
          border-gray-100
          p-5
        "
      >

        <Footer />

      </div>

    </div>

  );

};

export default StaffDashboard;