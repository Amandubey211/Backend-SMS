// src/Modules/Admin/Finance/Receipts/ExportNewModal.js

import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";

// Helper function to format a date string into a human-friendly format.
const formatDateTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return date.toLocaleString("en-GB", options);
};

// Dynamically transform a value based on its type and key.
const transformValue = (value, key) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") {
    // If the object has an 'invoiceNumber' property, use it.
    if (value.invoiceNumber) return value.invoiceNumber;
    // Otherwise, safely stringify the object.
    return JSON.stringify(value);
  }
  // If the key suggests a date field, format it.
  if (typeof value === "string" && key.toLowerCase().includes("date")) {
    return formatDateTime(value);
  }
  return value.toString();
};

// Transform each row in the data array dynamically.
const transformDataForExport = (data) => {
  return data.map((row) => {
    const newRow = {};
    Object.keys(row).forEach((key) => {
      newRow[key] = transformValue(row[key], key);
    });
    return newRow;
  });
};

const ExportNewModal = ({ visible, onClose, dataToExport, title, sheet }) => {
  const [fileType, setFileType] = useState("");
  const { schoolName } = useSelector((store) => store.common.user.userDetails || {});

  if (!visible) return null;

  const handleExport = () => {
    const transformedData = transformDataForExport(dataToExport);
    if (!transformedData.length) {
      return alert("No data available to export");
    }

    if (fileType === "excel") {
      // Export as Excel using XLSX.
      const worksheet = XLSX.utils.json_to_sheet(transformedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, sheet || "sheet1");
      XLSX.writeFile(workbook, `${title}.xlsx`);
    } else if (fileType === "pdf") {
      // Export as PDF using jsPDF autoTable.
      const doc = new jsPDF();
      // Dynamically compute column headers from the keys of the first row.
      const keys = Object.keys(transformedData[0]);
      const columns = keys.map((key) => ({
        header: key,
        dataKey: key,
      }));
      doc.autoTable({
        columns,
        body: transformedData,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [52, 58, 64] },
      });
      doc.save(`${title}.pdf`);
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
            onClick={handleExport}
            className="px-4 py-2 bg-gradient-to-r from-[#C83B62] to-[#8E44AD] text-white font-bold rounded-md w-full hover:opacity-90 transition"
          >
            Export now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportNewModal;
