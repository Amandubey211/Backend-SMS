// src/hooks/useWindowSize.js

import { useState, useEffect } from "react";

const useWindowSize = () => {
  const [size, setSize] = useState({
    width: undefined,
    breakpoint: "lg", // default breakpoint
  });

  useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      const width = window.innerWidth;
      let breakpoint = "lg"; // default

      if (width < 640) {
        breakpoint = "sm";
      } else if (width >= 640 && width < 1024) {
        breakpoint = "md";
      } else if (width >= 1024 && width < 1280) {
        breakpoint = "lg";
      } else {
        breakpoint = "xl";
      }

      setSize({
        width,
        breakpoint,
      });
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return size;
};

export default useWindowSize;
