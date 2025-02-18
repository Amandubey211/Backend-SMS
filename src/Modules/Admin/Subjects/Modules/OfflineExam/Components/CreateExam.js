import React, { useRef, useState } from "react";
import ProtectedAction from "../../../../../../Routes/ProtectedRoutes/ProtectedAction";
import { RiAddFill } from "react-icons/ri";
import { Button, Modal, Tooltip, Typography } from "antd";
import Sidebar from "../../../../../../Components/Common/Sidebar";
import { MdAddChart, MdFileDownload, MdFileUpload } from "react-icons/md";
import { useDispatch } from "react-redux";
import { UploadOfflineExamSheet } from "../../../../../../Store/Slices/Admin/Class/OfflineExam/oflineExam.action";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { PERMISSIONS } from "../../../../../../config/permission";
import CreateManually from "./CreateManually";
import UploadExcel from "./UploadExcel";
import { FiCheck, FiInfo } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

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
  const [guidelinesModalVisible, setGuidelinesModalVisible] = useState(false);

  const { t } = useTranslation("admClass");
  const { Title } = Typography;
  const pinkColor = "#EC407A";
  const purpleColor = "#AB47BC";
  const primaryGradient = `linear-gradient(to right, ${pinkColor}, ${purpleColor})`;

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

      dispatch(
        UploadOfflineExamSheet({ formData: formData, cid: cid, sid: sid })
      )
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
                    className="ml-2 focus:outline-none mt-2"
                    aria-label="Upload Excel Guidelines"
                  >
                    <FiInfo className="text-blue-500 text-2xl" />
                  </button>
                </Tooltip>
              </ProtectedAction>
            </div>

            {/* Guidelines Modal */}
            <Modal
              visible={guidelinesModalVisible}
              onCancel={() => setGuidelinesModalVisible(false)}
              footer={null}
              width={550}
              className="rounded-xl shadow-lg"
            >
              <AnimatePresence>
                {guidelinesModalVisible && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col p-6"
                  >
                    {/* Header with Icon */}
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="bg-purple-100 p-3 rounded-full">
                        <FiInfo className="text-purple-600 text-4xl" />
                      </div>
                      <Title level={3} className="text-purple-800">
                        Sample Upload Instructions
                      </Title>
                    </div>

                    {/* Left-Aligned Guidelines */}
                    <ul className="list-none text-gray-700 pl-6 space-y-2">
                      <li className="flex items-center space-x-2">
                        <FiCheck className="text-green-500" />
                        <span>Only .xlsx or .xls files are supported.</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <FiCheck className="text-green-500" />
                        <span>Maximum file size allowed: 5MB.</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <FiCheck className="text-green-500" />
                        <span>
                          Download Template – Use the Sample Excel format.
                        </span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <FiCheck className="text-green-500" />
                        <span>Edit the Sample Excel and Save.</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <FiCheck className="text-green-500" />
                        <span>
                          Click on Upload Excel and select the file to upload.
                        </span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <FiCheck className="text-green-500" />
                        <span>Ready to upload? Click the "Create" button.</span>
                      </li>
                    </ul>

                    <div className="flex justify-end mt-6">
                      <a
                        href="/createOfflineExamSample.xlsx"
                        download="createOfflineExamSample.xlsx"
                        className="flex justify-center items-center mt-2 gap-x-2 px-4 py-2 rounded-md bg-gradient-to-r from-pink-100 to-purple-200"
                      >
                        <MdFileDownload className="text-lg text-gray-600" />
                        <span className="text-gradient">Sample Excel</span>
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Modal>

            {/* Handsontable Component */}
            {!showManual
              ? fileName && (
                  <p className="text-sm text-red-600 mt-1">{fileName}</p>
                )
              : ""}
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
export default CreateExam;
