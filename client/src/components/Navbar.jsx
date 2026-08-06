import React, {
  useContext,
} from "react";

import {
  User,
  Menu,
  Info,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import GoogleTranslate from "./GoogleTranslate";

import AuthContext from "../context/AuthContext";

import {
  motion,
} from "framer-motion";


const Navbar = ({
  onHoverSidebar,
}) => {

  const navigate =
    useNavigate();

  const {
    user: currentUser,
  } = useContext(AuthContext);




  return (

    <nav className="fixed top-0 left-0 w-full z-50">

      <div className="bg-gradient-to-r from-emerald-800 via-green-700 to-teal-700 backdrop-blur-2xl border-b border-white/10 shadow-2xl">

        <div className="h-16 px-6 flex items-center justify-between">

          {/* ============================================ */}
          {/* LEFT SECTION */}
          {/* ============================================ */}

          <div className="flex items-center gap-4">

            <motion.button

              whileHover={{
                scale: 1.1,
              }}

              whileTap={{
                scale: 0.95,
              }}

              onMouseEnter={
                onHoverSidebar
              }

              className="
                p-3
                rounded-2xl
                hover:bg-white/10
                active:bg-white/20
                transition-all
                duration-200
                text-white
              "

              aria-label="Toggle sidebar"
            >

              <Menu className="w-6 h-6" />

            </motion.button>


            {/* LOGO */}

            <div

              className="
                flex
                items-center
                gap-3
                cursor-pointer
                group
              "

              onClick={() =>
                navigate("/dashboard")
              }
            >

              <motion.div

                whileHover={{
                  rotate: 8,
                  scale: 1.05,
                }}

                className="
                  bg-white/10
                  backdrop-blur-md
                  p-2.5
                  rounded-2xl
                  border
                  border-white/20
                  hover:bg-white/20
                  transition-all
                  duration-300
                  shadow-inner
                "
              >

                <img
                  src="/government-of-jharkhand.png"

                  alt="Government of Jharkhand"

                  className="
                    w-9
                    h-9
                    object-contain
                  "
                />

              </motion.div>


              <div>

                <p className="text-white font-bold text-xl tracking-tighter group-hover:text-emerald-100 transition-colors">

                  Nagar Sahayata

                </p>

                <p className="text-emerald-200 text-xs font-light -mt-1 tracking-wide">

                  GOVERNMENT OF JHARKHAND

                </p>

              </div>

            </div>

          </div>


          {/* ============================================ */}
          {/* CENTER TITLE */}
          {/* ============================================ */}

          <div className="hidden md:block">

            <motion.h1

              whileHover={{
                scale: 1.02,
              }}

              onClick={() =>
                navigate("/dashboard")
              }

              className="
                text-xl
                font-bold
                text-white
                tracking-[4px]
                uppercase
                cursor-pointer
                hover:text-emerald-100
                transition-all
                duration-300
                hover:tracking-widest
              "
            >

              NAGAR SAHAYATA

            </motion.h1>

          </div>


          {/* ============================================ */}
          {/* RIGHT SECTION */}
          {/* ============================================ */}

          <div className="flex items-center gap-2">


            {/* PROFILE */}

            <motion.button

              whileHover={{
                scale: 1.1,
              }}

              whileTap={{
                scale: 0.95,
              }}

              onClick={() =>
                navigate("/profile")
              }

              className="
                p-3
                rounded-2xl
                hover:bg-white/10
                active:bg-white/20
                transition-all
                duration-200
                text-white
                cursor-pointer
              "
            >

              <User className="w-6 h-6" />

            </motion.button>


            {/* ABOUT */}

            <motion.button

              whileHover={{
                scale: 1.1,
              }}

              whileTap={{
                scale: 0.95,
              }}

              onClick={() =>
                navigate("/about")
              }

              className="
                p-3
                rounded-2xl
                hover:bg-white/10
                active:bg-white/20
                transition-all
                duration-200
                text-white
                cursor-pointer
              "
            >

              <Info className="w-6 h-6" />

            </motion.button>


            {/* GOOGLE TRANSLATE */}

            <div className="pl-3 border-l border-white/20">

              <GoogleTranslate />

            </div>

          </div>

        </div>

      </div>

    </nav>
  );
};

export default Navbar;