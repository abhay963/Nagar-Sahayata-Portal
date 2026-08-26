import React, { useEffect, useMemo, useState } from "react";
import AuthModal from "../components/AuthModal";
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
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  ArrowUpRight,
  Award,
  Zap,
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  Camera,
  Clock3,
  Navigation,
  Check,
  Building2,
  ChevronLeft,
  ChevronRight,
  Quote,
  Sparkles,
} from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/*
  Visual direction:
  - Deep forest / emerald palette
  - Indian civic photography rather than generic SaaS stock art
  - Editorial image blocks + horizontal motion strips
  - Warm off-white surfaces used sparingly for contrast
  - Grounded in Ranchi / Jamshedpur / Indian urban infrastructure
*/

const images = {
  heroRoad:
    "https://assets.telegraphindia.com/telegraph/cb14edc2-9adb-4e60-a776-2847a1b502f6.jpg",
  jamshedpur:
    "https://assets.telegraphindia.com/telegraph/19jamstreetfest4.jpg",
  ranchiNight:
    "https://files.yappe.in/place/full/shaheed-albert-ekka-chowk-9575452.webp",
  sanitation:
    "https://media.assettype.com/freepressjournal-marathi/2025-07-01/eyzpg18q/freepressjournal-marathi2024-01181202c7-ea0c-40a9-9b02-e45b62a8abd2rseet.avif?auto=format%2Ccompress&enlarge=true&fit=max&h=1200&w=1800",
  roadRepair:
    "https://images.bhaskarassets.com/web2images/960/2025/07/08/1001641130_1751976356.jpg",
  cityPark:
    "https://eco-business.imgix.net/ebmedia/fileuploads/37622448340_3755c4165a_b.jpg?fit=crop&h=1200&ixlib=django-1.2.0&w=1800",
  urbanPark:
    "https://greenspacealliance.com/wp-content/uploads/2020/05/20191013_112438.jpg",
};

const features = [
  {
    title: "Live Issue Tracking",
    desc: "Real-time monitoring and map-based tracking for every complaint submitted across Jharkhand.",
    icon: <FaMapMarkedAlt size={30} />,
    tag: "Visibility",
  },
  {
    title: "Smart Analytics",
    desc: "Useful insights help departments identify recurring civic issues and improve turnaround time.",
    icon: <FaChartLine size={30} />,
    tag: "Decision support",
  },
  {
    title: "Easy Citizen Reporting",
    desc: "A simple mobile-first flow for reporting civic problems with photos and precise locations.",
    icon: <FaUsers size={30} />,
    tag: "Citizen first",
  },
  {
    title: "Department Dashboard",
    desc: "One operational view for urban local bodies to receive, assign and monitor field work.",
    icon: <FaCity size={30} />,
    tag: "Operations",
  },
  {
    title: "Transparent Updates",
    desc: "Citizens can follow the journey from submitted complaint to assignment, action and closure.",
    icon: <FaShieldAlt size={30} />,
    tag: "Trust",
  },
  {
    title: "Eco Initiatives",
    desc: "Track sanitation, green spaces, lighting and other public infrastructure improvements.",
    icon: <FaLeaf size={30} />,
    tag: "Sustainability",
  },
];

const departments = [
  {
    name: "Road Maintenance",
    icon: <FaRoad size={36} />,
    desc: "Potholes, damaged roads, broken footpaths and repair requests.",
    image: images.heroRoad,
  },
  {
    name: "Water Supply",
    icon: <FaWater size={36} />,
    desc: "Leakages, low pressure, supply interruptions and public water issues.",
    image: images.cityPark,
  },
  {
    name: "Garbage & Cleaning",
    icon: <FaExclamationTriangle size={36} />,
    desc: "Waste collection, overflowing bins, public cleaning and sanitation.",
    image: images.sanitation,
  },
  {
    name: "Street Lighting",
    icon: <FaLightbulb size={36} />,
    desc: "Broken lights, dark stretches and public lighting maintenance.",
    image: images.ranchiNight,
  },
  {
    name: "Public Parks",
    icon: <FaLeaf size={36} />,
    desc: "Maintenance of green spaces, parks, walking paths and public areas.",
    image: images.urbanPark,
  },
  {
    name: "Public Safety",
    icon: <FaShieldAlt size={36} />,
    desc: "Hazards, structural concerns, obstructions and civic safety reports.",
    image: images.jamshedpur,
  },
];

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Resident, Ranchi",
    feedback:
      "The portal is straightforward to use. Clear location details make it easier to understand where a civic issue actually needs attention.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Priya Verma",
    role: "Municipal Operations",
    feedback:
      "A single workflow for complaints, assignment and field updates makes day-to-day municipal coordination much easier to follow.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Amit Kumar",
    role: "Field Supervisor",
    feedback:
      "Getting the location and supporting image together reduces unnecessary back-and-forth when a field team receives a new issue.",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
  },
];

const faqData = [
  {
    q: "How does the portal forward complaints to the right department?",
    a: "A submitted complaint can include a category, description, image and location. The platform uses that information to route the issue toward the relevant urban local body or municipal workflow.",
  },
  {
    q: "Can I check the progress of my reported issue?",
    a: "Yes. The workflow is designed around visible status changes so citizens can follow an issue from submission through assignment, field action and resolution.",
  },
  {
    q: "Is this platform available for all cities in Jharkhand?",
    a: "The landing experience is designed for a state-wide civic platform. Actual city availability depends on which urban local bodies are connected to the deployed system.",
  },
  {
    q: "What should I include when reporting an issue?",
    a: "Add a clear description, the most relevant category, a useful photo when possible, and an accurate location. Better input generally means faster triage for the receiving team.",
  },
];

const gallery = [
  {
    image: images.heroRoad,
    eyebrow: "RANCHI",
    title: "Roads that work for everyday movement",
    text: "Designed around the real rhythm of Indian streets — commuters, shops, two-wheelers, pedestrians and public infrastructure.",
  },
  {
    image: images.jamshedpur,
    eyebrow: "JAMSHEDPUR",
    title: "A city is more than a map",
    text: "Every junction, market road and public space creates a different operational context for civic teams.",
  },
  {
    image: images.sanitation,
    eyebrow: "SANITATION",
    title: "The people behind cleaner streets",
    text: "Digital reporting should strengthen field work, not replace the people doing it.",
  },
  {
    image: images.roadRepair,
    eyebrow: "FIELD WORK",
    title: "From complaint to visible action",
    text: "Attach the right context to a problem so field teams can spend less time searching and more time fixing.",
  },
  {
    image: images.ranchiNight,
    eyebrow: "PUBLIC SAFETY",
    title: "Safer streets after sunset",
    text: "Street lighting and road conditions are everyday quality-of-life issues that deserve clear accountability.",
  },
];

const jharkhandHubs = {
  ranchi: {
    title: "Ranchi Zone",
    tickets: "242 Active Issues",
    resolution: "94.2% Solved",
    speed: "4.2 hrs avg",
  },
  jamshedpur: {
    title: "Jamshedpur Region",
    tickets: "312 Active Issues",
    resolution: "95.8% Solved",
    speed: "3.8 hrs avg",
  },
  dhanbad: {
    title: "Dhanbad Hub",
    tickets: "189 Active Issues",
    resolution: "91.5% Solved",
    speed: "5.5 hrs avg",
  },
  bokaro: {
    title: "Bokaro Steel City",
    tickets: "125 Active Issues",
    resolution: "93.0% Solved",
    speed: "4.1 hrs avg",
  },
};

const StatCard = ({ end, suffix, label, delay, icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 35 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.25 }}
    transition={{ delay, duration: 0.55 }}
    className="group relative overflow-hidden rounded-[1.75rem] border border-white/[0.10] bg-white/[0.045] p-6 shadow-2xl backdrop-blur-xl"
  >
    <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-400/10 blur-3xl transition-all duration-500 group-hover:bg-emerald-400/20" />
    <div className="relative z-10 mb-5 flex items-center justify-between">
      <span className="rounded-xl border border-emerald-400/15 bg-emerald-400/10 p-2.5 text-emerald-300">
        {icon}
      </span>
      <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-white/30">
        live index
      </span>
    </div>
    <h3 className="relative z-10 text-4xl font-black tracking-tight text-white sm:text-5xl">
      <CountUp end={end} suffix={suffix} enableScrollSpy />
    </h3>
    <p className="relative z-10 mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200/50">
      {label}
    </p>
  </motion.div>
);

const ImageCard = ({ item, index }) => (
  <motion.article
    initial={{ opacity: 0, y: 35 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ delay: index * 0.08, duration: 0.6 }}
    whileHover={{ y: -8 }}
    className="group relative min-w-[285px] overflow-hidden rounded-[1.8rem] border border-white/[0.10] bg-white/[0.045] shadow-2xl sm:min-w-[340px]"
  >
    <div className="relative h-[390px] overflow-hidden">
      <img
        src={item.image}
        alt={item.title}
        loading="lazy"
        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#03140e] via-[#03140e]/25 to-transparent" />
      <div className="absolute left-5 top-5 rounded-full border border-white/[0.20] bg-black/20 px-3 py-1.5 text-[9px] font-black tracking-[0.2em] text-white backdrop-blur-md">
        {item.eyebrow}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="max-w-xs text-2xl font-black leading-tight text-white">
          {item.title}
        </h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/65">
          {item.text}
        </p>
      </div>
    </div>
  </motion.article>
);

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeGallery, setActiveGallery] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalRole, setAuthModalRole] = useState("Citizen");

  const openAuth = (selectedRole) => {
    setAuthModalRole(selectedRole);
    setIsAuthModalOpen(true);
  };

  const galleryLoop = useMemo(() => [...gallery, ...gallery], []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveGallery((current) => (current + 1) % gallery.length);
    }, 5200);

    return () => clearInterval(timer);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#061b13] font-sans text-white selection:bg-emerald-400 selection:text-[#032016]">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute left-[-18%] top-[5%] h-[520px] w-[520px] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute right-[-15%] top-[35%] h-[600px] w-[600px] rounded-full bg-teal-500/10 blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[30%] h-[500px] w-[500px] rounded-full bg-green-500/10 blur-[130px]" />
      </div>

      {/* NAVBAR */}
      <nav className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 sm:px-6">
        <div className="mx-auto max-w-7xl rounded-2xl border border-white/[0.10] bg-[#06261a]/85 shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center justify-between px-5 py-3.5 sm:px-6">
            <Link to="/" className="group flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 6, scale: 1.04 }}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.15] bg-white/10 p-1.5 shadow-inner"
              >
                <img
                  src="/government-of-jharkhand.png"
                  alt="Government of Jharkhand"
                  className="h-full w-full object-contain"
                />
              </motion.div>
              <div>
                <div className="text-xl font-black tracking-tight text-white transition-colors group-hover:text-emerald-300 sm:text-2xl">
                  Nagar Sahayata
                </div>
                <div className="text-[9px] font-semibold uppercase tracking-[0.22em] text-emerald-300/70">
                  Civic grievance platform
                </div>
              </div>
            </Link>

            <div className="hidden items-center gap-7 text-sm font-semibold md:flex">
              {["Features", "How it Works", "Departments", "Live Map", "FAQ"].map(
                (item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className="group relative py-2 text-white/60 transition hover:text-white"
                  >
                    {item}
                    <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-emerald-400 transition-all duration-300 group-hover:w-full" />
                  </a>
                )
              )}
            </div>

            <div className="hidden items-center gap-2 md:flex">
              <button
                onClick={() => openAuth("Citizen")}
                className="rounded-xl px-4 py-2.5 text-sm font-bold text-emerald-300 hover:text-white transition cursor-pointer"
              >
                Citizen Portal
              </button>
              <button
                onClick={() => openAuth("Employee")}
                className="rounded-xl border border-emerald-300/20 bg-emerald-500 px-5 py-2.5 text-sm font-extrabold text-[#032016] shadow-lg hover:bg-emerald-400 transition cursor-pointer"
              >
                Employee Portal
              </button>
            </div>

            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              className="rounded-xl border border-white/[0.10] bg-white/5 p-2 text-emerald-300 md:hidden"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="mx-auto mt-2 max-w-7xl rounded-2xl border border-white/[0.10] bg-[#06261a]/95 p-5 shadow-2xl backdrop-blur-2xl md:hidden"
            >
              <div className="flex flex-col gap-1">
                {["Features", "How it Works", "Departments", "Live Map", "FAQ"].map(
                  (item) => (
                    <a
                      key={item}
                      href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="rounded-xl px-3 py-3 text-base font-semibold text-white/70 hover:bg-white/5 hover:text-white"
                    >
                      {item}
                    </a>
                  )
                )}
                <div className="my-2 h-px bg-white/10" />
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    openAuth("Citizen");
                  }}
                  className="rounded-xl bg-white/5 px-3 py-3 text-center font-bold text-white hover:bg-white/10 transition cursor-pointer"
                >
                  Citizen Portal
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    openAuth("Employee");
                  }}
                  className="rounded-xl bg-emerald-500 px-3 py-3 text-center font-black text-[#032016] hover:bg-emerald-400 transition cursor-pointer"
                >
                  Employee Portal
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO */}
      <section className="relative z-10 flex min-h-screen items-center overflow-hidden px-6 pb-20 pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(16,185,129,0.18),transparent_36%)]" />
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
          

            <h1 className="max-w-3xl text-5xl font-black leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl lg:text-[5.4rem]">
              Better streets.
              <br />
              <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-lime-300 bg-clip-text text-transparent">
                Better response.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-white/60 sm:text-lg">
              A citizen-first digital layer for reporting roads, water, sanitation,
              lighting and public-space issues — with the operational context local
              teams actually need.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <motion.button
                whileHover={{ y: -2, scale: 1.02 }}
                onClick={() => openAuth("Citizen")}
                className="flex items-center gap-2 rounded-2xl bg-white px-6 py-4 font-black text-[#052118] shadow-2xl shadow-black/20 cursor-pointer"
              >
                Register as Citizen
                <ArrowUpRight size={18} />
              </motion.button>
              <motion.button
                whileHover={{ y: -2, scale: 1.02 }}
                onClick={() => openAuth("Employee")}
                className="flex items-center gap-2 rounded-2xl border border-white/[0.15] bg-white/5 px-6 py-4 font-bold text-white hover:border-emerald-400/40 hover:bg-white/10 transition cursor-pointer"
              >
                Register as Employee
                <ArrowUpRight size={18} />
              </motion.button>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
              <span className="flex items-center gap-2">
                <Award size={15} className="text-emerald-400" />
                State-focused
              </span>
              <span className="flex items-center gap-2">
                <Zap size={15} className="text-teal-400" />
                Real-time workflow
              </span>
              <span className="flex items-center gap-2">
                <ShieldAltIcon />
                Transparent status
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="relative h-[590px]"
          >
            <div className="absolute inset-0 rounded-[3rem] bg-emerald-500/10 blur-3xl" />

            <div className="absolute left-0 top-6 h-[390px] w-[72%] overflow-hidden rounded-[2.5rem] border border-white/[0.15] shadow-2xl shadow-black/40">
              <img
                src={images.heroRoad}
                alt="Ranchi urban road"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#03140e] via-transparent to-black/10" />
              <div className="absolute bottom-6 left-6">
                <div className="mb-2 text-[9px] font-black uppercase tracking-[0.22em] text-emerald-300">
                  Ranchi · Urban movement
                </div>
                <div className="text-2xl font-black">Everyday infrastructure, visible.</div>
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-0 right-0 h-[280px] w-[52%] overflow-hidden rounded-[2.2rem] border border-white/[0.15] bg-[#09291d] p-2 shadow-2xl"
            >
              <img
                src={images.ranchiNight}
                alt="Ranchi city junction at night"
                className="h-full w-full rounded-[1.8rem] object-cover"
              />
              <div className="absolute inset-2 rounded-[1.8rem] bg-gradient-to-t from-[#03140e]/90 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="text-[9px] font-black uppercase tracking-[0.22em] text-amber-300">
                  After dark
                </div>
                <div className="mt-1 text-lg font-black">Lighting. Safety. Accountability.</div>
              </div>
            </motion.div>

            <div className="absolute right-[5%] top-[2%] rounded-2xl border border-white/[0.15] bg-[#06261a]/85 p-4 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-3">
              
                <div>
                  <div className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-300">
                    live
                  </div>
                  <div className="text-xs font-bold text-white/60">24/7 workflow</div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-[16%] left-[7%] rounded-2xl border border-white/[0.10] bg-black/30 p-4 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-400/15 p-2 text-emerald-300">
                  <Check size={18} />
                </div>
                <div>
                  <div className="text-lg font-black">94.2%</div>
                  <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/35">
                    sample resolution index
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

   

      {/* STATS */}
      <section className="relative z-10 px-6 py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard
            end={12000}
            suffix="+"
            label="Registered Citizens"
            delay={0.05}
            icon={<FaUsers />}
          />
          <StatCard
            end={4500}
            suffix="+"
            label="Resolved Complaints"
            delay={0.1}
            icon={<FaCheckCircle />}
          />
          <StatCard
            end={94}
            suffix="%"
            label="User Satisfaction"
            delay={0.15}
            icon={<FaChartLine />}
          />
          <StatCard
            end={18}
            suffix=""
            label="Active Urban Bodies"
            delay={0.2}
            icon={<FaCity />}
          />
        </div>
      </section>

      {/* INDIAN CITY STORY */}
      <section className="relative z-10 border-y border-white/[0.05] bg-[#071f16] px-6 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="mb-4 text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400">
              Designed around real streets
            </div>
            <h2 className="max-w-xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              Indian cities are layered.
              <span className="text-emerald-300"> So is the workflow.</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/55">
              A civic platform should feel familiar to the people using it. The
              visual language here uses roads, markets, junctions, field crews and
              public spaces rather than abstract corporate stock imagery.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                ["01", "Citizen report"],
                ["02", "Location context"],
                ["03", "Department triage"],
                ["04", "Field resolution"],
              ].map(([num, label]) => (
                <div
                  key={num}
                  className="rounded-2xl border border-white/[0.10] bg-white/[0.035] p-4"
                >
                  <div className="text-[9px] font-black tracking-[0.2em] text-emerald-400">
                    {num}
                  </div>
                  <div className="mt-2 text-sm font-bold text-white/75">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-3 pt-10">
              <div className="h-[300px] overflow-hidden rounded-[2rem] border border-white/[0.10]">
                <img
                  src={images.jamshedpur}
                  alt="Jamshedpur urban road"
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 hover:scale-105"
                />
              </div>
              <div className="rounded-[1.5rem] border border-emerald-400/15 bg-emerald-400/10 p-5">
                <div className="text-2xl font-black text-emerald-300">01</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                  City context
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-[1.5rem] border border-white/[0.10] bg-white/[0.04] p-5">
                <Camera size={22} className="text-emerald-300" />
                <div className="mt-3 text-sm font-black">Photo + location</div>
                <div className="mt-1 text-xs leading-5 text-white/40">
                  Give field teams the context they need.
                </div>
              </div>
              <div className="h-[390px] overflow-hidden rounded-[2rem] border border-white/[0.10]">
                <img
                  src={images.sanitation}
                  alt="Indian municipal sanitation workers"
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative z-10 px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 max-w-3xl">
            <div className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400">
              Portal capabilities
            </div>
            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              A cleaner interface for a messy real-world problem.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/50">
              Every component has a job: report, route, understand, assign, update
              and close. The design stays visual without becoming decorative noise.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -7 }}
                className="group relative overflow-hidden rounded-[1.8rem] border border-white/[0.10] bg-white/[0.04] p-7 shadow-xl backdrop-blur-md"
              >
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-emerald-400/10 blur-3xl opacity-0 transition duration-500 group-hover:opacity-100" />
                <div className="relative z-10 flex items-start justify-between">
                  <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/10 p-3.5 text-emerald-300">
                    {feature.icon}
                  </div>
                  <span className="rounded-full border border-white/[0.10] px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.18em] text-white/30">
                    {feature.tag}
                  </span>
                </div>
                <h3 className="relative z-10 mt-7 text-xl font-black text-white">
                  {feature.title}
                </h3>
                <p className="relative z-10 mt-3 text-sm leading-6 text-white/50">
                  {feature.desc}
                </p>
                <div className="relative z-10 mt-6 flex items-center gap-2 text-xs font-bold text-emerald-300 opacity-70 transition group-hover:opacity-100">
                  Explore capability <FaArrowRight size={10} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="relative z-10 overflow-hidden border-y border-white/[0.05] bg-[#03140e] px-6 py-28"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400">
              The journey
            </div>
            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              From a street-side observation to a tracked civic task.
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/50">
              Keep the citizen experience simple while giving operational teams
              structured information they can actually act on.
            </p>

            <div className="mt-8 space-y-3">
              {[
                ["01", "Report issue", "Describe the problem and attach useful evidence."],
                ["02", "Auto sorting", "Classify the request using category and location."],
                ["03", "Team assignment", "Move the task to the appropriate operational team."],
                ["04", "Resolution", "Update the citizen as work moves toward closure."],
              ].map(([number, title, desc]) => (
                <motion.div
                  key={number}
                  whileHover={{ x: 5 }}
                  className="flex gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-xs font-black text-emerald-300">
                    {number}
                  </div>
                  <div>
                    <div className="font-black text-white">{title}</div>
                    <div className="mt-1 text-xs leading-5 text-white/40">{desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/[0.10]">
            <img
              src={images.roadRepair}
              alt="Municipal road repair work in India"
              loading="lazy"
              className="h-[580px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#03140e] via-transparent to-black/10" />
            <div className="absolute bottom-0 left-0 right-0 p-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.15] bg-black/20 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-md">
                <Clock3 size={12} />
                Field operations
              </div>
              <div className="mt-3 max-w-md text-2xl font-black">
                Good civic software ends where real-world work begins.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEPARTMENTS */}
      <section id="departments" className="relative z-10 px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400">
                Service categories
              </div>
              <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                Built around the issues citizens actually notice.
              </h2>
            </div>
            <div className="max-w-sm text-sm leading-6 text-white/40">
              Roads, water, waste, lighting, parks and safety — organized into a
              workflow that departments can understand quickly.
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {departments.map((dept, i) => (
              <motion.article
                key={dept.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -6 }}
                className="group relative h-[340px] overflow-hidden rounded-[2rem] border border-white/[0.10]"
              >
                <img
                  src={dept.image}
                  alt={dept.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#03140e] via-[#03140e]/65 to-[#03140e]/5" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="rounded-xl border border-emerald-300/15 bg-emerald-400/10 p-3 text-emerald-300 backdrop-blur-md">
                      {dept.icon}
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">
                      civic service
                    </span>
                  </div>
                  <h3 className="text-2xl font-black">{dept.name}</h3>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-white/55">
                    {dept.desc}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* AUTO-SLIDING EDITORIAL GALLERY */}
      <section className="relative z-10 overflow-hidden border-y border-white/[0.05] bg-[#071f16] py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400">
                City in motion
              </div>
              <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                See the context behind every complaint.
              </h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setActiveGallery(
                    (activeGallery - 1 + gallery.length) % gallery.length
                  )
                }
                className="rounded-full border border-white/[0.10] bg-white/5 p-3 text-white/60 transition hover:bg-white/10 hover:text-white"
                aria-label="Previous image"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() =>
                  setActiveGallery((activeGallery + 1) % gallery.length)
                }
                className="rounded-full border border-white/[0.10] bg-white/5 p-3 text-white/60 transition hover:bg-white/10 hover:text-white"
                aria-label="Next image"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <motion.div
            animate={{ x: `${-activeGallery * 355}px` }}
            transition={{ type: "spring", stiffness: 80, damping: 18 }}
            className="flex gap-4 px-6"
          >
            {galleryLoop.map((item, index) => (
              <ImageCard
                key={`${item.title}-${index}`}
                item={item}
                index={index % gallery.length}
              />
            ))}
          </motion.div>
        </div>

        <div className="mx-auto mt-8 flex max-w-7xl gap-2 px-6">
          {gallery.map((item, index) => (
            <button
              key={item.title}
              onClick={() => setActiveGallery(index)}
              className={`h-1.5 rounded-full transition-all ${
                activeGallery === index
                  ? "w-10 bg-emerald-400"
                  : "w-4 bg-white/15"
              }`}
              aria-label={`Show slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* LIVE MAP */}
      <section id="live-map" className="relative z-10 px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-300">
              <FaGlobeAsia />
              State map matrix
            </div>
            <h2 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
              One view of the civic pulse.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/45">
              Explore reported issues, operational activity and city-level context
              through your existing map component.
            </p>
          </div>

          <div className="overflow-hidden rounded-[2.5rem] border border-white/[0.10] bg-[#041a11] shadow-2xl">
            <div className="h-[650px] w-full">
              <MapSection isGuest={true} />
            </div>
          </div>
        </div>
      </section>

      {/* REGIONAL METRICS */}
      <section className="relative z-10 border-y border-white/[0.05] bg-[#03140e] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400">
                Regional operations
              </div>
              <h2 className="mt-4 text-4xl font-black tracking-tight">
                See where the workload is moving.
              </h2>
              <p className="mt-5 text-sm leading-7 text-white/45">
                Keep city-level workload, resolution rate and turnaround time visible
                without turning the landing page into a dashboard.
              </p>
            </div>

            <Card className="overflow-hidden rounded-[2rem] border-white/[0.10] bg-white/[0.035] text-white shadow-2xl">
              <CardHeader className="border-b border-white/[0.05] bg-white/[0.025] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-300">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                      Live state activity
                    </div>
                    <CardTitle className="mt-2 text-4xl font-black">885</CardTitle>
                  </div>
                  <div className="hidden text-right sm:block">
                    <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">
                      active issues
                    </div>
                    <div className="mt-1 text-xs font-bold text-white/45">
                      across connected urban bodies
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-5">
                <Tabs defaultValue="ranchi" className="w-full">
                  <TabsList className="grid h-auto grid-cols-2 gap-1 rounded-2xl border border-white/[0.10] bg-[#03140e] p-1 sm:grid-cols-4">
                    {Object.keys(jharkhandHubs).map((key) => (
                      <TabsTrigger
                        key={key}
                        value={key}
                        className="rounded-xl py-3 text-xs font-bold text-white/40 data-[state=active]:bg-emerald-400/10 data-[state=active]:text-emerald-300"
                      >
                        {jharkhandHubs[key].title.split(" ")[0]}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {Object.keys(jharkhandHubs).map((key) => {
                    const hub = jharkhandHubs[key];
                    const numericResolution =
                      parseFloat(hub.resolution) || 90;

                    return (
                      <TabsContent
                        key={key}
                        value={key}
                        className="mt-4 focus-visible:outline-none"
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="rounded-2xl border border-white/[0.10] bg-[#06261a] p-5">
                            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                              <div>
                                <div className="flex items-center gap-2 text-lg font-black">
                                  <MapPin size={17} className="text-emerald-400" />
                                  {hub.title}
                                </div>
                                <div className="mt-4 flex flex-wrap gap-2">
                                  <span className="rounded-lg border border-white/[0.08] bg-white/5 px-3 py-2 text-xs font-bold text-white/60">
                                    {hub.tickets}
                                  </span>
                                  <span className="rounded-lg border border-white/[0.08] bg-white/5 px-3 py-2 text-xs font-bold text-teal-300">
                                    {hub.speed}
                                  </span>
                                </div>
                              </div>
                              <Badge className="w-fit border border-emerald-400/15 bg-emerald-400/10 text-emerald-300">
                                {hub.resolution}
                              </Badge>
                            </div>

                            <div className="mt-7">
                              <div className="mb-2 flex justify-between text-[9px] font-black uppercase tracking-[0.18em] text-white/30">
                                <span>Resolution velocity</span>
                                <span className="text-emerald-300">
                                  {numericResolution}%
                                </span>
                              </div>
                              <div className="h-2 overflow-hidden rounded-full bg-black/30">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${numericResolution}%` }}
                                  transition={{ duration: 0.9 }}
                                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-300"
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </TabsContent>
                    );
                  })}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative z-10 px-6 py-28">
        <div className="mx-auto max-w-3xl">
          <div className="mb-14 text-center">
            <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-emerald-400">
              <HelpCircle size={15} />
              Frequently asked
            </div>
            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              Clear answers. No bureaucratic fog.
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {faqData.map((faq, index) => (
              <AccordionItem
                key={faq.q}
                value={`item-${index}`}
                className="rounded-2xl border border-white/[0.10] bg-white/[0.035] px-5 shadow-xl"
              >
                <AccordionTrigger className="py-5 text-left text-base font-black text-white hover:no-underline hover:text-emerald-300">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-7 text-white/45">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative z-10 overflow-hidden border-y border-white/[0.05] bg-[#071f16] px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400">
                Human feedback
              </div>
              <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                Technology should feel human.
              </h2>
            </div>
            <Quote className="hidden text-emerald-400/20 md:block" size={70} />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-[1.8rem] border border-white/[0.10] bg-white/[0.04] p-7 shadow-xl"
              >
                <Quote size={20} className="text-emerald-400/50" />
                <p className="mt-6 text-sm leading-7 text-white/60">
                  “{testimonial.feedback}”
                </p>
                <div className="mt-7 flex items-center gap-3 border-t border-white/[0.08] pt-5">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    loading="lazy"
                    className="h-11 w-11 rounded-xl object-cover ring-1 ring-white/10"
                  />
                  <div>
                    <div className="text-sm font-black">{testimonial.name}</div>
                    <div className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-400/70">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* IMAGE CTA */}
      <section className="relative z-10 px-6 py-28">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.8rem] border border-white/[0.10]">
          <img
            src={images.cityPark}
            alt="Indian public urban space"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#03140e]/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#03140e] via-[#03140e]/65 to-transparent" />

          <div className="relative z-10 min-h-[470px] p-8 sm:p-14 lg:p-20">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.15] bg-black/20 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-white/70 backdrop-blur-md">
                <Sparkles size={12} className="text-emerald-300" />
                The next civic layer
              </div>
              <h2 className="mt-6 text-4xl font-black leading-tight tracking-tight sm:text-6xl">
                Make the city easier to report, easier to understand and easier to improve.
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
                Give citizens a clear front door to municipal services and give
                operational teams a structured path to action.
              </p>
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                onClick={() => openAuth("Citizen")}
                className="mt-8 flex items-center gap-2 rounded-2xl bg-emerald-400 px-6 py-4 font-black text-[#032016] shadow-2xl"
              >
                Get Started
                <ArrowUpRight size={18} />
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER VISUAL BAND */}
      <section className="relative z-10 overflow-hidden border-y border-white/[0.05] bg-[#03140e] py-7">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          className="flex w-max gap-4"
        >
          {[...Array(2)].flatMap((_, repeat) =>
            [
              images.heroRoad,
              images.jamshedpur,
              images.sanitation,
              images.ranchiNight,
              images.roadRepair,
              images.urbanPark,
            ].map((image, index) => (
              <div
                key={`${repeat}-${index}`}
                className="h-24 w-44 overflow-hidden rounded-2xl border border-white/[0.10] opacity-60"
              >
                <img
                  src={image}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            ))
          )}
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 bg-[#020d09] px-6 pb-8 pt-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr_0.9fr_1fr]">
            <div>
              <Link to="/" className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10">
                  <img
                    src="/government-of-jharkhand.png"
                    alt="Government of Jharkhand"
                    className="h-8 w-8 object-contain"
                  />
                </div>
                <div>
                  <div className="text-xl font-black">Nagar Sahayata</div>
                  <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-400/60">
                    Jharkhand civic platform
                  </div>
                </div>
              </Link>

              <p className="mt-6 max-w-md text-sm leading-7 text-white/35">
                A digital civic grievance experience focused on better reporting,
                clearer accountability and more connected field operations.
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                {["Roads", "Water", "Sanitation", "Lighting", "Parks"].map(
                  (item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white/35"
                    >
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-400">
                Platform
              </h4>
              <ul className="mt-5 space-y-3 text-sm font-semibold text-white/40">
                {["Features", "How it Works", "Departments", "Live Map", "FAQ"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                        className="transition hover:text-white"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-400">
                Operations
              </h4>
              <ul className="mt-5 space-y-3 text-sm font-semibold text-white/40">
                <li>
                  <Link to="/login" className="transition hover:text-white">
                    ULB Dashboard Login
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openAuth("Employee")}
                    className="transition hover:text-white text-left"
                  >
                    Urban Body Registration
                  </button>
                </li>
                <li>
                  <a href="#live-map" className="transition hover:text-white">
                    State Performance Index
                  </a>
                </li>
                <li>
                  <span className="text-white/20">State Circulars · Coming Soon</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-400">
                Support
              </h4>
              <div className="mt-5 space-y-4 text-sm text-white/40">
                <div className="flex items-start gap-3">
                  <MapPin size={17} className="mt-0.5 shrink-0 text-emerald-400" />
                  <span className="leading-6">
                    Urban Development & Housing Department, Project Building,
                    Dhurwa, Ranchi, Jharkhand
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="shrink-0 text-emerald-400" />
                  <span>+91 (0651) 2400981</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} className="shrink-0 text-emerald-400" />
                  <span className="break-all">
                    support.nagarsahayata@jharkhand.gov.in
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-col justify-between gap-5 border-t border-white/[0.08] pt-7 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/25 sm:flex-row">
            <p>© 2026 Nagar Sahayata Portal · Civic operations experience</p>
            <div className="flex gap-5">
              <a href="#privacy" className="transition hover:text-white/60">
                Privacy
              </a>
              <a href="#terms" className="transition hover:text-white/60">
                Terms
              </a>
              <button
                onClick={scrollToTop}
                className="transition hover:text-emerald-300"
              >
                Back to top ↑
              </button>
            </div>
          </div>
        </div>
      </footer>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialRole={authModalRole}
      />
    </div>
  );
};

/* Tiny icon wrapper keeps the hero markup readable. */
const ShieldAltIcon = () => (
  <span className="inline-flex text-emerald-400">
    <FaShieldAlt size={15} />
  </span>
);

export default LandingPage;
