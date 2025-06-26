// components/Common/Sidebar.jsx
import React, { useEffect, useRef, useCallback } from "react";
import { RxCross2 } from "react-icons/rx";

/**
 * Sidebar (sliding drawer)
 * ------------------------------------------------------------------
 * • Click-outside and <Esc> close.
 * • Focus is trapped inside while open.
 * • Optional `width` prop (%, px, rem …) now respected for **any** value.
 * • Back-drop gets a subtle blur (backdrop-blur) + dark overlay.
 * ------------------------------------------------------------------
 *
 *  <Sidebar
 *    isOpen={isBookSidebarOpen}
 *    onClose={() => setBookSidebarOpen(false)}
 *    title={t("Add New Book")}
 *    width="60%"                    // ← dynamic width works now
 *    ignoreClickOutsideSelectors={[ ".ant-dropdown" ]}
 *  >
 *    …children…
 *  </Sidebar>
 */
const Sidebar = ({
  isOpen,
  title,
  onClose,
  children,
  width = "35%",
  ignoreClickOutsideSelectors = [],
}) => {
  const sidebarRef = useRef(null);
  const closeBtnRef = useRef(null);

  /* ------------------------  focus-trap (Tab loop)  ------------------------ */
  const trapFocus = useCallback((e) => {
    if (e.key !== "Tab" || !sidebarRef.current) return;

    const focusables = sidebarRef.current.querySelectorAll(
      'a, button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables.length) return e.preventDefault();

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, []);

  /* ------------------------  close on outside click  ----------------------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      const defaultIgnore = [
        ".ant-picker-dropdown",
        ".ant-select-dropdown",
        ".ant-modal",
        ".ant-modal-mask",
      ];
      const ignoreSelectors = [...defaultIgnore, ...ignoreClickOutsideSelectors];

      const shouldIgnore =
        ignoreSelectors.some((sel) => e.target.closest(sel)) ||
        document.querySelector(".ant-confirm, .ant-modal-confirm");

      if (!shouldIgnore && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", trapFocus);
      document.addEventListener("keydown", (e) => e.key === "Escape" && onClose());
      // autofocus the close button for accessibility
      closeBtnRef.current?.focus();
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", trapFocus);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", trapFocus);
    };
  }, [isOpen, onClose, trapFocus, ignoreClickOutsideSelectors]);

  /* -------------------------------  render  -------------------------------- */
  return (
    <div
      className={`fixed inset-0 z-40 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sidebar-title"
    >
      {/* Blurred dark overlay */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity`}
      />

      {/* Sliding panel */}
      <div
        ref={sidebarRef}
        style={{
          width: typeof width === "number" ? `${width}px` : width,
          maxWidth: "100vw",
        }}
        className={`absolute top-0 right-0 h-full overflow-y-auto py-3 px-4 bg-white shadow-lg transform transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4" id="sidebar-title">
          <h2 className="font-semibold text-lg text-gray-800">{title || "Sidebar"}</h2>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Close sidebar"
            className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            <RxCross2 className="text-xl" />
          </button>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
};

export default Sidebar;
