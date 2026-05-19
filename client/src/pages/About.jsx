"use client";

import React from "react";

import { motion } from "framer-motion";

import { Canvas } from "@react-three/fiber";

import {
  Float,
  Stars,
  Sparkles,
  OrbitControls,
} from "@react-three/drei";

import {
  FaLandmark,
  FaStar,
  FaLightbulb,
  FaUserTie,
  FaAward,
  FaHandshake,
  FaGlobe,
  FaUsersCog,
  FaChartLine,
  FaShieldAlt,
} from "react-icons/fa";

import Navbar from "../components/Navbar";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Badge,
} from "@/components/ui/badge";

import {
  Button,
} from "@/components/ui/button";



// ======================================================
// ================= 3D SCENE ===========================
// ======================================================

const BackgroundScene = () => {
  return (
    <Canvas>

      <color attach="background" args={["#020617"]} />

      <ambientLight intensity={2} />

      <directionalLight position={[2, 2, 5]} intensity={3} />

      <Stars
        radius={100}
        depth={50}
        count={4000}
        factor={4}
        fade
      />

      <Sparkles
        count={200}
        scale={12}
        size={4}
        speed={0.4}
      />

      <Float
        speed={2}
        rotationIntensity={2}
        floatIntensity={3}
      >
        <mesh>
          <icosahedronGeometry args={[1.8, 1]} />
          <meshStandardMaterial
            color="#22c55e"
            wireframe
          />
        </mesh>
      </Float>

      <OrbitControls
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.7}
      />

    </Canvas>
  );
};



// ======================================================
// ================= ABOUT PAGE =========================
// ======================================================

const About = () => {

  const cards = [
    {
      icon: <FaChartLine />,
      title: "Smart Dashboard",
      desc: "Track complaints, analytics and city performance in real-time.",
    },

    {
      icon: <FaShieldAlt />,
      title: "Secure Governance",
      desc: "Safe and transparent complaint handling with accountability.",
    },

    {
      icon: <FaUsersCog />,
      title: "Team Collaboration",
      desc: "Departments coordinate together for faster issue resolution.",
    },
  ];


  return (
    <>
      <Navbar />

      <div className="relative min-h-screen bg-slate-950 overflow-hidden text-white">

        {/* ====================================================== */}
        {/* ================= 3D BACKGROUND ====================== */}
        {/* ====================================================== */}

        <div className="fixed inset-0 z-0 opacity-60">
          <BackgroundScene />
        </div>

        {/* ====================================================== */}
        {/* ================= GRADIENT OVERLAY =================== */}
        {/* ====================================================== */}

        <div
          className="
            fixed
            inset-0
            bg-gradient-to-b
            from-black/40
            via-slate-950/80
            to-slate-950
            z-10
          "
        />



        {/* ====================================================== */}
        {/* ================= MAIN CONTENT ======================= */}
        {/* ====================================================== */}

        <div className="relative z-20">

          {/* ====================================================== */}
          {/* ================= HERO SECTION ======================= */}
          {/* ====================================================== */}

          <section
            className="
              min-h-screen
              flex
              items-center
              justify-center
              px-6
              pt-20
            "
          >

            <motion.div
              initial={{
                opacity: 0,
                y: 60,
              }}

              animate={{
                opacity: 1,
                y: 0,
              }}

              transition={{
                duration: 1,
              }}

              className="
                max-w-6xl
                mx-auto
                text-center
              "
            >

              <Badge
                className="
                  bg-green-500/20
                  text-green-300
                  border
                  border-green-500/30
                  px-6
                  py-2
                  rounded-full
                  text-sm
                  mb-8
                "
              >

                <FaLandmark className="mr-2" />

                Government of Jharkhand

              </Badge>


              <h1
                className="
                  text-6xl
                  md:text-8xl
                  font-black
                  leading-tight
                  mb-8
                "
              >

                Smart Urban{" "}

                <span
                  className="
                    bg-gradient-to-r
                    from-green-400
                    via-emerald-300
                    to-teal-400
                    bg-clip-text
                    text-transparent
                  "
                >
                  Governance
                </span>

              </h1>


              <p
                className="
                  text-xl
                  md:text-2xl
                  text-slate-300
                  leading-relaxed
                  max-w-4xl
                  mx-auto
                  mb-12
                "
              >

                Nagar Sahayata is a modern digital governance platform
                empowering citizens and municipal staff through
                transparency, AI-powered workflows, and smart complaint
                management.

              </p>


              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  justify-center
                  gap-5
                "
              >

                <Button
                  className="
                    bg-green-600
                    hover:bg-green-700
                    rounded-full
                    px-8
                    py-6
                    text-lg
                  "
                >
                  Explore Platform
                </Button>

                <Button
                  variant="outline"
                  className="
                    rounded-full
                    px-8
                    py-6
                    text-lg
                    border-slate-600
                    bg-transparent
                    text-white
                    hover:bg-slate-800
                  "
                >
                  Learn More
                </Button>

              </div>

            </motion.div>

          </section>



          {/* ====================================================== */}
          {/* ================= MISSION + VISION =================== */}
          {/* ====================================================== */}

          <section className="py-28 px-6">

            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10">

              {/* Mission */}

              <motion.div
                initial={{
                  opacity: 0,
                  x: -60,
                }}

                whileInView={{
                  opacity: 1,
                  x: 0,
                }}

                transition={{
                  duration: 0.8,
                }}
              >

                <Card
                  className="
                    bg-white/5
                    border
                    border-white/10
                    backdrop-blur-2xl
                    rounded-[32px]
                    p-10
                    h-full
                    hover:border-green-500/40
                    transition-all
                    duration-500
                  "
                >

                  <CardContent className="p-0">

                    <div
                      className="
                        w-20
                        h-20
                        rounded-2xl
                        bg-yellow-500/20
                        flex
                        items-center
                        justify-center
                        mb-8
                      "
                    >

                      <FaStar className="text-4xl text-yellow-400" />

                    </div>

                    <h2 className="text-5xl font-black mb-6">
                      Our Mission
                    </h2>

                    <p
                      className="
                        text-slate-300
                        text-lg
                        leading-relaxed
                      "
                    >
                      Building a transparent, efficient, and citizen-first
                      governance ecosystem where every issue is tracked,
                      resolved, and monitored digitally.
                    </p>

                  </CardContent>

                </Card>

              </motion.div>



              {/* Vision */}

              <motion.div
                initial={{
                  opacity: 0,
                  x: 60,
                }}

                whileInView={{
                  opacity: 1,
                  x: 0,
                }}

                transition={{
                  duration: 0.8,
                }}
              >

                <Card
                  className="
                    bg-white/5
                    border
                    border-white/10
                    backdrop-blur-2xl
                    rounded-[32px]
                    p-10
                    h-full
                    hover:border-green-500/40
                    transition-all
                    duration-500
                  "
                >

                  <CardContent className="p-0">

                    <div
                      className="
                        w-20
                        h-20
                        rounded-2xl
                        bg-amber-500/20
                        flex
                        items-center
                        justify-center
                        mb-8
                      "
                    >

                      <FaLightbulb className="text-4xl text-amber-400" />

                    </div>

                    <h2 className="text-5xl font-black mb-6">
                      Our Vision
                    </h2>

                    <p
                      className="
                        text-slate-300
                        text-lg
                        leading-relaxed
                      "
                    >
                      Creating smarter, cleaner, and digitally connected
                      cities where citizens and officials collaborate
                      seamlessly for urban transformation.
                    </p>

                  </CardContent>

                </Card>

              </motion.div>

            </div>

          </section>



          {/* ====================================================== */}
          {/* ================= FEATURES =========================== */}
          {/* ====================================================== */}

          <section className="py-28 px-6">

            <div className="max-w-7xl mx-auto">

              <div className="text-center mb-20">

                <Badge
                  className="
                    bg-green-500/10
                    text-green-300
                    border
                    border-green-500/30
                    px-5
                    py-2
                    rounded-full
                    mb-6
                  "
                >

                  <FaUserTie className="mr-2" />

                  Staff Features

                </Badge>

                <h2 className="text-6xl font-black">
                  Built for Modern Governance
                </h2>

              </div>


              <div className="grid md:grid-cols-3 gap-8">

                {
                  cards.map((card, i) => (

                    <motion.div
                      key={i}

                      initial={{
                        opacity: 0,
                        y: 80,
                      }}

                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}

                      transition={{
                        delay: i * 0.2,
                      }}
                    >

                      <Card
                        className="
                          bg-white/5
                          border
                          border-white/10
                          backdrop-blur-2xl
                          rounded-[32px]
                          p-8
                          hover:-translate-y-4
                          hover:border-green-500/40
                          transition-all
                          duration-500
                          h-full
                        "
                      >

                        <CardContent className="p-0">

                          <div
                            className="
                              w-20
                              h-20
                              rounded-2xl
                              bg-green-500/10
                              flex
                              items-center
                              justify-center
                              mb-8
                              text-4xl
                              text-green-400
                            "
                          >
                            {card.icon}
                          </div>

                          <h3 className="text-3xl font-bold mb-4">
                            {card.title}
                          </h3>

                          <p className="text-slate-300 leading-relaxed text-lg">
                            {card.desc}
                          </p>

                        </CardContent>

                      </Card>

                    </motion.div>
                  ))
                }

              </div>

            </div>

          </section>



          {/* ====================================================== */}
          {/* ================= REWARDS ============================ */}
          {/* ====================================================== */}

          <section className="py-28 px-6">

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
              }}

              whileInView={{
                opacity: 1,
                scale: 1,
              }}

              transition={{
                duration: 0.8,
              }}

              className="
                max-w-6xl
                mx-auto
                rounded-[40px]
                border
                border-green-500/20
                bg-gradient-to-r
                from-green-500/10
                to-emerald-500/10
                backdrop-blur-2xl
                p-14
              "
            >

              <div className="flex items-center gap-5 mb-12">

                <FaAward className="text-6xl text-yellow-400" />

                <h2 className="text-5xl font-black">
                  Rewards & Recognition
                </h2>

              </div>


              <div className="grid md:grid-cols-3 gap-8">

                {[
                  "Certificates of Excellence",
                  "Monthly Performance Awards",
                  "Department Achievement Trophies",
                ].map((item, i) => (

                  <div
                    key={i}
                    className="
                      bg-white/5
                      rounded-3xl
                      border
                      border-white/10
                      p-8
                    "
                  >

                    <div className="text-5xl mb-6">
                      {i === 0 ? "🥇" : i === 1 ? "🎖️" : "🏆"}
                    </div>

                    <p className="text-xl text-slate-200">
                      {item}
                    </p>

                  </div>
                ))}

              </div>

            </motion.div>

          </section>



          {/* ====================================================== */}
          {/* ================= COMMITMENT ========================= */}
          {/* ====================================================== */}

          <section className="py-28 px-6">

            <motion.div
              initial={{
                opacity: 0,
                y: 60,
              }}

              whileInView={{
                opacity: 1,
                y: 0,
              }}

              transition={{
                duration: 0.8,
              }}

              className="
                max-w-5xl
                mx-auto
                text-center
                bg-white/5
                border
                border-white/10
                backdrop-blur-2xl
                rounded-[40px]
                p-14
              "
            >

              <FaHandshake className="text-7xl text-teal-400 mx-auto mb-8" />

              <h2 className="text-5xl font-black mb-8">
                Our Commitment
              </h2>

              <p
                className="
                  text-xl
                  text-slate-300
                  leading-relaxed
                  max-w-4xl
                  mx-auto
                "
              >
                We are committed to providing advanced digital tools,
                AI-powered workflows, transparency, accountability,
                and continuous support for smarter governance.
              </p>

            </motion.div>

          </section>



          {/* ====================================================== */}
          {/* ================= SLOGANS ============================ */}
          {/* ====================================================== */}

          <section className="py-28 px-6">

            <div className="max-w-7xl mx-auto">

              <div className="text-center mb-16">

                <h2
                  className="
                    text-5xl
                    font-black
                    flex
                    items-center
                    justify-center
                    gap-4
                  "
                >

                  <FaGlobe className="text-green-400" />

                  Our Principles

                </h2>

              </div>


              <div className="grid md:grid-cols-3 gap-8">

                {[
                  "Smart Staff, Smarter Cities",
                  "Digital Governance for Everyone",
                  "Together for Better Jharkhand",
                ].map((item, i) => (

                  <motion.div
                    key={i}

                    initial={{
                      opacity: 0,
                      y: 60,
                    }}

                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}

                    transition={{
                      delay: i * 0.2,
                    }}
                  >

                    <Card
                      className="
                        bg-white/5
                        border
                        border-white/10
                        backdrop-blur-2xl
                        rounded-[32px]
                        p-10
                        text-center
                        hover:-translate-y-3
                        hover:border-green-500/40
                        transition-all
                        duration-500
                      "
                    >

                      <CardContent className="p-0">

                        <p
                          className="
                            text-2xl
                            italic
                            font-semibold
                            text-green-300
                            leading-relaxed
                          "
                        >
                          “{item}”
                        </p>

                      </CardContent>

                    </Card>

                  </motion.div>
                ))}

              </div>

            </div>

          </section>

        </div>

      </div>
    </>
  );
};

export default About;