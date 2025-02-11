// Sidebar.jsx
import React, { useEffect, useRef, useCallback } from "react";
import { RxCross2 } from "react-icons/rx";

const Sidebar = ({ isOpen, title, onClose, children, width = "35%" }) => {
  const sidebarRef = useRef(null);
  const closeButtonRef = useRef(null); // Reference to the close button

  // Focus trap logic to keep focus within the sidebar when open
  const trapFocus = useCallback((event) => {
    if (event.key === "Tab" && sidebarRef.current) {
      const focusableElements = sidebarRef.current.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements?.length === 0) {
        event.preventDefault();
        return;
      }
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (event.shiftKey) {
        // Shift + Tab: cycle to the last element if at the beginning
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: cycle to the first element if at the end
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the click is inside an Ant Design DatePicker dropdown, a modal, or its mask, ignore it.
      if (
        event.target.closest(".ant-picker-dropdown") ||
        event.target.closest(".ant-modal") ||
        event.target.closest(".ant-modal-mask") ||
        document.querySelector(".ant-confirm, .ant-modal-confirm") // Check if a confirm modal is open
      ) {
        return;
      }
      // If the click target is outside the sidebar, close the sidebar.
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
      className={`fixed inset-0 z-40 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
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
        style={{ width }}
        className={`absolute top-0 right-0 h-full overflow-y-auto py-3 px-4 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform`}
      >
        <div
          className="flex justify-between items-center px-2"
          id="sidebar-title"
        >
          <h1 className="font-semibold text-gradient">
            {title || "Please give title"}
          </h1>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-1 m-1 opacity-70"
            aria-label="Close sidebar"
          >
            <RxCross2 className="text-xl" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Sidebar;
