import React, { useState } from "react";
import { Modal, Button } from "antd";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";

const truncateFileName = (fileName, maxLength = 20) => {
  if (fileName.length <= maxLength) return fileName;
  const extIndex = fileName.lastIndexOf(".");
  const ext = extIndex !== -1 ? fileName.slice(extIndex) : "";
  const nameWithoutExt = fileName.slice(0, extIndex);
  return nameWithoutExt.slice(0, maxLength - ext.length) + "..." + ext;
};

const FileInput = ({ onChange, file, onClear, title }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="flex flex-col w-full md:w-3/10">
      <label htmlFor="attachment" className="text-gray-500 mb-1">
        {title || "Attachment"}
      </label>
      <div className="flex items-center border border-gray-300 rounded p-2">
        <input
          id="attachment"
          type="file"
          className="hidden"
          onChange={onChange}
        />
        <label
          htmlFor="attachment"
          className="cursor-pointer bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 transition px-4 rounded-full mr-2"
        >
          <span className="text-sm">Choose file</span>
        </label>
        <span className="text-gray-500 flex-1">
          {file ? truncateFileName(file.name) : "No file selected"}
        </span>
        {file && (
          <div className="flex space-x-2">
            <Button type="link" icon={<EyeOutlined />} onClick={showModal} />
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={onClear}
            />
          </div>
        )}
      </div>
      {file && (
        <Modal
          title="File Preview"
          visible={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          footer={[
            <Button key="ok" type="primary" onClick={handleModalOk}>
              OK
            </Button>,
          ]}
        >
          {file.type.startsWith("image/") ? (
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="w-full"
            />
          ) : (
            <p>{file.name}</p>
          )}
        </Modal>
      )}
    </div>
  );
};

export default FileInput;
