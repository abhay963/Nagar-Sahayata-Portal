import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere } from "@react-three/drei";
import { 
  Building2, 
  Mail, 
  FileText, 
  Search, 
  Layers, 
  ArrowUpRight,
  SlidersHorizontal,
  ChevronRight
} from "lucide-react";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get("/api/users/departments-list");
      setDepartments(res.data.departments);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDepartments = departments.filter((dept) => {
    const matchesSearch = dept.department.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedFilter === "high-activity") {
      return matchesSearch && dept.totalReports > 10;
    }
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#00a65a] border-t-transparent rounded-full"
        />
        <p className="text-[#00a65a] font-semibold tracking-wide text-sm">
          Loading Departments Portal...
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-[#f4f6f9] text-slate-800 overflow-x-hidden selection:bg-[#00a65a]/20 selection:text-[#00a65a]">
      
      {/* 3D Ambient Canvas styled to blend with the Civic Banner look */}
      <div className="absolute top-0 left-0 w-full h-[320px] pointer-events-none z-0 opacity-25">
        <Canvas camera={{ position: [0, 0, 5], ffov: 50 }}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 5, 2]} intensity={1} color="#00a65a" />
          <Float speed={2.5} rotationIntensity={1} floatIntensity={1}>
            <Sphere args={[1.2, 64, 64]} position={[3, 0, -1]}>
              <MeshDistortMaterial
                color="#00a65a"
                attach="material"
                distort={0.3}
                speed={3}
                roughness={0.4}
              />
            </Sphere>
          </Float>
        </Canvas>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen flex flex-col">
        
        {/* Civic Hero Welcome Banner - matching your image theme exactly */}
        <header className="bg-gradient-to-r from-[#00a65a] to-[#008d4c] text-white rounded-3xl p-8 shadow-lg shadow-emerald-900/10 mb-8 relative overflow-hidden">
          {/* Subtle background design accents */}
          <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />
          <div className="absolute right-20 top-[-20px] w-32 h-32 bg-white/5 rounded-full pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 text-emerald-100 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md mb-4">
              <Layers className="w-3.5 h-3.5" /> Nagar Sahayata Administrative Panel
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Departments
            </h1>
            <p className="text-emerald-100/90 text-sm md:text-base mt-2 max-w-2xl font-light">
              Overview system architecture, communications vectors, and collective public incident summaries across active regional grids.
            </p>
          </motion.div>
        </header>

        {/* Dynamic Controls Layout */}
        <section className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-200/60">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Filter specific city directives..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#00a65a] focus:bg-white rounded-xl pl-10 pr-4 py-2 text-sm text-slate-700 placeholder-slate-400 outline-none transition-all duration-150"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <button 
              onClick={() => setSelectedFilter("all")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${selectedFilter === 'all' ? 'bg-[#00a65a] text-white shadow-md shadow-emerald-600/10' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              All Directives
            </button>
            <button 
              onClick={() => setSelectedFilter("high-activity")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${selectedFilter === 'high-activity' ? 'bg-[#00a65a] text-white shadow-md shadow-emerald-600/10' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              High Activity
            </button>
          </div>
        </section>

        {/* Civic Grid Cards Container */}
        <main className="flex-1">
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredDepartments.map((dept, index) => (
                <motion.div
                  key={dept.id || index}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35 }}
                  whileHover={{ y: -4 }}
                  className="group relative flex flex-col bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  {/* Subtle hover line to provide clear interface feedback */}
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-transparent group-hover:bg-[#00a65a] transition-all" />

                  {/* Card Main Structure */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-emerald-50 group-hover:border-emerald-100 text-[#00a65a] transition-all">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00a65a] mr-1.5" />
                        Active Unit
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-slate-800 group-hover:text-[#00a65a] transition-colors line-clamp-1 mb-1">
                      {dept.department}
                    </h2>
                    <p className="text-[11px] font-mono tracking-wider text-slate-400 mb-4">
                      UNIT CODE: #NS-0{100 + index}
                    </p>

                    {/* Highly Segmented Metrics Rows */}
                    <div className="space-y-2 border-t border-slate-100 pt-4">
                      <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                          <FileText className="w-4 h-4 text-[#00a65a]/80" />
                          <span>Active Reports</span>
                        </div>
                        <span className="text-xs font-bold font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {dept.totalReports}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-medium min-w-0">
                          <Mail className="w-4 h-4 text-[#00a65a]/80" />
                          <span className="truncate">Official Email</span>
                        </div>
                        <span className="text-xs font-mono text-slate-500 truncate max-w-[170px] hover:text-[#00a65a] select-all cursor-pointer">
                          {dept.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Zero Search Results State */}
          {filteredDepartments.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white border border-dashed border-slate-300 rounded-2xl"
            >
              <div className="inline-flex p-3 rounded-full bg-slate-50 text-slate-400 mb-3">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-700">No departments found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                No active records match your search criteria. Try modifying your entry parameters.
              </p>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Departments;