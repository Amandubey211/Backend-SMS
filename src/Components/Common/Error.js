// src/Pages/Admin/Users/Parents/Error404.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaSearch,
  FaLifeRing,
  FaFileAlt,
  FaChartBar,
  FaSitemap,
} from "react-icons/fa";
import { motion, LazyMotion, domAnimation } from "framer-motion";

const Error404 = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <LazyMotion features={domAnimation}>
      <div
        className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#C83B62] to-[#7F35CD] overflow-hidden relative"
        role="alert"
        aria-live="polite"
        aria-atomic="true"
      >
        {/* Main Card with Animated Gradient Border */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative p-0.5 rounded-xl bg-gradient-to-r from-[#C83B62] via-[#9C3B9E] to-[#7F35CD] w-full max-w-4xl mx-4 shadow-2xl"
        >
          <div className="relative z-10 bg-gray-900 bg-opacity-80 backdrop-blur-md rounded-xl overflow-hidden">
            <div className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12">
              {/* Data Visualization Graphic */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="flex-shrink-0"
              >
                <div className="relative w-40 h-40">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    <path
                      d="M100,100 L100,0 A100,100 0 0,1 190,50 Z"
                      fill="rgba(255,255,255,0.2)"
                    />
                    <path
                      d="M100,100 L190,50 A100,100 0 0,1 100,200 Z"
                      fill="rgba(255,255,255,0.1)"
                    />
                    <motion.text
                      x="100"
                      y="110"
                      textAnchor="middle"
                      fill="white"
                      fontSize="40"
                      fontWeight="bold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      404
                    </motion.text>
                    <motion.circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="transparent"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="2"
                      initial={{ strokeDasharray: "0 565" }}
                      animate={{ strokeDasharray: "565 565" }}
                      transition={{ duration: 1.5, delay: 0.2 }}
                    />
                  </svg>
                </div>
              </motion.div>

              {/* Content Area */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="flex-1 text-center md:text-left"
              >
                <h1 className="text-6xl md:text-8xl font-bold text-white mb-2">
                  404
                </h1>
                <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
                  Page Not Found
                </h2>
                <p className="text-lg text-white text-opacity-80 max-w-md mb-8">
                  The resource you requested couldn't be located. It may have
                  been moved or deleted.
                </p>

                {/* Search Bar */}
                <div className="relative mt-6 w-full max-w-md mx-auto md:mx-0 mb-8">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search our site..."
                    className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30"
                    aria-label="Search site content"
                  />
                  <button
                    onClick={() =>
                      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
                    }
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-white opacity-70 hover:opacity-100 transition-opacity"
                    aria-label="Submit search"
                  >
                    <FaSearch />
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <motion.button
                    whileHover={{
                      scale: 1.02,
                      backgroundColor: "rgba(255,255,255,0.95)",
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{
                      scale: 0.98,
                      backgroundColor: "rgba(255,255,255,0.85)",
                    }}
                    className="px-6 py-3 bg-white text-[#7F35CD] rounded-lg font-medium shadow-md flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all"
                    onClick={() => navigate(-1)}
                    aria-label="Navigate back to previous page"
                  >
                    <FaArrowLeft aria-hidden="true" />
                    <span>Go Back</span>
                  </motion.button>
                  <motion.button
                    whileHover={{
                      scale: 1.02,
                      backgroundColor: "rgba(255,255,255,0.15)",
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{
                      scale: 0.98,
                      backgroundColor: "rgba(255,255,255,0.10)",
                    }}
                    className="px-6 py-3 bg-white bg-opacity-10 text-white rounded-lg font-medium shadow-md border border-white border-opacity-20 hover:bg-opacity-20 transition-all"
                    onClick={() => navigate("/")}
                  >
                    Return Home
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {/* Contextual Help Footer */}
            <div className="bg-gray-900 bg-opacity-70 p-4 border-t border-white border-opacity-10">
              <details className="group">
                <summary className="flex justify-between items-center text-white text-opacity-80 cursor-pointer list-none">
                  <span className="flex items-center gap-2">
                    <FaLifeRing className="opacity-60" />
                    Need assistance?
                  </span>
                  <svg
                    className="w-5 h-5 transform group-open:rotate-180 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="mt-3 pt-3 border-t border-white border-opacity-10 text-white text-opacity-70 text-sm grid grid-cols-1 md:grid-cols-2 gap-3">
                  <a
                    href="/support"
                    className="hover:text-white transition-colors flex items-center gap-2"
                  >
                    <FaLifeRing className="opacity-60" /> Contact Support
                  </a>
                  <a
                    href="/docs"
                    className="hover:text-white transition-colors flex items-center gap-2"
                  >
                    <FaFileAlt className="opacity-60" /> Documentation
                  </a>
                  <a
                    href="/status"
                    className="hover:text-white transition-colors flex items-center gap-2"
                  >
                    <FaChartBar className="opacity-60" /> System Status
                  </a>
                  <a
                    href="/sitemap"
                    className="hover:text-white transition-colors flex items-center gap-2"
                  >
                    <FaSitemap className="opacity-60" /> Full Sitemap
                  </a>
                </div>
              </details>
            </div>
          </div>

          {/* Animated Glow Effect */}
          <motion.div
            className="absolute -inset-2 rounded-xl bg-gradient-to-r from-[#C83B62] via-[#9C3B9E] to-[#7F35CD] blur-lg opacity-0 z-0"
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.div>
      </div>
    </LazyMotion>
  );
};

export default Error404;
