import React, { useRef, useState } from "react";
import ProtectedAction from "../../../../../../Routes/ProtectedRoutes/ProtectedAction";
import { RiAddFill } from "react-icons/ri";
import { Tooltip } from "antd";
import Sidebar from "../../../../../../Components/Common/Sidebar";
import HandsontableComp from "./HandsontableComp";
import { MdFileDownload, MdFileUpload } from "react-icons/md";
import { useDispatch } from "react-redux";
import { UploadOfflineExamSheet } from "../../../../../../Store/Slices/Admin/Class/OfflineExam/oflineExam.action";
import { useNavigate, useParams } from "react-router-dom";
import * as XLSX from "xlsx";

function CreateButton() {
  const { cid, sid } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]); // State to store extracted data

  // Trigger File Input
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Handle file selection and read Excel
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setFileName(selectedFile.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      // Read first sheet
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      setTableData(jsonData); // Update state for Handsontable
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  // Upload API call
  const handleData = () => {
    if (!file) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("sheet", file);
    formData.append("classId", cid);
    formData.append("subjectId", sid);
    formData.append("semesterId", "67a3039135d291aa1f224a89");

    dispatch(UploadOfflineExamSheet(formData));
    navigate(-1);
  };

  return (
    <ProtectedAction>
      <Tooltip title="Create Offline Exam" placement="left">
        <button
          className="bg-gradient-to-r from-purple-400 to-pink-400 text-white p-4 fixed rounded-full shadow-md bottom-4 right-4 transform transition-transform duration-300 hover:scale-110"
          aria-label="Add Offline Exam"
          onClick={() => setIsOpen(true)}
        >
          <RiAddFill size={24} />
          <span className="absolute bottom-14 right-1/2 transform translate-x-1/2 bg-black text-white text-sm p-2 rounded opacity-0 transition-opacity duration-300 hover:opacity-100 pointer-events-none">
            Add Offline Exam
          </span>
        </button>
      </Tooltip>

      {isOpen && (
        <Sidebar
          isOpen={isOpen}
          title={"Create Offline Exam"}
          onClose={() => setIsOpen(false)}
          width={"95%"}
        >
          <div>
            <div className="flex justify-end mr-5">
              {/* Create Manually Button */}
              <div className="pl-5 pt-1">
                <button
                  onClick={() => {}}
                  className="flex justify-center items-center mt-2 gap-x-2 px-4 py-2 w-full rounded-md bg-gradient-to-r from-pink-100 to-purple-200"
                >
                  <span className="text-gradient">Create Manually</span>
                </button>
              </div>

              {/* Upload Excel Button */}
              <div className="pl-5 pt-1">
                <button
                  onClick={handleUploadClick}
                  className="flex justify-center items-center mt-2 gap-x-2 px-4 py-2 w-full rounded-md bg-gradient-to-r from-pink-100 to-purple-200"
                >
                  <MdFileUpload className="text-lg text-gray-600" />
                  <span className="text-gradient">Upload Excel</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".xls,.xlsx"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {/* Show uploaded file name */}
                {fileName && (
                  <p className="text-sm text-gray-600 mt-1">{fileName}</p>
                )}
              </div>

              {/* Sample Excel Download Button */}
              <div className="pl-5 pt-1">
                <a
                  href="/createOfflineExamSample.xlsx"
                  download="createOfflineExamSample.xlsx"
                  className="flex justify-center items-center mt-2 gap-x-2 px-4 py-2 w-full rounded-md bg-gradient-to-r from-pink-100 to-purple-200"
                >
                  <MdFileDownload className="text-lg text-gray-600" />
                  <span className="text-gradient">Sample Excel</span>
                </a>
              </div>
            </div>

            {/* Handsontable Component */}

            {/* <div className="flex-1 overflow-hidden p-4 bg-white shadow-md border rounded-md"> */}
            <HandsontableComp data={tableData} />
            {/* </div> */}
            <div className="flex w-[20%] gap-x-2 mt-5 items-end fixed bottom-5 right-5">
              <button
                onClick={() => {}}
                className="w-[50%] bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
              >
                Clear
              </button>
              <button
                onClick={handleData}
                className="w-[50%] bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
              >
                Create
              </button>
            </div>
          </div>
        </Sidebar>
      )}
    </ProtectedAction>
  );
}
export default CreateButton;
