// SidebarSlide.jsx
import React, { useCallback, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { RxCross2 } from "react-icons/rx";
import { motion, AnimatePresence } from "framer-motion";

const sidebarVariants = {
  hidden: { x: "100%" },
  visible: { x: 0 },
  exit: { x: "100%" },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const SidebarSlide = ({
  isOpen,
  title,
  onClose,
  children,
  footer,
  width = "33%",
}) => {
  const sidebarRef = useRef(null);

  /* ------------------ focus trap ------------------ */
  const trapFocus = useCallback((e) => {
    if (e.key !== "Tab" || !sidebarRef.current) return;

    const focusables = sidebarRef.current.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (
      e.shiftKey
        ? document.activeElement === first
        : document.activeElement === last
    ) {
      e.preventDefault();
      (e.shiftKey ? last : first).focus();
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    if (isOpen) document.addEventListener("keydown", trapFocus);
    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("keydown", trapFocus);
    };
  }, [isOpen, trapFocus]);

  /* ------------------ render ---------------------- */
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* overlay blur */}
          <motion.div
            className="fixed inset-0 z-40 backdrop-blur-sm bg-black/40"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* sidebar */}
          <motion.aside
            ref={sidebarRef}
            className="fixed right-0 top-0 h-full bg-white z-50 shadow-xl flex flex-col"
            style={{ width }}
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
            role="dialog"
            aria-modal="true"
          >
            {/* header */}
            <header className="flex items-center justify-between px-5 py-3 border-b">
              <h2 className="font-semibold text-lg">{title}</h2>
              <button
                aria-label="Close sidebar"
                onClick={onClose}
                className="text-xl opacity-70 hover:opacity-100 transition"
              >
                <RxCross2 />
              </button>
            </header>

            {/* content */}
            <section className="flex-1 overflow-y-auto p-4">{children}</section>

            {/* footer (optional) */}
            {footer && <footer className="border-t p-4">{footer}</footer>}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

SidebarSlide.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.node,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
  footer: PropTypes.node,
  width: PropTypes.string,
};

export default SidebarSlide;
