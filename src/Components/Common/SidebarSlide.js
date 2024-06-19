import React, { useEffect, useRef } from "react";
import { RxCross2 } from "react-icons/rx";

const SidebarSlide = ({ isOpen, title, onClose, children, footer, width, height }) => {
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed inset-0 z-30 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="fixed inset-0 bg-black bg-opacity-50"></div>
      <div
        ref={sidebarRef}
        style={{ width: width || '33%', height: height || '100%' }}
        className={`fixed top-0 right-0 py-3 px-4 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300`}
      >
        <div className="flex justify-between items-center px-2">
          <h1 className="font-semibold">{title || "Please give title"}</h1>
          <button onClick={onClose} className="p-1 m-1 opacity-70">
            <RxCross2 className="text-xl" />
          </button>
        </div>
        <div className="mt-4">
          {children}
        </div>
        {footer && <div className="mt-4">{footer}</div>}
      </div>
    </div>
  );
};

export default SidebarSlide;
