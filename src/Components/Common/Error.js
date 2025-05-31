// // src/pages/Error404.js
// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { LazyMotion, domAnimation, m } from "framer-motion";

// /* ── Assets ──────────────────────────────────────────────────────────────── */
// import bgVideo from "../../Assets/ErrorPageAsset/404ErrorBg2.mp4";
// import posterImg from "../../Assets/ErrorPageAsset/404ErrorPoster2.png"; // optional fallback

// /* ── Helper: full-screen looping video ───────────────────────────────────── */
// function BackgroundVideo({ src, poster }) {
//   return (
//     <video
//       className="fixed inset-0 w-full h-full object-cover pointer-events-none"
//       src={src}
//       poster={poster}
//       autoPlay
//       loop
//       muted
//       playsInline
//     />
//   );
// }

// /* ── Main 404 page ───────────────────────────────────────────────────────── */
// function Error404() {
//   const navigate = useNavigate();
//   const goBack = () => navigate(-1);
//   const handleKey = (e) => {
//     if (e.key === "Enter" || e.key === " ") goBack();
//   };

//   return (
//     <LazyMotion features={domAnimation}>
//       {/* Background video */}
//       <BackgroundVideo src={bgVideo} poster={posterImg} />

//       {/* Animated back button */}
//       <m.div
//         className="fixed bottom-8 left-8 z-10"
//         initial={{ opacity: 0, x: -20 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ delay: 0.5, duration: 0.5 }}
//         whileHover={{ scale: 1.05 }}
//         whileTap={{ scale: 0.95 }}
//       >
//         <button
//           className="bg-black bg-opacity-70 text-white px-6 py-3 rounded-lg shadow-lg backdrop-filter backdrop-blur-sm border border-white border-opacity-20 hover:bg-opacity-90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
//           onClick={goBack}
//           onKeyDown={handleKey}
//           aria-label="Go back"
//         >
//           <div className="flex items-center space-x-2">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5"
//               viewBox="0 0 20 20"
//               fill="currentColor"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
//                 clipRule="evenodd"
//               />
//             </svg>
//             <span>Go Back</span>
//           </div>
//         </button>
//       </m.div>
//     </LazyMotion>
//   );
// }

// export default Error404;
// src/pages/Error404.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { LazyMotion, domAnimation, m } from "framer-motion";

/* ── Main 404 page ───────────────────────────────────────────────────────── */
function Error404() {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const handleKey = (e) => {
    if (e.key === "Enter" || e.key === " ") goBack();
  };

  return (
    <LazyMotion features={domAnimation}>
      {/* Glamorous background gradient */}
      <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-[#C83B62] to-[#7F35CD] overflow-hidden">
        {/* Sparkle particles */}
        {[...Array(20)].map((_, i) => (
          <m.div
            key={i}
            className="absolute rounded-full bg-white bg-opacity-70"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5,
              opacity: 0,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: [0, 1, 0],
              scale: [0.5, 1.2, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random() * 5,
            }}
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
            }}
          />
        ))}

        {/* Main content container */}
        <div className="relative w-full h-full flex flex-col items-center justify-center p-4 backdrop-blur-[1px]">
          {/* Glamorous 404 text */}
          <m.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, type: "spring" }}
            className="text-center mb-8 relative"
          >
            <div className="flex items-center justify-center relative">
              {[4, 0, 4].map((num, i) => (
                <m.span
                  key={i}
                  className="text-[180px] font-bold text-white drop-shadow-lg"
                  style={{
                    textShadow: "0 0 15px rgba(255,255,255,0.5)",
                    fontFamily: "'Playfair Display', serif",
                  }}
                  animate={{
                    y: i === 1 ? [0, -15, 0] : [0, 15, 0],
                    rotate: i === 1 ? [0, 5, -5, 0] : 0,
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3 + i,
                    ease: "easeInOut",
                  }}
                >
                  {num}
                </m.span>
              ))}
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-8 -left-8 w-16 h-16 border-t-4 border-l-4 border-white border-opacity-50"></div>
            <div className="absolute -bottom-8 -right-8 w-16 h-16 border-b-4 border-r-4 border-white border-opacity-50"></div>

            <m.h2
              className="text-5xl mt-4 font-light tracking-wider"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              LOST IN SPACE
            </m.h2>
            <m.p
              className="text-xl mt-6 text-white text-opacity-80 max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.7 }}
            >
              The page you're looking for has either vanished or never existed.
            </m.p>
          </m.div>

          {/* Luxurious back button */}
          <m.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-white rounded-xl blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            <button
              className="relative bg-white bg-opacity-10 text-white px-8 py-4 rounded-xl shadow-2xl backdrop-filter backdrop-blur-sm border-2 border-white border-opacity-30 hover:bg-opacity-20 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-30"
              onClick={goBack}
              onKeyDown={handleKey}
              aria-label="Go back"
            >
              <div className="flex items-center space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 transform group-hover:-translate-x-1 transition-transform"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-lg tracking-wider">RETURN TO SAFETY</span>
              </div>
            </button>
          </m.div>
        </div>
      </div>
    </LazyMotion>
  );
}

export default Error404;
