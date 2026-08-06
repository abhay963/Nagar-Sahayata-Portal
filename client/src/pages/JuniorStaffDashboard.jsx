import React, { useEffect, useState } from "react";
import {
  User,
  Sparkles,
  ShieldCheck,
  Building,
  MapPin,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AcceptedTask from "../components/AcceptedTasks";
import JuniorStaffTasks from "../components/juniortask";
import Footer from "../components/Footer";
import { getDashboardStats } from "../services/dashboardService";
import AnalyticsCharts from "@/components/AnalyticsCharts";
import MapSection from "@/components/MapSection";

const WelcomeBanner = ({ user }) => {
  const hour = new Date().getHours();
  let greeting = "Good Evening";
  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";

  return (
    <div
      className="
        relative overflow-hidden
        rounded-3xl
        bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600
        text-white
        p-8 md:p-10
        shadow-2xl shadow-emerald-900/25
      "
    >
      {/* Soft decorative blobs */}
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-16 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-white/5 rounded-full blur-2xl" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 mb-5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
            <Sparkles className="w-4 h-4 text-emerald-100" />
            <span className="text-xs font-semibold tracking-wider uppercase text-emerald-50">
              Junior Staff Dashboard
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.15]">
            {greeting},
            <br />
            <span className="text-white drop-shadow-sm">{user?.name} 👋</span>
          </h1>

          <p className="mt-5 text-base md:text-lg text-white/85 leading-relaxed max-w-xl">
            View your assigned complaints, update progress, upload work proof
            and complete tasks efficiently.
          </p>
        </div>

        {/* Info chips */}
        <div className="flex flex-wrap gap-3">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-5 py-3.5 border border-white/10 hover:bg-white/15 transition">
            <p className="text-xs text-white/70 mb-1">Role</p>
            <p className="font-semibold flex items-center gap-2 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-200" />
              {user?.role}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-5 py-3.5 border border-white/10 hover:bg-white/15 transition">
            <p className="text-xs text-white/70 mb-1">Department</p>
            <p className="font-semibold flex items-center gap-2 text-sm">
              <Building className="w-4 h-4 text-emerald-200" />
              {user?.department}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-5 py-3.5 border border-white/10 hover:bg-white/15 transition">
            <p className="text-xs text-white/70 mb-1">Officer</p>
            <p className="font-semibold flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-emerald-200" />
              {user?.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionCard = ({ children, className = "" }) => (
  <div
    className={`
      bg-white/90 backdrop-blur-sm
      rounded-3xl
      shadow-lg shadow-gray-200/50
      border border-gray-100/80
      p-5 md:p-6
      transition-all duration-300
      hover:shadow-xl hover:shadow-gray-200/70
      ${className}
    `}
  >
    {children}
  </div>
);

function JuniorStaffDashboard() {
  const { user } = useAuth();

  // Kept for compatibility (in case other components need it later)
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
    <div className="flex flex-col gap-7 md:gap-8">
      {/* Hero Banner */}
      <WelcomeBanner user={user} />

      {/* Map */}
      <SectionCard>
        <MapSection />
      </SectionCard>

      {/* Tasks */}
      <SectionCard>
        <JuniorStaffTasks />
      </SectionCard>

      {/* Accepted Tasks */}
      <SectionCard>
        <AcceptedTask />
      </SectionCard>

      {/* Analytics */}
      <SectionCard>
        <AnalyticsCharts />
      </SectionCard>

      {/* Footer */}
      <SectionCard>
        <Footer />
      </SectionCard>
    </div>
  );
}

export default JuniorStaffDashboard;