import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import MapSection from "../components/MapSection";
import {
  FaMapMarkedAlt,
  FaCity,
  FaUsers,
  FaChartLine,
  FaShieldAlt,
  FaCheckCircle,
  FaLeaf,
  FaRoad,
  FaWater,
  FaLightbulb,
  FaExclamationTriangle,
  FaBell,
  FaGlobeAsia,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { Menu, X, ArrowUpRight, Award, Zap, HelpCircle, Mail, Phone, MapPin } from "lucide-react";

// Shadcn UI Imports
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    title: "Live Issue Tracking",
    desc: "Real-time monitoring and map-based tracking for every complaint submitted across Jharkhand.",
    icon: <FaMapMarkedAlt size={32} />,
  },
  {
    title: "Smart Analytics",
    desc: "Provides useful insights to help local departments resolve recurring civic issues faster.",
    icon: <FaChartLine size={32} />,
  },
  {
    title: "Easy Citizen Reporting",
    desc: "Simple, mobile-friendly forms to report issues with photos and precise locations.",
    icon: <FaUsers size={32} />,
  },
  {
    title: "Department Dashboard",
    desc: "A centralized dashboard for all municipal corporations in Jharkhand to manage tasks.",
    icon: <FaCity size={32} />,
  },
  {
    title: "Transparent Updates",
    desc: "Clear status updates for citizens from the moment an issue is assigned to urban local bodies.",
    icon: <FaShieldAlt size={32} />,
  },
  {
    title: "Eco Initiatives",
    desc: "Track local waste management efficiency and green city goals for a cleaner state.",
    icon: <FaLeaf size={32} />,
  },
];

const departments = [
  { name: "Road Maintenance", icon: <FaRoad size={42} />, desc: "Potholes, broken footpaths, and street repairs." },
  { name: "Water Supply", icon: <FaWater size={42} />, desc: "Leakages, low water pressure, and urban supply issues." },
  { name: "Garbage & Cleaning", icon: <FaExclamationTriangle size={42} />, desc: "Waste collection, public bins, and market sweeping." },
  { name: "Street Lighting", icon: <FaLightbulb size={42} />, desc: "Broken streetlights and dark spot management." },
  { name: "Public Parks", icon: <FaLeaf size={42} />, desc: "Maintenance of green spaces and community parks." },
  { name: "Public Safety", icon: <FaShieldAlt size={42} />, desc: "Reporting hazards, structural safety, and public obstructions." },
];

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Resident, Ranchi",
    feedback: "The portal is straightforward to use. The broken streetlight on our lane in Kanke Road was fixed within two days of filing the report.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Priya Verma",
    role: "Municipal Official, Jamshedpur",
    feedback: "Nagar Sahayata helps our ground team track complaints systematically, improving our turnaround time significantly.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Amit Kumar",
    role: "Field Supervisor, Dhanbad",
    feedback: "Getting clear location links and images directly on our app makes finding and fixing municipal problems very easy.",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
  },
];

const faqData = [
  {
    q: "How does the portal forward complaints to the right department?",
    a: "When you submit a complaint with a category and photo, our system automatically tags your location and forwards it to the nearest urban local body (ULB) or municipal corporation in Jharkhand responsible for that area.",
  },
  {
    q: "Can I check the progress of my reported issue?",
    a: "Yes. You will receive progress notifications whenever the municipal department reviews your issue, assigns a field team, and marks it fixed.",
  },
  {
    q: "Is this platform available for all cities in Jharkhand?",
    a: "We are expanding city by city across the state. You can view our live tracking map to see if your local municipal corporation or Nagar Parishad is currently active on the platform.",
  },
];

const StatCard = ({ end, suffix, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-center shadow-2xl hover:shadow-emerald-900/20 hover:border-emerald-500/40 transition-all cursor-pointer group text-white"
  >
    <h3 className="text-5xl font-bold text-emerald-400 mb-2 group-hover:text-emerald-300 transition-colors">
      <CountUp end={end} suffix={suffix} enableScrollSpy />
    </h3>
    <p className="text-emerald-200/60 text-sm tracking-wider font-medium uppercase">{label}</p>
  </motion.div>
);

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const jharkhandHubs = {
    "ranchi": { title: "Ranchi Zone", tickets: "242 Active Issues", resolution: "94.2% Solved", speed: "4.2 hrs avg" },
    "jamshedpur": { title: "Jamshedpur Region", tickets: "312 Active Issues", resolution: "95.8% Solved", speed: "3.8 hrs avg" },
    "dhanbad": { title: "Dhanbad Hub", tickets: "189 Active Issues", resolution: "91.5% Solved", speed: "5.5 hrs avg" },
    "bokaro": { title: "Bokaro Steel City", tickets: "125 Active Issues", resolution: "93.0% Solved", speed: "4.1 hrs avg" },
  };

  return (
    <div className="bg-[#062419] text-white overflow-x-hidden font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 pt-4">
        <div className="max-w-7xl mx-auto bg-gradient-to-r from-emerald-900/90 via-green-800/90 to-teal-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl transition-all duration-300">
          <div className="px-6 py-4 flex items-center justify-between">
            
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer group">
              <motion.div 
                whileHover={{ rotate: 8, scale: 1.05 }}
                className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20 shadow-inner"
              >
                <img
                  src="/government-of-jharkhand.png"
                  alt="Government of Jharkhand"
                  className="w-9 h-9 object-contain"
                />
              </motion.div>
              <div>
                <div className="font-extrabold text-2xl tracking-tight text-white group-hover:text-emerald-200 transition-colors">
                  Nagar Sahayata
                </div>
                <div className="text-[10px] text-emerald-300 font-light tracking-widest uppercase">
                  Government of Jharkhand
                </div>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide">
              {["Features", "How it Works", "Departments", "Live Map", "FAQ"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-emerald-100/80 hover:text-white transition-colors cursor-pointer relative group py-1"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>

            {/* Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="px-5 py-2.5 rounded-xl text-sm font-medium text-emerald-100 hover:bg-white/10 transition-all border border-transparent hover:border-white/10 cursor-pointer">
                Sign In
              </Link>
              <Link to="/signup" className="cursor-pointer">
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0 10px 20px -10px rgba(16,185,129,0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold text-sm tracking-wide shadow-lg cursor-pointer border border-emerald-400/20"
                >
                  Register as City
                </motion.button>
              </Link>
            </div>

            {/* Mobile Button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-emerald-400 cursor-pointer">
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden mt-2 bg-emerald-950/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex flex-col gap-4 font-medium text-emerald-100">
                <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-lg py-2 cursor-pointer hover:text-white">Features</a>
                <a href="#how-it-works" onClick={() => setIsMenuOpen(false)} className="text-lg py-2 cursor-pointer hover:text-white">How it Works</a>
                <a href="#departments" onClick={() => setIsMenuOpen(false)} className="text-lg py-2 cursor-pointer hover:text-white">Departments</a>
                <a href="#live-map" onClick={() => setIsMenuOpen(false)} className="text-lg py-2 cursor-pointer hover:text-white">Live Map</a>
                <a href="#faq" onClick={() => setIsMenuOpen(false)} className="text-lg py-2 cursor-pointer hover:text-white">FAQ</a>

                <div className="h-px bg-white/10 my-2" />
                <Link to="/login" className="w-full text-center py-3 rounded-xl bg-white/5 font-semibold cursor-pointer text-white">Sign In</Link>
                <Link to="/signup" className="w-full cursor-pointer">
                  <button className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold cursor-pointer">
                    Register as City
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO SECTION */}
      <section className="min-h-screen pt-32 pb-16 relative flex items-center overflow-hidden bg-gradient-to-b from-emerald-950/40 via-transparent to-transparent">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,#10b981_0%,transparent_50%)] opacity-15 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
          
          {/* LEFT CONTENT */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-xs tracking-wider uppercase">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
              Jharkhand Civic Grievance System
            </div>

            <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight text-white">
              Better Amenities.<br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 bg-clip-text text-transparent">
                Faster Resolutions.
              </span>
            </h1>

            <p className="text-lg text-emerald-100/70 max-w-lg leading-relaxed">
              A reliable and simple digital portal for citizens across Jharkhand to report municipal issues directly to local authorities.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/signup" className="cursor-pointer">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  className="px-8 py-4 bg-white text-emerald-950 hover:bg-emerald-50 rounded-2xl font-bold text-lg flex items-center gap-2 shadow-xl cursor-pointer"
                >
                  File a Complaint <ArrowUpRight size={20} />
                </motion.button>
              </Link>
              <a href="#live-map" className="px-8 py-4 border border-white/20 hover:border-emerald-500/60 rounded-2xl font-semibold text-lg transition-all bg-white/5 backdrop-blur-md shadow-sm text-white cursor-pointer">
                View Active Issues
              </a>
            </div>

            <div className="flex items-center gap-6 text-xs text-emerald-300/60 font-semibold uppercase tracking-wider pt-4">
              <div className="flex items-center gap-2"><Award size={16} className="text-emerald-400" /> State Verified Portal</div>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-800" />
              <div className="flex items-center gap-2"><Zap size={16} className="text-teal-400" /> Real-time Updates</div>
            </div>
          </div>

          {/* RIGHT CONTENT - SHADCN TABS FOR REGIONAL METRICS */}
         <div className="relative h-[560px] flex items-center justify-center">
  <Card className="w-full h-full bg-gradient-to-br from-white/5 to-emerald-950/30 border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative flex flex-col justify-between overflow-hidden backdrop-blur-md text-white group/card">
    {/* Animated background accent */}
    <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl group-hover/card:bg-emerald-500/20 transition-all duration-700" />
    <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

    {/* Top Indicator Header */}
    <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-5 shadow-inner w-full backdrop-blur-xl flex justify-between items-center">
      <div>
        <p className="text-emerald-400 text-xs tracking-widest font-bold uppercase flex items-center gap-2">
          <FaGlobeAsia className="animate-spin-slow text-teal-400" /> LIVE STATE ACTIVITY
        </p>
        <h2 className="text-5xl font-black mt-1 text-white tracking-tight drop-shadow-[0_4px_12px_rgba(16,185,129,0.2)]">885</h2>
      </div>
      <div className="text-right max-w-[180px]">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          SYSTEM LIVE
        </div>
        <p className="text-[11px] font-medium text-emerald-200/50 leading-tight">
          Active issues handled across Jharkhand ULBs
        </p>
      </div>
    </div>

    {/* Shadcn Tabs Architecture */}
    <Tabs defaultValue="ranchi" className="w-full z-10 mt-4 flex flex-col flex-1 justify-end">
      <TabsList className="grid grid-cols-2 md:grid-cols-4 bg-emerald-950/80 border border-emerald-800/40 p-1.5 rounded-xl h-auto gap-1 shadow-inner">
        {Object.keys(jharkhandHubs).map((key) => (
          <motion.div key={key} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
            <TabsTrigger
              value={key}
              className="w-full text-xs font-bold py-2.5 px-2 text-emerald-200/50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500/20 data-[state=active]:to-teal-500/20 data-[state=active]:text-emerald-300 data-[state=active]:border-emerald-500/30 border border-transparent rounded-lg transition-all duration-300 cursor-pointer"
            >
              {jharkhandHubs[key].title.split(" ")[0]}
            </TabsTrigger>
          </motion.div>
        ))}
      </TabsList>

      {Object.keys(jharkhandHubs).map((key) => {
        // Parsing raw metric string for the custom progress bar metrics visualizer
        const numericResolution = parseFloat(jharkhandHubs[key].resolution) || 90;

        return (
          <TabsContent key={key} value={key} className="mt-5 focus-visible:outline-none focus-visible:ring-0">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-gradient-to-b from-emerald-950/90 to-emerald-950/60 border-emerald-900/60 rounded-2xl p-5 font-sans text-emerald-200 shadow-xl relative overflow-hidden backdrop-blur-xl">
                
                {/* Header elements inside card */}
                <CardHeader className="p-0 mb-4 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-bold text-white flex items-center gap-2 tracking-wide">
                    <span className="text-emerald-400">📍</span> {jharkhandHubs[key].title}
                  </CardTitle>
                  <Badge className="bg-gradient-to-r from-teal-500/20 to-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono tracking-tight font-bold text-xs px-2.5 py-0.5">
                    {jharkhandHubs[key].resolution}
                  </Badge>
                </CardHeader>

                {/* Main analytical elements inside card */}
                <CardContent className="p-0 space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-400/60 mb-0.5">Current Workload</p>
                      <span className="text-white text-lg font-extrabold tracking-tight font-mono">{jharkhandHubs[key].tickets}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-400/60 mb-0.5">Turnaround</p>
                      <span className="text-teal-400 text-sm font-bold font-mono bg-teal-500/5 px-2 py-1 rounded-md border border-teal-500/10">{jharkhandHubs[key].speed}</span>
                    </div>
                  </div>

                  {/* Micro Visual Analytics Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-[10px] text-emerald-100/40 font-bold uppercase tracking-wider">
                      <span>Resolution Velocity</span>
                      <span className="text-emerald-400 font-mono">{numericResolution}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-emerald-950 rounded-full border border-white/5 overflow-hidden p-[1px]">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${numericResolution}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                      />
                    </div>
                  </div>
                </CardContent>

              </Card>
            </motion.div>
          </TabsContent>
        );
      })}
    </Tabs>
  </Card>
</div>

        </div>
      </section>

      {/* RECENT MUNICIPAL UPDATES TICKER */}
      <section className="bg-emerald-950 border-y border-emerald-900/60 py-4 overflow-hidden">
        <div className="flex whitespace-nowrap items-center gap-10 animate-[marquee_25s_linear_infinite]">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-12 text-sm font-semibold tracking-wider text-emerald-200/70 uppercase">
              <span className="flex items-center gap-2 text-emerald-400"><FaBell /> Ranchi Ward 5: Garbage cleaning completed</span>
              <span>•</span>
              <span className="flex items-center gap-2 text-teal-400"><FaCheckCircle /> Jamshedpur East: 42 streetlights repaired this week</span>
              <span>•</span>
              <span className="flex items-center gap-2 text-yellow-400"><FaExclamationTriangle /> Dhanbad Hub: Water pipeline leak maintenance completed</span>
              <span>•</span>
              <span className="flex items-center gap-2 text-green-400"><FaLeaf /> Bokaro Sector 4: Public park green space updated</span>
              <span>•</span>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard end={12000} suffix="+" label="Registered Citizens" delay={0.1} />
          <StatCard end={4500} suffix="+" label="Resolved Complaints" delay={0.2} />
          <StatCard end={94} suffix="%" label="User Satisfaction" delay={0.3} />
          <StatCard end={18} suffix="" label="Active Urban Bodies" delay={0.4} />
        </div>
      </section>

      {/* CORE FEATURES */}
      <section id="features" className="py-28 px-6 relative bg-emerald-950/20 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="uppercase tracking-[3px] text-emerald-400 text-xs font-bold">Portal Features</div>
            <h2 className="text-4xl md:text-5xl font-black mt-3 tracking-tight text-white">Designed for Clear Communication</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -8, borderColor: "rgba(16,185,129,0.3)", backgroundColor: "rgba(255,255,255,0.05)" }}
                className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl transition-all cursor-pointer group backdrop-blur-md"
              >
                <div className="text-emerald-400 mb-6 group-hover:scale-110 transition-transform inline-block">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 tracking-tight text-white group-hover:text-emerald-400 transition-colors">{feature.title}</h3>
                <p className="text-emerald-100/70 leading-relaxed text-sm font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-28 bg-transparent px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">How It Works</h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {["Report Issue", "Auto Sorting", "Team Assignment", "Issue Resolved"].map((step, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl relative cursor-pointer hover:border-emerald-500/30 transition-all backdrop-blur-md">
                <div className="text-emerald-400/10 font-mono text-7xl font-black absolute top-2 right-4 select-none">{index + 1}</div>
                <h3 className="text-xl font-bold mb-2 pt-8 relative z-10 text-white">{step}</h3>
                <p className="text-emerald-100/60 text-sm font-medium relative z-10">Submit photos and info to let your city's local team fix the issue quickly.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEPARTMENTS */}
      <section id="departments" className="py-28 px-6 bg-emerald-950/20 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">Departments We Serve</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
                className="bg-white/5 border border-white/10 hover:border-emerald-500/40 p-8 rounded-3xl shadow-2xl transition-all cursor-pointer flex items-start gap-5 backdrop-blur-md"
              >
                <div className="text-emerald-400 mt-1">{dept.icon}</div>
                <div>
                  <h3 className="text-xl font-bold mb-1 tracking-tight text-white">{dept.name}</h3>
                  <p className="text-emerald-100/60 text-sm font-medium">{dept.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE MAP SECTION */}
      <section id="live-map" className="py-28 px-6 bg-transparent border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="uppercase text-emerald-400 text-xs font-bold tracking-widest mb-3">State Map Matrix</div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">Live Complaint Tracking Map</h2>
            <p className="mt-4 text-emerald-100/70 text-md max-w-xl mx-auto font-medium">
              View reported issues across regions in Jharkhand, follow current maintenance tasks, and check newly completed work.
            </p>
          </div>

          <div className="rounded-[2.5rem] overflow-hidden border border-white/10 bg-emerald-950/40 shadow-2xl backdrop-blur-md">
            <div className="h-[650px] w-full cursor-pointer">
              <MapSection isGuest={true} />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION WITH SHADCN ACCORDION */}
      <section id="faq" className="py-28 px-6 border-t border-white/5 bg-emerald-950/20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-widest mb-2">
              <HelpCircle size={16} /> FAQ
            </div>
            <h2 className="text-4xl font-black tracking-tight text-white">Frequently Asked Questions</h2>
          </div>

          {/* Shadcn Accordion Framework */}
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqData.map((faq, index) => (
              <AccordionItem 
                value={`item-${index}`} 
                key={index}
                className="bg-white/5 border border-white/10 rounded-2xl px-6 py-1 shadow-xl backdrop-blur-md border-b-0 data-[state=open]:border-emerald-500/30 transition-all duration-300"
              >
                <AccordionTrigger className="font-bold text-lg text-white hover:text-emerald-300 hover:no-underline text-left py-4 tracking-wide group">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-emerald-100/70 text-sm leading-relaxed font-medium pb-5 pt-1">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-28 px-6 border-t border-white/5 bg-transparent">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-4xl md:text-5xl font-black mb-20 tracking-tight text-white">What Jharkhand Citizens Say</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-3xl flex flex-col justify-between shadow-xl cursor-pointer hover:border-white/20 transition-all backdrop-blur-md">
                <p className="text-emerald-100/80 font-medium text-md leading-relaxed mb-6">“{t.feedback}”</p>
                <div className="flex items-center gap-4">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                  <div>
                    <div className="font-bold text-white text-sm tracking-wide">{t.name}</div>
                    <div className="text-emerald-400 text-xs font-semibold">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-32 px-6 relative overflow-hidden bg-gradient-to-b from-transparent to-emerald-950/30 border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#10b981_0%,transparent_60%)] opacity-10 pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight text-white">Bring Nagar Sahayata<br />To Your Jharkhand Town</h2>
          <p className="text-lg text-emerald-100/70 mb-10 max-w-xl mx-auto font-medium">Help your local administration handle complaints systematically with full transparency.</p>
          <Link to="/signup" className="cursor-pointer">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-12 py-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl text-xl font-extrabold shadow-2xl cursor-pointer border border-emerald-400/20"
            >
              Get Started — Register Now
            </motion.button>
          </Link>
        </div>
      </section>

      {/* ENHANCED STRUCTURAL FOOTER */}
      <footer className="bg-[#03140e] border-t border-white/10 pt-20 pb-10 px-6 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 text-left">
          
          {/* Col 1: Brand Profile */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-emerald-950">न</div>
              <span className="text-xl font-black tracking-tight text-white">Nagar Sahayata</span>
            </div>
            <p className="text-emerald-100/60 text-sm leading-relaxed font-medium">
              Official municipal grievance engine dedicated to empowering citizens and optimizing public infrastructure workflows across the state of Jharkhand.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">Platform Links</h4>
            <ul className="space-y-3 text-sm font-medium">
              {["Features", "How it Works", "Departments", "Live Map", "FAQ"].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase().replace(/\s+/g, "-")}`} className="text-emerald-100/60 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Key Operations */}
          <div>
            <h4 className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">Government Systems</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <Link to="/login" className="text-emerald-100/60 hover:text-white transition-colors">ULB Dashboard Login</Link>
              </li>
              <li>
                <Link to="/signup" className="text-emerald-100/60 hover:text-white transition-colors">Urban Body Registration</Link>
              </li>
              <li>
                <a href="#live-map" className="text-emerald-100/60 hover:text-white transition-colors">State Performance Index</a>
              </li>
              <li>
                <span className="text-emerald-100/40 cursor-not-allowed">State Circulars (Coming Soon)</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Matrix */}
          <div className="space-y-4 text-sm font-medium text-emerald-100/70">
            <h4 className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">Support Portal</h4>
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-emerald-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed text-xs text-emerald-100/60">Urban Development & Housing Department, Project Building, Dhurwa, Ranchi, Jharkhand - 834004</p>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-emerald-500 shrink-0" />
              <p className="text-xs text-emerald-100/60">+91 (0651) 2400981</p>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-emerald-500 shrink-0" />
              <p className="text-xs text-emerald-100/60">support.nagarsahayata@jharkhand.gov.in</p>
            </div>
          </div>
        </div>

        {/* Divider and Attributions */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left text-xs font-medium text-emerald-300/40">
          <p>© 2026 Nagar Sahayata Portal, Govt. of Jharkhand. Developed for Municipal Operations.</p>
          <div className="flex gap-6">
            <a href="#privacy" className="hover:text-emerald-300 transition-colors">Privacy Charter</a>
            <a href="#terms" className="hover:text-emerald-300 transition-colors">Terms of Use</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;