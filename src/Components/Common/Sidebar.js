import React, { useEffect, useRef, useCallback } from "react";
import { RxCross2 } from "react-icons/rx";

/**
 * Sliding sidebar / drawer
 * – Focus-trap, click-outside, Esc handling
 * – Sticky header + auto-focus on the *first* interactive element
 *   *inside the drawer body* instead of the header’s close button.
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

  /* ---------------- focus helpers ---------------- */
  const focusFirstBodyElement = () => {
    if (!sidebarRef.current) return false;

    // Collect all focusables inside the sidebar
    const all = sidebarRef.current.querySelectorAll(
      'a,button,textarea,input,select,[tabindex]:not([tabindex="-1"])'
    );

    // Skip the close button
    for (const el of all) {
      if (el !== closeBtnRef.current && !el.disabled) {
        el.focus();
        return true;
      }
    }
    // Fallback to close button if nothing else is focusable yet
    closeBtnRef.current?.focus();
    return !!closeBtnRef.current;
  };

  /* retry for 500 ms so dynamically loaded inputs are ready */
  const tryFocusLoop = () => {
    let n = 0;
    const id = setInterval(() => {
      if (focusFirstBodyElement() || n > 10) clearInterval(id);
      n += 1;
    }, 50);
  };

  /* ---------------- keyboard handlers ---------------- */
  const trapFocus = useCallback((e) => {
    if (e.key !== "Tab" || !sidebarRef.current) return;

    const nodes = sidebarRef.current.querySelectorAll(
      'a,button,textarea,input,select,[tabindex]:not([tabindex="-1"])'
    );
    if (!nodes.length) return e.preventDefault();

    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (
      e.shiftKey
        ? document.activeElement === first
        : document.activeElement === last
    ) {
      e.preventDefault();
      (e.shiftKey ? last : first).focus();
    }
  }, []);

  const escHandler = useCallback(
    (e) => e.key === "Escape" && onClose(),
    [onClose]
  );

  /* ---------------- click-outside ---------------- */
  const clickOutside = useCallback(
    (e) => {
      const defaultIgnore = [
        ".ant-picker-dropdown",
        ".ant-select-dropdown",
        ".ant-modal",
        ".ant-modal-mask",
      ];
      const ignore = [...defaultIgnore, ...ignoreClickOutsideSelectors];
      const shouldIgnore =
        ignore.some((sel) => e.target.closest(sel)) ||
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

  /* ---------------- lifecycle ---------------- */
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", clickOutside);
      document.addEventListener("keydown", trapFocus);
      document.addEventListener("keydown", escHandler);
      tryFocusLoop();
    }
    return () => {
      document.removeEventListener("mousedown", clickOutside);
      document.removeEventListener("keydown", trapFocus);
      document.removeEventListener("keydown", escHandler);
    };
  }, [isOpen, clickOutside, trapFocus, escHandler]);

  /* ---------------- render ---------------- */
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
        aria-hidden="true"
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
      />

      <div
        ref={sidebarRef}
        style={{
          width: typeof width === "number" ? `${width}px` : width,
          maxWidth: "100vw",
        }}
        className={`absolute top-0 right-0 h-full overflow-y-auto bg-white shadow-lg transform transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ───────── Sticky Header ───────── */}
        <header
          id="sidebar-title"
          className="sticky top-0 z-10 flex justify-between items-center px-4 py-3 bg-white border-b border-gray-200"
        >
          <h2 className="font-semibold text-lg text-gradient">{title}</h2>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Close sidebar"
            className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            <RxCross2 className="text-xl" />
          </button>
        </header>

        {/* Drawer body */}
        <div className="px-4 py-3">{children}</div>
      </div>
    </div>
  );
};

export default Sidebar;
