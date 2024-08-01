import React, { useEffect } from "react";
import { IoClose } from "react-icons/io5";

const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={onClose}
      ></div>
      <div
        className={`bg-white rounded-lg overflow-hidden shadow-xl transform transition-transform duration-300 max-w-lg w-full p-6 ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <button
          onClick={onClose}
          className="float-right text-black dark:text-white focus:outline-none"
          aria-label="Close modal"
        >
          <IoClose className="text-2xl" />
        </button>
        <div className="mt-2" id="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
