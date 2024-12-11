import React from "react";

const ExportModal = ({ visible, onClose }) => {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-[400px] space-y-4">
        <h3 className="text-lg font-bold">Export in which type of file?</h3>
        <div>
          <label className="flex items-center gap-2">
            <input type="radio" name="fileType" value="pdf" className="text-purple-600" />
            PDF
          </label>
          <label className="flex items-center gap-2 mt-2">
            <input type="radio" name="fileType" value="excel" className="text-purple-600" />
            Excel
          </label>
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-md w-full"
        >
          Export now
        </button>
      </div>
    </div>
  );
};

export default ExportModal;
