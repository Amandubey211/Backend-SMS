import React, { useRef, useState } from "react";
import ProtectedAction from "../../../../../../Routes/ProtectedRoutes/ProtectedAction";
import { RiAddFill } from "react-icons/ri";
import { Tooltip } from "antd";
import Sidebar from "../../../../../../Components/Common/Sidebar";
import { MdAddChart, MdFileUpload } from "react-icons/md";
import { useDispatch } from "react-redux";
import { UploadOfflineExamSheet } from "../../../../../../Store/Slices/Admin/Class/OfflineExam/oflineExam.action";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { PERMISSIONS } from "../../../../../../config/permission";
import CreateManually from "./CreateManually";
import UploadExcel from "./UploadExcel";
import { FiInfo } from "react-icons/fi";
import GuidelinesModel from "./GuidelinesModel";

function CreateExam() {
  const { cid, sid } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState([]);
  const [showManual, setShowManual] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [guidelinesModalVisible, setGuidelinesModalVisible] = useState(false);

  const pinkColor = "#EC407A";
  const purpleColor = "#AB47BC";
  const primaryGradient = `linear-gradient(to right, ${pinkColor}, ${purpleColor})`;

  const handleUploadClick = () => {
    setShowManual(false);
    fileInputRef.current.click();
  };

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

  const handleCreateExam = () => {
    if (!file) {
      console.error("No file selected");
      return;
    }
    const formData = new FormData();
    formData.append("sheet", file);
    formData.append("classId", cid);
    formData.append("subjectId", sid);

    if (formData) {
      setIsCreateLoading(true);
      dispatch(
        UploadOfflineExamSheet({ formData: formData, cid: cid, sid: sid })
      );
      setIsCreateLoading(false);
    }
  };

  return (
    <ProtectedAction requiredPermission={PERMISSIONS.ADD_OFFLINE_EXAM}>
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
              setTableData([]);
              setFile(null);
              setIsOpen(false);
            }
          }}
          width={"100%"}
        >
          <div>
            <div className="flex justify-end mr-5">
              {/* Create Manually Button */}
              <div className="pl-5 pt-1">
                <button
                  style={{
                    background: primaryGradient,
                    border: "none",
                    color: "white",
                  }}
                  onClick={() => setShowManual(true)}
                  className="flex justify-center items-center mt-2 gap-x-2 px-4 py-2 w-full rounded-md"
                >
                  <MdAddChart className="text-lg text-white" />
                  <span className="text-white">Create Manually</span>
                </button>
              </div>
              <ProtectedAction
                requiredPermission={PERMISSIONS.UPLOAD_EXCEL_OFFLINE}
              >
                {/* Upload Excel Button */}
                <div className="pl-5 pt-1">
                  <button
                    style={{
                      background: primaryGradient,
                      border: "none",
                      color: "white",
                    }}
                    onClick={handleUploadClick}
                    className="flex justify-center  items-center mt-2 gap-x-2 px-4 py-2 w-full rounded-md "
                  >
                    <MdFileUpload className="text-lg text-white" />
                    <span className="text-white">Upload Excel</span>
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
                <Tooltip title="View Upload Excel Guidelines">
                  <button
                    onClick={() => setGuidelinesModalVisible(true)}
                    className="ml-2 focus:outline-none mt-3"
                    aria-label="Upload Excel Guidelines"
                  >
                    <FiInfo className="text-blue-500 text-xl" />
                  </button>
                </Tooltip>
              </ProtectedAction>
            </div>

            {/* Guidelines Modal */}
            <GuidelinesModel
              guidelinesModalVisible={guidelinesModalVisible}
              setGuidelinesModalVisible={setGuidelinesModalVisible}
            />
            {!showManual && tableData.length > 0 && fileName && (
              <p className="text-sm text-red-600 mt-1">{fileName}</p>
            )}
            {showManual ? (
              <CreateManually
                setIsOpen={setIsOpen}
                setLoading={setLoading}
                loading={loading}
                isOpen={isOpen}
              />
            ) : (
              <UploadExcel
                data={tableData}
                handleCreateExam={handleCreateExam}
                isCreateLoading={isCreateLoading}
                setIsCreateLoading={setIsCreateLoading}
                setIsOpen={setIsOpen}
                file={file}
                  setFile={setFile}
                  setData= {setTableData}
              />
            )}
          </div>
        </Sidebar>
      )}
    </ProtectedAction>
  );
}
export default CreateExam;
