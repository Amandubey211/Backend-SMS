// useThrottle.js
import { useRef, useCallback } from "react";

/**
 * Custom hook to throttle a function.
 * @param {Function} func - The function to throttle.
 * @param {number} limit - The time limit in milliseconds.
 * @returns {Function} - The throttled function.
 */
const useThrottle = (func, limit) => {
  const lastFunc = useRef();
  const lastRan = useRef(Date.now());

  return useCallback(
    (...args) => {
      const context = this;
      const now = Date.now();

      if (now - lastRan.current >= limit) {
        func.apply(context, args);
        lastRan.current = now;
      } else {
        clearTimeout(lastFunc.current);
        lastFunc.current = setTimeout(() => {
          if (Date.now() - lastRan.current >= limit) {
            func.apply(context, args);
            lastRan.current = Date.now();
          }
        }, limit - (now - lastRan.current));
      }
    },
    [func, limit]
  );
};

export default useThrottle;
