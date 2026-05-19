import React, {
  useState,
  useEffect,
  useContext,
} from "react";

import {
  Bell,
  User,
  Menu,
  Info,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import GoogleTranslate from "./GoogleTranslate";

import axios from "../api/axios";

import NotificationsPanel from "./NotificationsPanel";

import AuthContext from "../context/AuthContext";

import {
  motion,
  AnimatePresence,
} from "framer-motion";


const Navbar = ({
  onHoverSidebar,
}) => {

  const navigate =
    useNavigate();

  const {
    user: currentUser,
  } = useContext(AuthContext);

  const [
    notificationCount,
    setNotificationCount,
  ] = useState(0);

  const [
    showNotifications,
    setShowNotifications,
  ] = useState(false);


  // ============================================
  // FETCH NOTIFICATIONS
  // ============================================

  useEffect(() => {

    const fetchNotificationCount =
      async () => {

        if (!currentUser) return;

        try {

          // ============================================
          // JUNIOR STAFF
          // ============================================

          if (
            currentUser.role ===
            "Junior Staff"
          ) {

            const res =
              await axios.get(
                "/api/reports/assigned"
              );

            setNotificationCount(
              res.data.length || 0
            );
          }

          // ============================================
          // STAFF
          // ============================================

          else if (
            currentUser.role ===
            "Staff"
          ) {

            const res =
              await axios.get(
                "/api/notifications/unread-count"
              );

            setNotificationCount(
              res.data.count || 0
            );
          }

        } catch (error) {

          console.error(
            "Failed to fetch notification count",
            error
          );
        }
      };

    fetchNotificationCount();

  }, [currentUser]);


  // ============================================
  // TOGGLE NOTIFICATIONS
  // ============================================

  const toggleNotifications =
    () => {

      setShowNotifications(
        (prev) => !prev
      );
    };


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


            {/* ============================================ */}
            {/* NOTIFICATIONS ONLY FOR STAFF + JUNIOR STAFF */}
            {/* ============================================ */}

            {currentUser?.role !==
              "Higher Authority" && (

              <motion.button

                whileHover={{
                  scale: 1.1,
                }}

                whileTap={{
                  scale: 0.95,
                }}

                onClick={
                  toggleNotifications
                }

                className="
                  relative
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

                <Bell className="w-6 h-6" />

                {notificationCount >
                  0 && (

                  <motion.span

                    initial={{
                      scale: 0,
                    }}

                    animate={{
                      scale: [
                        1,
                        1.2,
                        1,
                      ],
                    }}

                    transition={{
                      repeat:
                        Infinity,

                      duration:
                        1.5,
                    }}

                    className="
                      absolute
                      -top-1
                      -right-1
                      bg-red-500
                      text-white
                      text-xs
                      font-bold
                      w-5
                      h-5
                      flex
                      items-center
                      justify-center
                      rounded-full
                      ring-2
                      ring-white
                      shadow
                    "
                  >

                    {
                      notificationCount
                    }

                  </motion.span>
                )}

              </motion.button>
            )}


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


      {/* ============================================ */}
      {/* NOTIFICATION PANEL */}
      {/* ============================================ */}

      <AnimatePresence>

        {showNotifications && (

          <motion.div

            initial={{
              opacity: 0,
              y: -20,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            exit={{
              opacity: 0,
              y: -20,
            }}

            className="
              absolute
              top-16
              right-6
              z-50
            "
          >

            <NotificationsPanel
              onClose={() =>
                setShowNotifications(false)
              }
            />

          </motion.div>
        )}

      </AnimatePresence>

    </nav>
  );
};

export default Navbar;