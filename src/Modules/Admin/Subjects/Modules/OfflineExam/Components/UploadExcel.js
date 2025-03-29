import React, { useEffect, useRef, useState } from "react";
import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.css";
import { Button, Switch, DatePicker, Tooltip } from "antd";
import { MdFileUpload } from "react-icons/md";
import { UploadOfflineExamSheet } from "../../../../../../Store/Slices/Admin/Class/OfflineExam/oflineExam.action";
import * as XLSX from "xlsx";

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

  // Ref for hidden file input
  const fileInputRef = useRef(null);

  // New exam-level fields for results publishing
  const [resultsPublished, setResultsPublished] = useState(false);
  const [resultsPublishDate, setResultsPublishDate] = useState(null);

  // Read and parse the Excel file
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileData = new Uint8Array(e.target.result);
      const workbook = XLSX.read(fileData, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      setData(jsonData);
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  // Initialize Handsontable instance on data change
  useEffect(() => {
    const headers =
      data.length > 0
        ? data[0]
        : ["Name", "AdmissionNumber", "Quiz1", "Exam1", "Quiz2", "Exam2"];
    const formattedData =
      data.length > 1 ? data.slice(1) : [["", "", "", "", "", ""]];
    if (hotInstanceRef.current) {
      hotInstanceRef.current.updateSettings({
        data: formattedData,
        colHeaders: headers,
        readOnly: true,
        columns: headers.map(() => ({ readOnly: true })),
      });
    } else {
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

  // Create exam by dispatching the thunk
  const handleCreateExam = () => {
    if (!file) {
      console.error("No file selected");
      return;
    }
    const formData = new FormData();
    formData.append("sheet", file);
    formData.append("classId", cid);
    formData.append("subjectId", sid);

    // Append new results publishing fields to formData
    formData.append("resultsPublished", resultsPublished);
    formData.append(
      "resultsPublishDate",
      resultsPublishDate ? resultsPublishDate.toISOString() : null
    );

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

  // Trigger the hidden file input
  const triggerFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full p-4 bg-white border shadow-md mt-2">
      {/* File Upload Section */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
            style={{ display: "none" }}
          />
        </div>
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

      {/* Exam-Level Results Publishing Options */}
      <div className="mb-4 flex flex-wrap items-center justify-between p-4 bg-gray-50 rounded-md shadow-sm gap-4">
        <div className="flex items-center gap-2">
          <Tooltip title="Toggle to publish results immediately">
            <span className="font-semibold text-gray-700">
              Publish Results Immediately
            </span>
          </Tooltip>
          <Switch
            checked={resultsPublished}
            onChange={(checked) => setResultsPublished(checked)}
          />
        </div>
        <div className="flex flex-col">
          <Tooltip title="Set a scheduled publish date for exam results">
            <label className="font-semibold text-gray-700 mb-1">
              Results Publish Date
            </label>
          </Tooltip>
          <DatePicker
            value={resultsPublishDate}
            onChange={(date) => setResultsPublishDate(date)}
            disabled={resultsPublished}
            style={{ width: 220 }}
          />
        </div>
      </div>

      {/* Handsontable Preview */}
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
