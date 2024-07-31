import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";
import { RiCloseLine } from "react-icons/ri";

const DeleteModal = ({ isOpen, onClose, onConfirm, title }) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setInputValue("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-container") {
      onClose();
    }
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleConfirm = () => {
    onConfirm();
    setInputValue("");
  };

  const isMatching = inputValue.toLowerCase() === title.toLowerCase();

  return createPortal(
    <div
      id="modal-container"
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={handleOutsideClick}
    >
      <div className="bg-white rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 w-11/12 md:w-1/3">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Delete {title}</h3>
          <button onClick={onClose}>
            <RiCloseLine className="text-gray-700 w-6 h-6" />
          </button>
        </div>
        <div className="p-4">
          <p>
            Type the name <strong className="text-red-400">{title}</strong> to
            confirm deletion:
          </p>
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            className="mt-2 p-2 border rounded w-full"
            placeholder={`Type "${title}"`}
          />
          <div className="mt-4 flex justify-end space-x-2">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                isMatching
                  ? "bg-red-500 text-white cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              onClick={isMatching ? handleConfirm : null}
              disabled={!isMatching}
            >
              Delete
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
