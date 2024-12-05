import React from "react";

const SuccessPrompt = ({ isVisible, message, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-80 p-6 flex flex-col items-center shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
        {/* Centered GIF */}
        <div className="w-28 h-28 mb-4 flex justify-center items-center">
          <img
            src="success.gif" // Replace with the actual path of your success GIF
            alt="Success"
            className="w-full h-full object-contain"
          />
        </div>
        {/* Success Message */}
        <p className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
          {message}
        </p>
      </div>
    </div>
  );
};

export default SuccessPrompt;
