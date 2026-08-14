import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import animation from "../assets/404-animation.json";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden relative">

      {/* Background glow */}
      <motion.div
        className="absolute w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -80, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Second background glow */}
      <motion.div
        className="absolute w-80 h-80 bg-purple-600/20 rounded-full blur-3xl"
        animate={{
          x: [0, -120, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Main content */}
      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.8,
        }}
        className="relative z-10 flex flex-col items-center"
      >

        {/* Cat Lottie Animation */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.8,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.7,
          }}
        >
          <DotLottieReact
            data={JSON.stringify(animation)}
            autoplay
            loop
            style={{
              width: "420px",
              height: "420px",
            }}
          />
        </motion.div>

        {/* Home Button */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.5,
            duration: 0.5,
          }}
          className="-mt-8"
        >
          <Link to="/">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 30px rgba(59, 130, 246, 0.6)",
              }}
              whileTap={{
                scale: 0.95,
              }}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl shadow-lg transition-colors"
            >
              Take Me Home
            </motion.button>
          </Link>
        </motion.div>

      </motion.div>
    </div>
  );
}

export default NotFound;