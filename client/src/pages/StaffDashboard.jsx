import React from "react";
import {
  Building,
  Sparkles,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import MapSection from "../components/MapSection";
import ReportsTable from "../components/ReportsTable";
import AddReportForm from "../components/AddReportForm";
import JuniorStaffAssigned from "../components/JuniorStaffAssigned";
import Footer from "../components/Footer";
import AnalyticsCharts from "@/components/AnalyticsCharts";

const WelcomeBanner = ({ user }) => {
  const currentHour = new Date().getHours();
  let greeting = "Good Evening";
  if (currentHour < 12) greeting = "Good Morning";
  else if (currentHour < 18) greeting = "Good Afternoon";

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white p-8 md:p-10 shadow-2xl shadow-emerald-900/20">
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute -bottom-20 -left-12 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
          <Sparkles className="w-4 h-4 text-emerald-100" />
          <span className="text-xs font-semibold tracking-wide uppercase text-emerald-50">
            Staff Dashboard
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
          {greeting},
          <br />
          <span className="text-white">{user?.name} 👋</span>
        </h1>

        <p className="mt-5 text-base md:text-lg text-white/85 max-w-2xl leading-relaxed">
          Manage reports of your department, assign work to junior staff,
          monitor complaint progress and resolve issues efficiently.
        </p>

        <div className="flex flex-wrap gap-3 mt-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-5 py-3.5 border border-white/10">
            <p className="text-xs text-white/70 mb-1">Role</p>
            <p className="font-semibold flex gap-2 items-center text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-200" />
              {user?.role}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-5 py-3.5 border border-white/10">
            <p className="text-xs text-white/70 mb-1">Department</p>
            <p className="font-semibold flex gap-2 items-center text-sm">
              <Building className="w-4 h-4 text-emerald-200" />
              {user?.department}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-5 py-3.5 border border-white/10">
            <p className="text-xs text-white/70 mb-1">City</p>
            <p className="font-semibold flex gap-2 items-center text-sm">
              <MapPin className="w-4 h-4 text-emerald-200" />
              {user?.city}
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
      shadow-lg shadow-gray-200/60
      border border-gray-100/80
      p-5 md:p-6
      transition-all duration-300
      hover:shadow-xl hover:shadow-gray-200/80
      ${className}
    `}
  >
    {children}
  </div>
);

const StaffDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col space-y-7 md:space-y-8 pb-10">
      <WelcomeBanner user={user} />

      <SectionCard>
        <MapSection />
      </SectionCard>

      {/* Reports - now properly contained & scrollable */}
      <SectionCard>
        <ReportsTable role={user?.role} department={user?.department} />
      </SectionCard>

      <SectionCard>
        <AddReportForm currentUser={user} />
      </SectionCard>

      <SectionCard>
        <JuniorStaffAssigned />
      </SectionCard>

      <SectionCard>
        <AnalyticsCharts />
      </SectionCard>

      <SectionCard>
        <Footer />
      </SectionCard>
    </div>
  );
};

export default StaffDashboard;