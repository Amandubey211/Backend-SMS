import React, { useState, useEffect } from "react";
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
  Spin,
  Tag,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  EyeOutlined,
  FilePdfOutlined,
  FileImageOutlined,
  FileWordOutlined,
  FilePptOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import useGetAllSchools from "../../../../../Hooks/CommonHooks/useGetAllSchool";
import {
  nextStep,
  prevStep,
  updateFormData,
} from "../../../../../Store/Slices/Common/User/actions/studentSignupSlice";

const DocumentsUpload = ({ formData }) => {
  const dispatch = useDispatch();
  const { schoolList, loading: schoolsLoading } = useGetAllSchools();
  const { formData: storeFormData } = useSelector(
    (s) => s.common.studentSignup
  );

  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewFileType, setPreviewFileType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [schoolDocuments, setSchoolDocuments] = useState([]);

  useEffect(() => {
    if (storeFormData?.school?.schoolId && schoolList?.length > 0) {
      const selectedSchool = schoolList.find(
        (school) => school._id === storeFormData.school.schoolId
      );

      if (selectedSchool?.attachments) {
        setSchoolDocuments(selectedSchool.attachments);
        if (formData?.files) {
          setFileList(formData.files);
        }
      }
    }
  }, [storeFormData?.school?.schoolId, schoolList, formData]);

  const handleFileChange = (file, doc) => {
    const isImage =
      file.type?.includes("image") ||
      file.name?.toLowerCase().endsWith(".jpg") ||
      file.name?.toLowerCase().endsWith(".jpeg") ||
      file.name?.toLowerCase().endsWith(".png");
    const isPdf =
      file.type?.includes("pdf") || file.name?.toLowerCase().endsWith(".pdf");
    const isWord =
      file.type?.includes("msword") ||
      file.name?.toLowerCase().endsWith(".doc");
    const isPpt =
      file.type?.includes("ppt") || file.name?.toLowerCase().endsWith(".ppt");

    if (!isImage && !isPdf && !isWord && !isPpt) {
      message.error(
        "You can only upload image (JPG, JPEG, PNG), PDF, DOC, or PPT files!"
      );
      return false;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const newFile = {
        uid: file.uid,
        name: file.name,
        status: "done",
        url: e.target.result,
        type: isImage
          ? "image"
          : isPdf
          ? "pdf"
          : isWord
          ? "word"
          : isPpt
          ? "ppt"
          : "other",
        documentId: doc._id,
        documentName: doc.name,
        originFileObj: file,
        size: file.size, // Adding size to display
      };

      setFileList((prev) => [
        ...prev.filter((f) => f.documentId !== doc._id),
        newFile,
      ]);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleRemove = (file) => {
    setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
    return true;
  };

  const handlePreview = (file) => {
    setPreviewFile(file);

    let fileType = "other";
    if (file.type) {
      fileType = file.type.includes("image")
        ? "image"
        : file.type.includes("pdf")
        ? "pdf"
        : file.type.includes("word")
        ? "word"
        : file.type.includes("ppt")
        ? "ppt"
        : "other";
    }

    setPreviewFileType(fileType);
    setPreviewVisible(true);
  };

  const handleCancelPreview = () => {
    setPreviewVisible(false);
  };

  const handleClear = (file) => {
    setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  const handleBack = () => {
    dispatch(prevStep());
  };

  const handleNext = () => {
    setLoading(true);

    try {
      const mandatoryDocs = schoolDocuments.filter((doc) => doc.mandatory);
      const uploadedMandatory = mandatoryDocs.every((doc) =>
        fileList.some((file) => file.documentId === doc._id)
      );

      if (!uploadedMandatory) {
        message.error("Please upload all mandatory documents");
        return;
      }

      const documentData = {
        files: fileList,
        documentRequirements: schoolDocuments,
      };

      dispatch(updateFormData({ documents: documentData }));
      dispatch(nextStep());
    } catch (err) {
      console.error("Error submitting documents:", err);
      message.error("Error submitting documents");
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case "pdf":
        return <FilePdfOutlined style={{ fontSize: 24, color: "#f24e1e" }} />;
      case "image":
        return <FileImageOutlined style={{ fontSize: 24, color: "#2196f3" }} />;
      case "word":
        return <FileWordOutlined style={{ fontSize: 24, color: "#4caf50" }} />;
      case "ppt":
        return <FilePptOutlined style={{ fontSize: 24, color: "#ff9800" }} />;
      default:
        return <UploadOutlined style={{ fontSize: 24 }} />;
    }
  };

  const mandatoryDocuments = schoolDocuments.filter((doc) => doc.mandatory);
  const optionalDocuments = schoolDocuments.filter((doc) => !doc.mandatory);

  if (schoolsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <Form layout="vertical">
        {mandatoryDocuments.length > 0 ? (
          <>
            <h3 className="text-base font-bold">Mandatory Documents</h3>
            <Row gutter={[16, 16]}>
              {mandatoryDocuments.map((doc) => {
                const uploadedFile = fileList.find(
                  (f) => f.documentId === doc._id
                );
                return (
                  <Col xs={24} key={`mandatory-${doc._id}`}>
                    <div className="bg-white rounded-lg p-2 shadow-sm flex items-center">
                      {getFileIcon(uploadedFile?.type)}
                      <div className="ml-4 flex-1">
                        <h4 className="text-md font-medium text-gray-700">
                          {doc.name}*
                        </h4>
                        {!uploadedFile ? (
                          <Upload
                            accept=".jpg,.jpeg,.png,.pdf,.doc,.ppt"
                            showUploadList={false}
                            beforeUpload={(file) => handleFileChange(file, doc)}
                          >
                            <Button icon={<UploadOutlined />}>
                              Choose File
                            </Button>
                          </Upload>
                        ) : (
                          <div className="flex items-center justify-between w-full border border-gray-300 bg-blue-50 rounded-r-[2px] px-3">
                            <span className="flex-1 text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap">
                              {uploadedFile.name}{" "}
                              <Tag color="blue">
                                {(uploadedFile.size / 1024).toFixed(2)} KB
                              </Tag>
                            </span>
                            <Space>
                              <Tooltip title="Preview">
                                <Button
                                  type="link"
                                  icon={<EyeOutlined />}
                                  onClick={() => handlePreview(uploadedFile)}
                                  aria-label="Preview file"
                                />
                              </Tooltip>
                              <Tooltip title="Clear File">
                                <Button
                                  type="link"
                                  danger
                                  icon={<DeleteOutlined />}
                                  onClick={() => handleClear(uploadedFile)}
                                  aria-label="Remove file"
                                />
                              </Tooltip>
                            </Space>
                          </div>
                        )}
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </>
        ) : (
          <p className="text-gray-500 mb-4">
            No mandatory documents required for this school.
          </p>
        )}

        {optionalDocuments.length > 0 ? (
          <>
            <h3 className="text-base font-bold my-3">Optional Documents</h3>
            <Row gutter={[16, 16]}>
              {optionalDocuments.map((doc) => {
                const uploadedFile = fileList.find(
                  (f) => f.documentId === doc._id
                );
                return (
                  <Col xs={24} key={`optional-${doc._id}`}>
                    <div className="bg-white rounded-lg p-4 shadow-sm flex items-center">
                      {getFileIcon(uploadedFile?.type)}
                      <div className="ml-4 flex-1">
                        <h4 className="text-md font-medium text-gray-700">
                          {doc.name}
                        </h4>
                        {!uploadedFile ? (
                          <Upload
                            accept=".jpg,.jpeg,.png,.pdf,.doc,.ppt"
                            showUploadList={false}
                            beforeUpload={(file) => handleFileChange(file, doc)}
                          >
                            <Button icon={<UploadOutlined />}>
                              Choose File
                            </Button>
                          </Upload>
                        ) : (
                          <div className="flex items-center justify-between w-full border border-gray-300 bg-blue-50 rounded-r-[2px] px-3">
                            <span className="flex-1 text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap">
                              {uploadedFile.name}{" "}
                              <Tag color="blue">
                                {(uploadedFile.size / 1024).toFixed(2)} KB
                              </Tag>
                            </span>
                            <Space>
                              <Tooltip title="Preview">
                                <Button
                                  type="link"
                                  icon={<EyeOutlined />}
                                  onClick={() => handlePreview(uploadedFile)}
                                  aria-label="Preview file"
                                />
                              </Tooltip>
                              <Tooltip title="Clear File">
                                <Button
                                  type="link"
                                  danger
                                  icon={<DeleteOutlined />}
                                  onClick={() => handleClear(uploadedFile)}
                                  aria-label="Remove file"
                                />
                              </Tooltip>
                            </Space>
                          </div>
                        )}
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </>
        ) : (
          <p className="text-gray-500 mb-4">
            No optional documents available for this school.
          </p>
        )}

        <div className="flex justify-between mt-8">
          <Button
            size="large"
            onClick={handleBack}
            className="text-gray-600 border-gray-300"
          >
            Back
          </Button>
          <Button
            type="primary"
            size="large"
            loading={loading}
            onClick={handleNext}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-none hover:opacity-90 focus:opacity-90 transition-opacity"
            disabled={
              mandatoryDocuments.length > 0 &&
              !fileList.some((f) =>
                mandatoryDocuments.some((doc) => doc._id === f.documentId)
              )
            }
          >
            Next
          </Button>
        </div>
      </Form>

      {/* Preview Modal */}
      <Modal
        open={previewVisible}
        title="File Preview"
        footer={null}
        centered
        onCancel={handleCancelPreview}
        width="70%"
      >
        {previewFileType === "image" && previewFile ? (
          <img
            src={
              previewFile.url || URL.createObjectURL(previewFile.originFileObj)
            }
            alt="File preview"
            style={{ width: "100%", maxHeight: "80vh", objectFit: "contain" }}
          />
        ) : previewFileType === "pdf" && previewFile ? (
          <iframe
            src={
              previewFile.url || URL.createObjectURL(previewFile.originFileObj)
            }
            title="PDF Preview"
            style={{ width: "100%", height: "80vh", border: "none" }}
          />
        ) : (
          <p>No preview available for this file type.</p>
        )}
      </Modal>
    </div>
  );
};

export default DocumentsUpload;
