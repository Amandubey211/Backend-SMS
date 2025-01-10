import React, { useState } from "react";
import { ExportExcel, ExportPDF } from "../../../../../Utils/xl";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const ExportModal = ({ visible, onClose, dataToExport, title, sheet }) => {
  const [fileType, setFileType] = useState("");
  const { schoolName } = useSelector((store) => store.common.user.userDetails);
  if (!visible) return null;

  const handleExport = (
    dataToExport = [{ name: "N/A" }],
    title = "ExportedData",
    sheet = "sheet1"
  ) => {
    if (!dataToExport.length) {
      return alert("No data available to export");
    }

    if (fileType === "excel") {
      ExportExcel(dataToExport, `${title}.xlsx`, sheet);
    } else if (fileType === "pdf") {
      ExportPDF(dataToExport, `${title}.pdf`, schoolName);
    } else {
      alert("Please select a file type to export.");
    }
  };

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
                onChange={(e) => setFileType(e.target.value)}
              />
              PDF
            </label>
            <label className="flex items-center gap-2 mt-2">
              <input
                type="radio"
                name="fileType"
                value="excel"
                className="text-purple-600"
                onChange={(e) => setFileType(e.target.value)}
              />
              Excel
            </label>
          </div>

          {/* Export Button */}
          <button
            onClick={() => handleExport(dataToExport, title, sheet)}
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
