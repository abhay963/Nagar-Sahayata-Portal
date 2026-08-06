import React, { useEffect, useState } from "react";

import {
  ClipboardCheck,
  Clock,
  CheckCircle,
  TrendingUp,
  User,
  Sparkles,
  ShieldCheck,
  Building,
} from "lucide-react";

import CountUp from "react-countup";

import { useAuth } from "../context/AuthContext";

import AcceptedTask from "../components/AcceptedTasks";
import JuniorStaffTasks from "../components/juniortask";
import Footer from "../components/Footer";

import { getDashboardStats } from "../services/dashboardService";

const DashboardCards = ({ dashboardStats }) => {
  const stats = [
    {
      title: "Assigned Tasks",
      value: dashboardStats?.assigned || 0,
      icon: ClipboardCheck,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Pending",
      value: dashboardStats?.pending || 0,
      icon: Clock,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Completed",
      value: dashboardStats?.completed || 0,
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Progress",
      value: dashboardStats?.progress || 0,
      icon: TrendingUp,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-3xl shadow-md border border-gray-100 p-6"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">{item.title}</p>

              <h2 className="text-3xl font-bold mt-2">
                <CountUp end={item.value} duration={2} />
              </h2>
            </div>

            <div className={`p-4 rounded-2xl ${item.color}`}>
              <item.icon className="w-7 h-7" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const WelcomeBanner = ({ user }) => {
  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";

  return (
    <div className="rounded-3xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white p-8 shadow-xl">

      <div className="flex justify-between flex-wrap gap-6">

        <div>

          <div className="flex items-center gap-2 mb-4">

            <Sparkles className="w-5 h-5" />

            <span className="font-semibold">
              Junior Staff Dashboard
            </span>

          </div>

          <h1 className="text-4xl font-bold">
            {greeting},
            <br />
            {user?.name}
          </h1>

          <p className="mt-4 text-white/90">
            View your assigned complaints, update progress,
            upload work proof and complete assigned tasks.
          </p>

        </div>

        <div className="flex gap-4 flex-wrap">

          <div className="bg-white/10 rounded-2xl px-5 py-4">

            <p className="text-sm text-white/80">
              Role
            </p>

            <p className="font-semibold flex gap-2 items-center">
              <ShieldCheck className="w-4 h-4" />
              {user?.role}
            </p>

          </div>

          <div className="bg-white/10 rounded-2xl px-5 py-4">

            <p className="text-sm text-white/80">
              Department
            </p>

            <p className="font-semibold flex gap-2 items-center">
              <Building className="w-4 h-4" />
              {user?.department}
            </p>

          </div>

          <div className="bg-white/10 rounded-2xl px-5 py-4">

            <p className="text-sm text-white/80">
              Officer
            </p>

            <p className="font-semibold flex gap-2 items-center">
              <User className="w-4 h-4" />
              {user?.name}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

function JuniorStaffDashboard() {

  const { user } = useAuth();

  const [dashboardStats, setDashboardStats] = useState({
    assigned: 0,
    pending: 0,
    completed: 0,
    progress: 0,
  });

  useEffect(() => {

    const loadDashboard = async () => {

      try {

        const data = await getDashboardStats();

        setDashboardStats({
          assigned: data.assigned || 0,
          pending: data.pending || 0,
          completed: data.completed || 0,
          progress: data.progress || 0,
        });

      } catch (err) {

        console.error(err);

      }

    };

    loadDashboard();

  }, []);

  return (

    <div className="flex flex-col gap-8">

      <WelcomeBanner user={user} />

      <DashboardCards dashboardStats={dashboardStats} />

   

      <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6">

        <JuniorStaffTasks />

      </div>

         <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6">

       <AcceptedTask/>

      </div>

      <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6">

        <Footer />

      </div>

    </div>
  );
}

export default JuniorStaffDashboard;