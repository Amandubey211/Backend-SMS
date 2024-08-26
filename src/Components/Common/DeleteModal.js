import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";
import { RiCloseLine } from "react-icons/ri";
import { ImSpinner3 } from "react-icons/im";

const DeleteModal = ({ isOpen, onClose, onConfirm, title }) => {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const confirmButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const focusableSelectors = [
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "textarea:not([disabled])",
      "select:not([disabled])",
      "details",
      "[tabindex]:not([tabindex='-1'])",
    ];

    const focusableElements = modalRef.current.querySelectorAll(
      focusableSelectors.join(", ")
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e) => {
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
    };

    closeButtonRef.current.focus();

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setInputValue("");
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-container") {
      e.stopPropagation(); // Prevent modal close from triggering other events
      onClose();
    }
  };

  const handleInsideClick = (e) => {
    e.stopPropagation(); // Prevent click event from propagating to parent elements
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      setInputValue("");
      setLoading(false);
      onClose();
    } catch (err) {
      setError("Error deleting item. Please try again.");
      setLoading(false);
    }
  };

  const isMatching = inputValue.toLowerCase() === title.toLowerCase();

  return createPortal(
    <div
      id="modal-container"
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={handleOutsideClick}
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 w-11/12 md:w-1/3"
        onClick={handleInsideClick} // Stop propagation of clicks inside the modal
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 id="delete-modal-title" className="text-lg font-semibold">
            Delete {title}
          </h3>
          <button
            ref={closeButtonRef}
            onClick={(e) => {
              e.stopPropagation(); // Ensure the click doesn't propagate
              onClose();
            }}
            aria-label="Close modal"
          >
            <RiCloseLine className="text-gray-700 w-6 h-6" />
          </button>
        </div>
        <div className="p-4">
          <p id="delete-modal-description">
            Type the name{" "}
            <span className="text-red-400 select-none">{title}</span> to confirm
            deletion:
          </p>
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            className="mt-2 p-2 border rounded w-full"
            placeholder={`Type "${title}"`}
            aria-label={`Type "${title}" to confirm`}
          />
          {error && <p className="mt-2 text-red-500">{error}</p>}
          <div className="mt-4 flex justify-end space-x-2">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
              onClick={(e) => {
                e.stopPropagation(); // Ensure the click doesn't propagate
                onClose();
              }}
              aria-label="Cancel"
            >
              Cancel
            </button>
            <button
              ref={confirmButtonRef}
              className={`px-4 py-2 rounded-md flex items-center ${
                isMatching
                  ? "bg-red-500 text-white cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              onClick={isMatching ? handleConfirm : null}
              disabled={!isMatching}
              aria-label="Delete"
            >
              {loading ? (
                <ImSpinner3 className="animate-spin mr-2" />
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

DeleteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default DeleteModal;
