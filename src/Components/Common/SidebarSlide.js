// SidebarSlide.js
import React, { useEffect, useRef, useCallback } from "react";
import { RxCross2 } from "react-icons/rx";

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
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", trapFocus);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", trapFocus);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", trapFocus);
    };
  }, [isOpen, onClose, trapFocus]);

  return (
    <div
      className={`fixed inset-0 z-30 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{ overflowY: "auto" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sidebar-title"
    >
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        aria-hidden="true"
      ></div>
      <div
        ref={sidebarRef}
        style={{
          width: width || "33%",
          height: height || "100%",
          overflowY: "auto",
          padding: "20px",
          borderRadius: "8px",
          scrollbarWidth: "thin",
          scrollbarColor: "#888 #f1f1f1",
        }}
        className={`fixed top-0 right-0 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300`}
      >
        <div
          className="flex justify-between items-center px-2"
          id="sidebar-title"
        >
          <h1 className="font-semibold">{title || "Please give title"}</h1>
          <button
            onClick={onClose}
            className="p-1 m-1 opacity-70"
            aria-label="Close sidebar"
          >
            <RxCross2 className="text-xl" />
          </button>
        </div>
        <div className="mt-4">{children}</div>
        {footer && <div className="mt-4">{footer}</div>}
      </div>
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
    </div>
  );
};

export default SidebarSlide;
