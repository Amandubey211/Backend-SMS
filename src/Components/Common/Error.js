// src/pages/Error404.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { LazyMotion, domAnimation, m } from "framer-motion";

/* ── Assets ──────────────────────────────────────────────────────────────── */
import bgVideo from "../../Assets/ErrorPageAsset/404ErrorBg2.mp4";
import posterImg from "../../Assets/ErrorPageAsset/404ErrorPoster2.png"; // optional fallback

/* ── Helper: full-screen looping video ───────────────────────────────────── */
function BackgroundVideo({ src, poster }) {
  return (
    <video
      className="fixed inset-0 w-full h-full object-cover pointer-events-none"
      src={src}
      poster={poster}
      autoPlay
      loop
      muted
      playsInline
    />
  );
}

/* ── Main 404 page ───────────────────────────────────────────────────────── */
function Error404() {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const handleKey = (e) => {
    if (e.key === "Enter" || e.key === " ") goBack();
  };

  return (
    <LazyMotion features={domAnimation}>
      {/* Background video */}
      <BackgroundVideo src={bgVideo} poster={posterImg} />

      {/* Animated back button */}
      <m.div
        className="fixed bottom-8 left-8 z-10"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <button
          className="bg-black bg-opacity-70 text-white px-6 py-3 rounded-lg shadow-lg backdrop-filter backdrop-blur-sm border border-white border-opacity-20 hover:bg-opacity-90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          onClick={goBack}
          onKeyDown={handleKey}
          aria-label="Go back"
        >
          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span>Go Back</span>
          </div>
        </button>
      </m.div>
    </LazyMotion>
  );
}

export default Error404;
