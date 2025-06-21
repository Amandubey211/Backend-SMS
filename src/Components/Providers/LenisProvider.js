// import { useEffect, useRef } from "react";
// import Lenis from "lenis";

// const LenisProvider = ({ children }) => {
//   const lenisRef = useRef(null);

//   useEffect(() => {
//     const wrapper = document.getElementById("lenis-scroll");

//     if (!wrapper) {
//       console.warn("❌ Lenis scroll wrapper not found.");
//       return;
//     }

//     const lenis = new Lenis({
//       wrapper,
//       content: wrapper.firstElementChild,
//       duration: 1.5,
//       smooth: true,
//       smoothTouch: true,
//       easing: (t) => Math.min(1, 1.001 - Math.pow(2, -12 * t)),
//     });

//     lenisRef.current = lenis;

//     const raf = (time) => {
//       lenis.raf(time);
//       requestAnimationFrame(raf);
//     };

//     requestAnimationFrame(raf);

//     // Optional: observe if content changes
//     const observer = new MutationObserver(() => {
//       lenis?.scrollTo(0); // or rebind if needed
//     });

//     if (wrapper) {
//       observer.observe(wrapper, { childList: true, subtree: true });
//     }

//     return () => {
//       lenis.destroy();
//       observer.disconnect();
//     };
//   }, []);

//   return <>{children}</>;
// };

// export default LenisProvider;
