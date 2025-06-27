import React, { useEffect, useRef, useCallback } from "react";
import { RxCross2 } from "react-icons/rx";

/**
 * Sidebar (sliding drawer)
 * ------------------------------------------------------------------
 * • Click-outside and <Esc> close.
 * • Focus is trapped inside while open.
 * • First focus goes to the **first focusable element** in the panel,
 *   falling back to the close button – so scanners that send “Enter”
 *   will never trigger the X button by mistake.
 * • All event-listeners are cleaned up correctly (no memory-leaks).
 * ------------------------------------------------------------------
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

  /* ------------------------------------------------------------------ */
  /*  Focus-trap (Tab loop)                                             */
  /* ------------------------------------------------------------------ */
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

  /* ------------------------------------------------------------------ */
  /*  Helpers                                                           */
  /* ------------------------------------------------------------------ */
  const setInitialFocus = () => {
    if (!sidebarRef.current) return;

    const firstFocusable = sidebarRef.current.querySelector(
      'input, select, textarea, button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (firstFocusable) {
      firstFocusable.focus();
    } else {
      closeBtnRef.current?.focus();
    }
  };

  const escapeHandler = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  const clickOutsideHandler = useCallback(
    (e) => {
      const defaultIgnore = [
        ".ant-picker-dropdown",
        ".ant-select-dropdown",
        ".ant-modal",
        ".ant-modal-mask",
      ];
      const ignoreSelectors = [
        ...defaultIgnore,
        ...ignoreClickOutsideSelectors,
      ];

      const shouldIgnore =
        ignoreSelectors.some((sel) => e.target.closest(sel)) ||
        document.querySelector(".ant-confirm, .ant-modal-confirm");

      if (
        !shouldIgnore &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        onClose();
      }
    },
    [onClose, ignoreClickOutsideSelectors]
  );

  /* ------------------------------------------------------------------ */
  /*  Lifecycle                                                         */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", clickOutsideHandler);
      document.addEventListener("keydown", trapFocus);
      document.addEventListener("keydown", escapeHandler);

      // Give the DOM one tick to paint before focusing
      setTimeout(setInitialFocus, 0);
    }
    return () => {
      document.removeEventListener("mousedown", clickOutsideHandler);
      document.removeEventListener("keydown", trapFocus);
      document.removeEventListener("keydown", escapeHandler);
    };
  }, [isOpen, clickOutsideHandler, trapFocus, escapeHandler]);

  /* ------------------------------------------------------------------ */
  /*  Render                                                            */
  /* ------------------------------------------------------------------ */
  return (
    <div
      className={`fixed inset-0 z-40 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sidebar-title"
    >
      {/* Back-drop */}
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
      />

      {/* Panel */}
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
        <div
          className="flex justify-between items-center mb-4"
          id="sidebar-title"
        >
          <h2 className="font-semibold text-lg text-gradient">
            {title || "Sidebar"}
          </h2>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Close sidebar"
            className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            <RxCross2 className="text-xl" />
          </button>
        </div>

        {/* Body */}
        {children}
      </div>
    </div>
  );
};

export default Sidebar;
