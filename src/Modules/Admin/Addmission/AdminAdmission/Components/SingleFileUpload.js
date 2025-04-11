import React, { useState, useEffect } from "react";
import { Upload, Button, Form, Space, message, Modal, Tooltip } from "antd";
import {
  UploadOutlined,
  EyeOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useField } from "formik";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const MAX_FILENAME_LENGTH = 20;
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const SingleFileUpload = ({ label, name }) => {
  const [field, meta, helpers] = useField(name);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [previewFileType, setPreviewFileType] = useState(null);

  useEffect(() => {
    return () => {
      if (previewUrl && previewFileType === "pdf") {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, previewFileType]);

  const truncateFilename = (name) => {
    if (name.length > MAX_FILENAME_LENGTH) {
      const extensionIndex = name.lastIndexOf(".");
      const extension =
        extensionIndex !== -1 ? name.substring(extensionIndex) : "";
      const basename = name.substring(
        0,
        extensionIndex !== -1 ? extensionIndex : name.length
      );
      const truncatedBasename = `${basename.substring(
        0,
        MAX_FILENAME_LENGTH - extension.length - 3
      )}...`;
      return `${truncatedBasename}${extension}`;
    }
    return name;
  };

  const validateFile = (file) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      message.error("You can only upload JPG/PNG/GIF images or PDF files!");
      return false;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      message.error(`File size must be less than ${MAX_FILE_SIZE_MB}MB`);
      return false;
    }
    return true;
  };

  const handleUploadChange = async (info) => {
    if (info.file.status === "removed") {
      helpers.setValue(null);
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }
    const fileObj = info.file.originFileObj || info.file;
    if (!fileObj) return;
    if (!validateFile(fileObj)) {
      return Upload.LIST_IGNORE;
    }
    let preview = null;
    let fileType = "";
    if (fileObj.type.startsWith("image/")) {
      preview = await getBase64(fileObj);
      fileType = "image";
    } else if (fileObj.type.includes("pdf")) {
      preview = URL.createObjectURL(fileObj);
      fileType = "pdf";
    }
    // Store as an object with file and preview
    helpers.setValue({ file: fileObj, preview });
    setSelectedFile(fileObj);
    setPreviewUrl(preview);
    setPreviewFileType(fileType);
  };

  const handlePreviewCustom = async () => {
    if (!previewUrl && selectedFile) {
      if (selectedFile.type.startsWith("image/")) {
        const base64 = await getBase64(selectedFile);
        setPreviewUrl(base64);
        setPreviewFileType("image");
      } else if (selectedFile.type.includes("pdf")) {
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreviewUrl(objectUrl);
        setPreviewFileType("pdf");
      }
    }
    setModalVisible(true);
  };

  const handleClear = () => {
    helpers.setValue(null);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const currentFile = field.value;

  return (
    <>
      <Form.Item
        validateStatus={meta.touched && meta.error ? "error" : ""}
        help={meta.touched && meta.error ? meta.error : ""}
        className="mb-2"
      >
        <Space.Compact block className="w-full">
          <div className="bg-[#fafafa] flex items-center px-3 border border-gray-300 border-r-0 rounded-l-[2px] min-w-[150px]">
            {label}
          </div>
          {!selectedFile ? (
            <Upload
              name={name}
              showUploadList={false}
              beforeUpload={(file) => {
                if (!validateFile(file)) {
                  return Upload.LIST_IGNORE;
                }
                return false;
              }}
              onChange={handleUploadChange}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Choose File</Button>
            </Upload>
          ) : (
            <div className="flex items-center justify-between w-full border border-gray-300 bg-blue-50 rounded-r-[2px] px-3">
              <Tooltip title={selectedFile.name}>
                <span className="flex-1 truncate text-gray-800">
                  {truncateFilename(selectedFile.name)}
                </span>
              </Tooltip>
              <Space>
                <Tooltip title="View File">
                  <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={handlePreviewCustom}
                    aria-label="Preview file"
                  />
                </Tooltip>
                <Tooltip title="Clear File">
                  <Button
                    type="link"
                    danger
                    icon={<CloseCircleOutlined />}
                    onClick={handleClear}
                    aria-label="Remove file"
                  />
                </Tooltip>
              </Space>
            </div>
          )}
        </Space.Compact>
      </Form.Item>

      <Modal
        centered
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        title="File Preview"
        width={previewFileType === "pdf" ? 500 : 400}
      >
        {previewFileType === "image" && previewUrl ? (
          <img src={previewUrl} alt="File preview" style={{ width: "100%" }} />
        ) : previewFileType === "pdf" && previewUrl ? (
          <iframe
            src={previewUrl}
            title="PDF Preview"
            style={{ width: "100%", height: "400px" }}
          />
        ) : (
          <p>No preview available.</p>
        )}
      </Modal>
    </>
  );
};

export default SingleFileUpload;
