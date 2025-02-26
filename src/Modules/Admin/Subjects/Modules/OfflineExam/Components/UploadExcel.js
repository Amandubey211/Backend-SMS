import React, { useEffect, useRef, useState } from "react";
import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.css";
import { Button } from "antd";
import { UploadOfflineExamSheet } from "../../../../../../Store/Slices/Admin/Class/OfflineExam/oflineExam.action";
import * as XLSX from "xlsx";
// Optional Icon
import { MdFileUpload } from "react-icons/md";

const UploadExcel = ({
  isOpen,
  setIsOpen,
  cid,
  sid,
  dispatch,
  primaryGradient,
}) => {
  const hotRef = useRef(null);
  const hotInstanceRef = useRef(null);

  // State for file upload
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [isCreateLoading, setIsCreateLoading] = useState(false);

  // We store a ref to the hidden file input so we can programmatically click it
  const fileInputRef = useRef(null);

  // Read/parse the Excel file
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      const fileData = new Uint8Array(e.target.result);
      const workbook = XLSX.read(fileData, { type: "array" });

      // Read the first sheet
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      setData(jsonData);
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  // Initialize Handsontable after data changes
  useEffect(() => {
    const headers =
      data.length > 0
        ? data[0]
        : ["Name", "AdmissionNumber", "Quiz1", "Exam1", "Quiz2", "Exam2"];

    const formattedData =
      data.length > 1 ? data.slice(1) : [["", "", "", "", "", ""]];

    if (hotInstanceRef.current) {
      // Update existing Handsontable instance
      hotInstanceRef.current.updateSettings({
        data: formattedData,
        colHeaders: headers,
        readOnly: true,
        columns: headers.map(() => ({ readOnly: true })),
      });
    } else {
      // Create a new Handsontable instance
      hotInstanceRef.current = new Handsontable(hotRef.current, {
        data: formattedData,
        colHeaders: headers,
        rowHeaders: true,
        width: "100%",
        height: "auto",
        stretchH: "all",
        contextMenu: true,
        readOnly: true,
        licenseKey: "non-commercial-and-evaluation",
        columns: headers.map(() => ({ readOnly: true })),
        className: "handsontable",
      });
    }

    return () => {
      if (hotInstanceRef.current) {
        hotInstanceRef.current.destroy();
        hotInstanceRef.current = null;
      }
    };
  }, [data]);

  // Dispatch action to create exam from Excel
  const handleCreateExam = () => {
    if (!file) {
      console.error("No file selected");
      return;
    }
    const formData = new FormData();
    formData.append("sheet", file);
    formData.append("classId", cid);
    formData.append("subjectId", sid);

    setIsCreateLoading(true);
    dispatch(UploadOfflineExamSheet({ formData, cid, sid }))
      .then(() => {
        setIsCreateLoading(false);
        setIsOpen(false);
      })
      .catch(() => {
        setIsCreateLoading(false);
      });
  };

  const handleCancel = () => {
    setFile(null);
    setData([]);
    setIsOpen(false);
  };

  /**
   * Triggers the hidden <input type="file"/> click event
   * when the user clicks the "Select File" or "Replace File" button.
   */
  const triggerFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full p-4 bg-white border shadow-md mt-2">
      {/* File Upload Section */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Stylized Button to trigger hidden input */}
        <div>
          <Button
            type="primary"
            icon={<MdFileUpload className="text-base" />}
            style={{
              background: primaryGradient,
              color: "white",
              border: "none",
            }}
            onClick={triggerFileDialog}
          >
            {file ? "Replace File" : "Select File"}
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xls,.xlsx"
            onChange={handleFileChange}
            style={{ display: "none" }} // Hidden native file input
          />
        </div>

        {/* Display Selected File Name */}
        <div>
          {file ? (
            <p className="text-sm text-gray-700">
              <strong>Selected File:</strong> {file.name}
            </p>
          ) : (
            <p className="text-sm text-gray-400">No file selected</p>
          )}
        </div>
      </div>

      {/* Handsontable preview area */}
      <div
        ref={hotRef}
        className="h-full w-full border rounded-sm shadow-sm bg-gray-50 overflow-x-scroll handsontable"
        style={{ minHeight: "300px" }}
      ></div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 items-end fixed bottom-5 right-5">
        <Button onClick={handleCancel}>Cancel</Button>
        <Button
          disabled={!file}
          loading={isCreateLoading}
          htmlType="submit"
          onClick={handleCreateExam}
          style={{
            background: primaryGradient,
            color: "white",
            border: "none",
          }}
        >
          Create
        </Button>
      </div>
    </div>
  );
};

export default UploadExcel;
