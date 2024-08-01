import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";
import { RiCloseLine } from "react-icons/ri";
import { FaSpinner } from "react-icons/fa";

const LogoutConfirmationModal = ({ isOpen, onClose, onConfirm, loading }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const trapFocus = (e) => {
        if (e.key === "Tab") {
          if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            // Tab
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
        if (e.key === "Escape") {
          onClose();
        }
      };

      document.addEventListener("keydown", trapFocus);
      firstElement.focus();

      return () => {
        document.removeEventListener("keydown", trapFocus);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOutsideClick = (e) => {
    if (e.target.id === "logout-modal-container") {
      onClose();
    }
  };

  return createPortal(
    <div
      id="logout-modal-container"
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={handleOutsideClick}
      aria-labelledby="logout-modal-title"
      aria-describedby="logout-modal-description"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 w-11/12 md:w-1/3"
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 id="logout-modal-title" className="text-lg font-semibold">
            Confirm Logout
          </h3>
          <button onClick={onClose} aria-label="Close modal">
            <RiCloseLine className="text-gray-700 w-6 h-6" />
          </button>
        </div>
        <div className="p-4">
          <p id="logout-modal-description">Are you sure you want to logout?</p>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              id="cancel-button"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
              onClick={onClose}
              aria-label="Cancel"
            >
              Cancel
            </button>
            <button
              id="confirm-logout-button"
              className="px-4 py-2 bg-red-500 text-white rounded-md flex items-center"
              onClick={onConfirm}
              aria-label="Confirm Logout"
            >
              {loading ? <FaSpinner className="animate-spin mr-2" /> : "Logout"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

LogoutConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

LogoutConfirmationModal.defaultProps = {
  loading: false,
};

export default LogoutConfirmationModal;
