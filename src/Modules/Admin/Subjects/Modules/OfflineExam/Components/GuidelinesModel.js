import { Modal } from "antd";
import Title from "antd/es/typography/Title";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { FiCheck, FiInfo } from "react-icons/fi";
import { MdFileDownload } from "react-icons/md";

function GuidelinesModel({
  guidelinesModalVisible,
  setGuidelinesModalVisible,
}) {
  return (
    <div>
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
                  <span>Download Template – Use the Sample Excel format.</span>
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
    </div>
  );
}

export default GuidelinesModel;
