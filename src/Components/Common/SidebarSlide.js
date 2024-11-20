// SidebarSlide.js
import React, { useEffect, useRef, useCallback } from "react";
import { RxCross2 } from "react-icons/rx";
import { motion, AnimatePresence } from "framer-motion";

const sidebarVariants = {
  hidden: { x: "100%" },
  visible: { x: "0%" },
  exit: { x: "100%" },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.5 },
  exit: { opacity: 0 },
};

const SidebarSlide = ({
  isOpen,
  title,
  onClose,
  children,
  footer,
  width,
  height,
}) => {
  const sidebarRef = useRef(null);

  // Focus trap logic
  const trapFocus = useCallback(
    (event) => {
      if (event.key === "Tab" && sidebarRef.current) {
        const focusableElements = sidebarRef.current.querySelectorAll(
          'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) {
          event.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    },
    [sidebarRef]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", trapFocus);
      // Optionally, prevent background scrolling when sidebar is open
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("keydown", trapFocus);
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("keydown", trapFocus);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, trapFocus]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black z-40"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            aria-hidden="true"
          />

          {/* Sidebar */}
          <motion.div
            ref={sidebarRef}
            className="fixed top-0 right-0 h-full bg-white z-50 shadow-lg"
            style={{ width: width || "33%", height: height || "100%" }}
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="sidebar-title"
          >
            <div
              className="flex justify-between items-center px-4 py-2 border-b"
              id="sidebar-title"
            >
              <h1 className="font-semibold text-xl ps-4 text-gradient">
                {title || "Please provide a title"}
              </h1>
              <button
                onClick={onClose}
                className="p-1 m-1 opacity-70 hover:opacity-100 transition-opacity"
                aria-label="Close sidebar"
              >
                <RxCross2 className="text-2xl" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">{children}</div>
            {footer && <div className="p-4 border-t">{footer}</div>}
          </motion.div>
          <style jsx>{`
            ::-webkit-scrollbar {
              width: 8px;
            }
            ::-webkit-scrollbar-track {
              background: #f1f1f1;
            }
            ::-webkit-scrollbar-thumb {
              background-color: #888;
              border-radius: 10px;
              border: 3px solid #f1f1f1;
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
};

export default SidebarSlide;
