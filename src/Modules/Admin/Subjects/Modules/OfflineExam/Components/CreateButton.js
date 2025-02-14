import React, { useRef, useState } from "react";
import ProtectedAction from "../../../../../../Routes/ProtectedRoutes/ProtectedAction";
import { RiAddFill } from "react-icons/ri";
import { Tooltip } from "antd";
import Sidebar from "../../../../../../Components/Common/Sidebar";
import TableView from "./TableView";
import { MdAddChart, MdFileDownload, MdFileUpload } from "react-icons/md";
import { useDispatch } from "react-redux";
import { UploadOfflineExamSheet } from "../../../../../../Store/Slices/Admin/Class/OfflineExam/oflineExam.action";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import NormalTable from "./NormalTable";
import toast from "react-hot-toast";

function CreateButton() {
  const { cid, sid } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState([]);
  const [showManual, setShowManual] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleUploadClick = () => {
    setShowManual(false);
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

      setTableData(jsonData);
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const handleData = () => {
    if (!file) {
      console.error("No file selected");
      return;
    }
    const formData = new FormData();
    formData.append("sheet", file);
    formData.append("classId", cid);
    formData.append("subjectId", sid);

    if (formData) {
      setLoading(true);

      dispatch(UploadOfflineExamSheet(formData))
        .then(() => {
          setLoading(false);
          toast.success("Exam Uploaded Successfully");
        })
        .catch((error) => {
          setLoading(false);
          toast.error(error.message || "Failed to Upload Exam");
        });
    } else {
      setLoading(false);
      toast.error("Failed to Upload Exam");
    }

    // navigate(-1);
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
          onClose={(event) => {
            if (
              event &&
              event.target &&
              !event.target.closest(".handsontable")
            ) {
              setIsOpen(false);
            }
          }}
          width={"95%"}
        >
          <div>
            <div className="flex justify-end mr-5">
              {/* Create Manually Button */}
              <div className="pl-5 pt-1">
                <button
                  onClick={() => setShowManual(true)}
                  className="flex justify-center items-center mt-2 gap-x-2 px-4 py-2 w-full rounded-md bg-gradient-to-r from-pink-100 to-purple-200"
                >
                  <MdAddChart className="text-lg text-gray-600" />
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
            {!showManual
              ? fileName && (
                  <p className="text-sm text-red-600 mt-1">{fileName}</p>
                )
              : ""}
            {showManual ? (
              <NormalTable
                setIsOpen={setIsOpen}
                setLoading={setLoading}
                loading={loading}
                isOpen={isOpen}
              />
            ) : (
              <TableView
                data={tableData}
                handleData={handleData}
                loading={loading}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
              />
            )}
          </div>
        </Sidebar>
      )}
    </ProtectedAction>
  );
}
export default CreateButton;
