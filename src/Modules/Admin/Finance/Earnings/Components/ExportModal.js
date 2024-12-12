import React from "react";

const ExportModal = ({ visible, onClose }) => {
  if (!visible) return null;

  return (
    <div
      className="fixed -top-6 bottom-0 left-0 right-0 flex items-center justify-center bg-black bg-opacity-70 z-[1000]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose(); // Close when clicking outside modal content
      }}
    >
      <div className="bg-white rounded-lg w-[400px] shadow-lg overflow-hidden">
        {/* Top Red Strip */}
        <div className="bg-[#C83B62] h-10 flex items-center justify-between px-4">
          <h3 className="text-white font-bold">Export Options</h3>
          <button
            className="text-white hover:opacity-80 focus:outline-none"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-6">
          <h3 className="text-lg font-bold text-gray-800">
            Export in which type of file?
          </h3>

          {/* Radio Button Options */}
          <div>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="fileType"
                value="pdf"
                className="text-purple-600"
              />
              PDF
            </label>
            <label className="flex items-center gap-2 mt-2">
              <input
                type="radio"
                name="fileType"
                value="excel"
                className="text-purple-600"
              />
              Excel
            </label>
          </div>

          {/* Export Button */}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gradient-to-r from-[#C83B62] to-[#8E44AD] text-white font-bold rounded-md w-full hover:opacity-90 transition"
          >
            Export now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
