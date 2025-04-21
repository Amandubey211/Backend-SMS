import React, { useState } from "react";
import {
  Form,
  Row,
  Col,
  Button,
  Space,
  message,
  Modal,
  Upload,
  Tooltip,
} from "antd";
import { UploadOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";

const DocumentsUpload = () => {
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewFileType, setPreviewFileType] = useState(null);
  const [loading, setLoading] = useState(false);

  const props = {
    onRemove: (file) => {
      const newFileList = fileList.filter((item) => item.uid !== file.uid);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      const isImage = file.type.includes("image");
      const isPdf = file.type.includes("pdf");

      if (!isImage && !isPdf) {
        message.error("You can only upload image or PDF files!");
        return false;
      }

      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  const handlePreview = (file) => {
    setPreviewFile(file);
    setPreviewVisible(true);
    const fileType = file.type.includes("image") ? "image" : "pdf";
    setPreviewFileType(fileType);
  };

  const handleCancelPreview = () => {
    setPreviewVisible(false);
  };

  const handleClear = (file) => {
    setFileList(fileList.filter((item) => item.uid !== file.uid));
  };

  const onFinish = (values) => {
    console.log("DocumentsUpload values:", values);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 ">
      <Form layout="vertical" onFinish={onFinish}>
        <h3 className="text-base font-bold ">Mandatory</h3>
        <Row gutter={[16, 16]}>
          {[
            { title: "Student ID Copy*", required: true },
            { title: "Student Passport*", required: true },
            { title: "Last Report Card*", required: true },
          ].map((doc, index) => (
            <Col xs={24} key={index}>
              <div className="bg-white rounded-lg p-2 shadow-sm ">
                <h4 className="text-md font-medium text-gray-700">
                  {doc.title}
                </h4>
                {!fileList[index] ? (
                  <Upload
                    {...props}
                    showUploadList={false}
                    maxCount={1}
                    accept=".jpg,.jpeg,.png,.pdf"
                  >
                    <Button icon={<UploadOutlined />}>Choose File</Button>
                  </Upload>
                ) : (
                  <div className="flex items-center justify-between w-full border border-gray-300 bg-blue-50 rounded-r-[2px] px-3">
                    <span className="flex-1 text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap">
                      {fileList[index]?.name}
                    </span>
                    <Space>
                      <Tooltip title="Preview">
                        <Button
                          type="link"
                          icon={<EyeOutlined />}
                          onClick={() => handlePreview(fileList[index])}
                          aria-label="Preview file"
                        />
                      </Tooltip>
                      <Tooltip title="Clear File">
                        <Button
                          type="link"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleClear(fileList[index])}
                          aria-label="Remove file"
                        />
                      </Tooltip>
                    </Space>
                  </div>
                )}
              </div>
            </Col>
          ))}
        </Row>

        <h3 className="text-base font-bold my-3">Optional</h3>
        <Row gutter={[16, 16]}>
          {[
            { title: "Medical Report / Certificate", required: false },
            { title: "Birth Certificate", required: false },
            { title: "Vaccination Card/Certificate", required: false },
          ].map((doc, index) => (
            <Col xs={24} key={index}>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="text-md font-medium text-gray-700">
                  {doc.title}
                </h4>
                {!fileList[index + 3] ? (
                  <Upload
                    {...props}
                    showUploadList={false}
                    maxCount={1}
                    accept=".jpg,.jpeg,.png,.pdf"
                  >
                    <Button icon={<UploadOutlined />}>Choose File</Button>
                  </Upload>
                ) : (
                  <div className="flex items-center justify-between w-full border border-gray-300 bg-blue-50 rounded-r-[2px] px-3">
                    <span className="flex-1 text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap">
                      {fileList[index + 3]?.name}
                    </span>
                    <Space>
                      <Tooltip title="Preview">
                        <Button
                          type="link"
                          icon={<EyeOutlined />}
                          onClick={() => handlePreview(fileList[index + 3])}
                          aria-label="Preview file"
                        />
                      </Tooltip>
                      <Tooltip title="Clear File">
                        <Button
                          type="link"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleClear(fileList[index + 3])}
                          aria-label="Remove file"
                        />
                      </Tooltip>
                    </Space>
                  </div>
                )}
              </div>
            </Col>
          ))}
        </Row>

        <div className="flex justify-between mt-8">
          <Button size="large" className="text-gray-600 border-gray-300">
            Back
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-none hover:opacity-90 focus:opacity-90 transition-opacity"
          >
            Next
          </Button>
        </div>
      </Form>

      {/* Preview Modal */}
      <Modal
        visible={previewVisible}
        title="File Preview"
        footer={null}
        onCancel={handleCancelPreview}
        width={previewFileType === "pdf" ? 500 : 400}
      >
        {previewFileType === "image" && previewFile ? (
          <img
            src={URL.createObjectURL(previewFile)}
            alt="File preview"
            style={{ width: "100%" }}
          />
        ) : previewFileType === "pdf" && previewFile ? (
          <iframe
            src={URL.createObjectURL(previewFile)}
            title="PDF Preview"
            style={{ width: "100%", height: "400px" }}
          />
        ) : (
          <p>No preview available.</p>
        )}
      </Modal>
    </div>
  );
};

export default DocumentsUpload;
