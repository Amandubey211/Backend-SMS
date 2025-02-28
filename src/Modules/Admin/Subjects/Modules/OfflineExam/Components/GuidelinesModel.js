// GuidelinesModel.js
import { Modal } from "antd";
import Title from "antd/es/typography/Title";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { FiInfo, FiCheck } from "react-icons/fi";
import { MdFileDownload } from "react-icons/md";

/**
 * Shows different guidelines content based on the activeSegment:
 *   - "manual"
 *   - "excel"
 */
function GuidelinesModel({
  guidelinesModalVisible,
  setGuidelinesModalVisible,
  activeSegment,
}) {
  const renderManualGuidelines = () => (
    <>
      <Title level={4} className="text-purple-800">
        Manual Creation Guidelines
      </Title>
      <ul className="list-none text-gray-700 pl-6 space-y-2 mt-4">
        <li className="flex items-center space-x-2">
          <FiCheck className="text-green-500" />
          <span>Ensure each student's data is accurate.</span>
        </li>
        <li className="flex items-center space-x-2">
          <FiCheck className="text-green-500" />
          <span>Exam Name and Max Score fields are required.</span>
        </li>
        <li className="flex items-center space-x-2">
          <FiCheck className="text-green-500" />
          <span>
            Optional: You can set a start and end date for the exam if
            applicable.
          </span>
        </li>
        <li className="flex items-center space-x-2">
          <FiCheck className="text-green-500" />
          <span>Choose the student sections appropriately.</span>
        </li>
      </ul>
    </>
  );

  const renderExcelGuidelines = () => (
    <>
      <Title level={4} className="text-purple-800">
        Excel Upload Guidelines
      </Title>
      <ul className="list-none text-gray-700 pl-6 space-y-2 mt-4">
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
          <span>Download the sample format below if needed.</span>
        </li>
        <li className="flex items-center space-x-2">
          <FiCheck className="text-green-500" />
          <span>Edit the sample Excel before uploading.</span>
        </li>
        <li className="flex items-center space-x-2">
          <FiCheck className="text-green-500" />
          <span>Click "Select File" then press "Create" to submit.</span>
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
    </>
  );

  return (
    <Modal
      open={guidelinesModalVisible}
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
            </div>

            {/* Conditionally Render Guidelines */}
            {activeSegment === "manual"
              ? renderManualGuidelines()
              : renderExcelGuidelines()}
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}

export default GuidelinesModel;
