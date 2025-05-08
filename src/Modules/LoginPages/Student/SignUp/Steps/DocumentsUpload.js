// // import React, { useState, useEffect } from "react";
// // import {
// //   Form,
// //   Row,
// //   Col,
// //   Button,
// //   Space,
// //   message,
// //   Modal,
// //   Upload,
// //   Tooltip,
// //   Spin,
// //   Tag,
// // } from "antd";
// // import {
// //   UploadOutlined,
// //   DeleteOutlined,
// //   EyeOutlined,
// //   FilePdfOutlined,
// //   FileImageOutlined,
// //   FileWordOutlined,
// //   FilePptOutlined,
// // } from "@ant-design/icons";
// // import { useDispatch, useSelector } from "react-redux";
// // import useGetAllSchools from "../../../../../Hooks/CommonHooks/useGetAllSchool";
// // import {
// //   nextStep,
// //   prevStep,
// //   updateFormData,
// // } from "../../../../../Store/Slices/Common/User/actions/studentSignupSlice";

// // const DocumentsUpload = ({ formData }) => {
// //   const dispatch = useDispatch();
// //   const { schoolList, loading: schoolsLoading } = useGetAllSchools();
// //   const { formData: storeFormData } = useSelector(
// //     (s) => s.common.studentSignup
// //   );

// //   const [fileList, setFileList] = useState([]);
// //   const [previewVisible, setPreviewVisible] = useState(false);
// //   const [previewFile, setPreviewFile] = useState(null);
// //   const [previewFileType, setPreviewFileType] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [schoolDocuments, setSchoolDocuments] = useState([]);

// //   useEffect(() => {
// //     if (storeFormData?.school?.schoolId && schoolList?.length > 0) {
// //       const selectedSchool = schoolList.find(
// //         (school) => school._id === storeFormData.school.schoolId
// //       );

// //       if (selectedSchool?.attachments) {
// //         setSchoolDocuments(selectedSchool.attachments);
// //         if (formData?.files) {
// //           setFileList(formData.files);
// //         }
// //       }
// //     }
// //   }, [storeFormData?.school?.schoolId, schoolList, formData]);

// //   const handleFileChange = (file, doc) => {
// //     const isImage =
// //       file.type?.includes("image") ||
// //       file.name?.toLowerCase().endsWith(".jpg") ||
// //       file.name?.toLowerCase().endsWith(".jpeg") ||
// //       file.name?.toLowerCase().endsWith(".png");
// //     const isPdf =
// //       file.type?.includes("pdf") || file.name?.toLowerCase().endsWith(".pdf");
// //     const isWord =
// //       file.type?.includes("msword") ||
// //       file.name?.toLowerCase().endsWith(".doc");
// //     const isPpt =
// //       file.type?.includes("ppt") || file.name?.toLowerCase().endsWith(".ppt");

// //     if (!isImage && !isPdf && !isWord && !isPpt) {
// //       message.error(
// //         "You can only upload image (JPG, JPEG, PNG), PDF, DOC, or PPT files!"
// //       );
// //       return false;
// //     }

// //     const reader = new FileReader();
// //     reader.onload = (e) => {
// //       const newFile = {
// //         uid: file.uid,
// //         name: file.name,
// //         status: "done",
// //         url: e.target.result,
// //         type: isImage
// //           ? "image"
// //           : isPdf
// //           ? "pdf"
// //           : isWord
// //           ? "word"
// //           : isPpt
// //           ? "ppt"
// //           : "other",
// //         documentId: doc._id,
// //         documentName: doc.name,
// //         originFileObj: file,
// //         size: file.size, // Adding size to display
// //       };

// //       setFileList((prev) => [
// //         ...prev.filter((f) => f.documentId !== doc._id),
// //         newFile,
// //       ]);
// //     };
// //     reader.readAsDataURL(file);
// //     return false;
// //   };

// //   const handleRemove = (file) => {
// //     setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
// //     return true;
// //   };

// //   const handlePreview = (file) => {
// //     setPreviewFile(file);

// //     let fileType = "other";
// //     if (file.type) {
// //       fileType = file.type.includes("image")
// //         ? "image"
// //         : file.type.includes("pdf")
// //         ? "pdf"
// //         : file.type.includes("word")
// //         ? "word"
// //         : file.type.includes("ppt")
// //         ? "ppt"
// //         : "other";
// //     }

// //     setPreviewFileType(fileType);
// //     setPreviewVisible(true);
// //   };

// //   const handleCancelPreview = () => {
// //     setPreviewVisible(false);
// //   };

// //   const handleClear = (file) => {
// //     setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
// //   };

// //   const handleBack = () => {
// //     dispatch(prevStep());
// //   };

// //   const handleNext = () => {
// //     setLoading(true);

// //     try {
// //       const mandatoryDocs = schoolDocuments.filter((doc) => doc.mandatory);
// //       const uploadedMandatory = mandatoryDocs.every((doc) =>
// //         fileList.some((file) => file.documentId === doc._id)
// //       );

// //       if (!uploadedMandatory) {
// //         message.error("Please upload all mandatory documents");
// //         return;
// //       }

// //       const documentData = {
// //         files: fileList,
// //         documentRequirements: schoolDocuments,
// //       };

// //       dispatch(updateFormData({ documents: documentData }));
// //       dispatch(nextStep());
// //     } catch (err) {
// //       console.error("Error submitting documents:", err);
// //       message.error("Error submitting documents");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const getFileIcon = (fileType) => {
// //     switch (fileType) {
// //       case "pdf":
// //         return <FilePdfOutlined style={{ fontSize: 24, color: "#f24e1e" }} />;
// //       case "image":
// //         return <FileImageOutlined style={{ fontSize: 24, color: "#2196f3" }} />;
// //       case "word":
// //         return <FileWordOutlined style={{ fontSize: 24, color: "#4caf50" }} />;
// //       case "ppt":
// //         return <FilePptOutlined style={{ fontSize: 24, color: "#ff9800" }} />;
// //       default:
// //         return <UploadOutlined style={{ fontSize: 24 }} />;
// //     }
// //   };

// //   const mandatoryDocuments = schoolDocuments.filter((doc) => doc.mandatory);
// //   const optionalDocuments = schoolDocuments.filter((doc) => !doc.mandatory);

// //   if (schoolsLoading) {
// //     return (
// //       <div className="flex justify-center items-center h-64">
// //         <Spin size="large" />
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="max-w-4xl mx-auto px-4">
// //       <Form layout="vertical">
// //         {mandatoryDocuments.length > 0 ? (
// //           <>
// //             <h3 className="text-base font-bold">Mandatory Documents</h3>
// //             <Row gutter={[16, 16]}>
// //               {mandatoryDocuments.map((doc) => {
// //                 const uploadedFile = fileList.find(
// //                   (f) => f.documentId === doc._id
// //                 );
// //                 return (
// //                   <Col xs={24} key={`mandatory-${doc._id}`}>
// //                     <div className="bg-white rounded-lg p-2 shadow-sm flex items-center">
// //                       {getFileIcon(uploadedFile?.type)}
// //                       <div className="ml-4 flex-1">
// //                         <h4 className="text-md font-medium text-gray-700">
// //                           {doc.name}*
// //                         </h4>
// //                         {!uploadedFile ? (
// //                           <Upload
// //                             accept=".jpg,.jpeg,.png,.pdf,.doc,.ppt"
// //                             showUploadList={false}
// //                             beforeUpload={(file) => handleFileChange(file, doc)}
// //                           >
// //                             <Button icon={<UploadOutlined />}>
// //                               Choose File
// //                             </Button>
// //                           </Upload>
// //                         ) : (
// //                           <div className="flex items-center justify-between w-full border border-gray-300 bg-blue-50 rounded-r-[2px] px-3">
// //                             <div className="flex items-center max-w-full">
// //                               <span className="flex-1 min-w-0 text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap">
// //                                 {uploadedFile.name}
// //                               </span>
// //                               <Tag color="blue" className="ms-5">
// //                                 {(uploadedFile.size / 1024).toFixed(2)} KB
// //                               </Tag>
// //                             </div>

// //                             <Space>
// //                               <Tooltip title="Preview">
// //                                 <Button
// //                                   type="link"
// //                                   icon={<EyeOutlined />}
// //                                   onClick={() => handlePreview(uploadedFile)}
// //                                   aria-label="Preview file"
// //                                 />
// //                               </Tooltip>
// //                               <Tooltip title="Clear File">
// //                                 <Button
// //                                   type="link"
// //                                   danger
// //                                   icon={<DeleteOutlined />}
// //                                   onClick={() => handleClear(uploadedFile)}
// //                                   aria-label="Remove file"
// //                                 />
// //                               </Tooltip>
// //                             </Space>
// //                           </div>
// //                         )}
// //                       </div>
// //                     </div>
// //                   </Col>
// //                 );
// //               })}
// //             </Row>
// //           </>
// //         ) : (
// //           <p className="text-gray-500 mb-4">
// //             No mandatory documents required for this school.
// //           </p>
// //         )}

// //         {optionalDocuments.length > 0 ? (
// //           <>
// //             <h3 className="text-base font-bold my-3">Optional Documents</h3>
// //             <Row gutter={[16, 16]}>
// //               {optionalDocuments.map((doc) => {
// //                 const uploadedFile = fileList.find(
// //                   (f) => f.documentId === doc._id
// //                 );
// //                 return (
// //                   <Col xs={24} key={`optional-${doc._id}`}>
// //                     <div className="bg-white rounded-lg p-4 shadow-sm flex items-center">
// //                       {getFileIcon(uploadedFile?.type)}
// //                       <div className="ml-4 flex-1">
// //                         <h4 className="text-md font-medium text-gray-700">
// //                           {doc.name}
// //                         </h4>
// //                         {!uploadedFile ? (
// //                           <Upload
// //                             accept=".jpg,.jpeg,.png,.pdf,.doc,.ppt"
// //                             showUploadList={false}
// //                             beforeUpload={(file) => handleFileChange(file, doc)}
// //                           >
// //                             <Button icon={<UploadOutlined />}>
// //                               Choose File
// //                             </Button>
// //                           </Upload>
// //                         ) : (
// //                           <div className="flex items-center justify-between w-full border border-gray-300 bg-blue-50 rounded-r-[2px] px-3">
// //                             <span className="flex-1 text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap">
// //                               {uploadedFile.name}{" "}
// //                               <Tag color="blue">
// //                                 {(uploadedFile.size / 1024).toFixed(2)} KB
// //                               </Tag>
// //                             </span>
// //                             <Space>
// //                               <Tooltip title="Preview">
// //                                 <Button
// //                                   type="link"
// //                                   icon={<EyeOutlined />}
// //                                   onClick={() => handlePreview(uploadedFile)}
// //                                   aria-label="Preview file"
// //                                 />
// //                               </Tooltip>
// //                               <Tooltip title="Clear File">
// //                                 <Button
// //                                   type="link"
// //                                   danger
// //                                   icon={<DeleteOutlined />}
// //                                   onClick={() => handleClear(uploadedFile)}
// //                                   aria-label="Remove file"
// //                                 />
// //                               </Tooltip>
// //                             </Space>
// //                           </div>
// //                         )}
// //                       </div>
// //                     </div>
// //                   </Col>
// //                 );
// //               })}
// //             </Row>
// //           </>
// //         ) : (
// //           <p className="text-gray-500 mb-4">
// //             No optional documents available for this school.
// //           </p>
// //         )}

// //         <div className="flex justify-between mt-8">
// //           <Button
// //             size="large"
// //             onClick={handleBack}
// //             className="text-gray-600 border-gray-300"
// //           >
// //             Back
// //           </Button>
// //           <Button
// //             type="primary"
// //             size="large"
// //             loading={loading}
// //             onClick={handleNext}
// //             className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-none hover:opacity-90 focus:opacity-90 transition-opacity"
// //             disabled={
// //               mandatoryDocuments.length > 0 &&
// //               !fileList.some((f) =>
// //                 mandatoryDocuments.some((doc) => doc._id === f.documentId)
// //               )
// //             }
// //           >
// //             Next
// //           </Button>
// //         </div>
// //       </Form>

// //       {/* Preview Modal */}
// //       <Modal
// //         open={previewVisible}
// //         title="File Preview"
// //         footer={null}
// //         centered
// //         onCancel={handleCancelPreview}
// //         width="70%"
// //       >
// //         {previewFileType === "image" && previewFile ? (
// //           <img
// //             src={
// //               previewFile.url || URL.createObjectURL(previewFile.originFileObj)
// //             }
// //             alt="File preview"
// //             style={{ width: "100%", maxHeight: "80vh", objectFit: "contain" }}
// //           />
// //         ) : previewFileType === "pdf" && previewFile ? (
// //           <iframe
// //             src={
// //               previewFile.url || URL.createObjectURL(previewFile.originFileObj)
// //             }
// //             title="PDF Preview"
// //             style={{ width: "100%", height: "80vh", border: "none" }}
// //           />
// //         ) : (
// //           <p>No preview available for this file type.</p>
// //         )}
// //       </Modal>
// //     </div>
// //   );
// // };

// // export default DocumentsUpload;

// import React, { useState, useEffect } from "react";
// import {
//   Row,
//   Col,
//   Button,
//   Space,
//   message,
//   Modal,
//   Upload,
//   Tooltip,
//   Spin,
//   Tag,
//   Form,
// } from "antd";
// import {
//   UploadOutlined,
//   DeleteOutlined,
//   EyeOutlined,
//   FilePdfOutlined,
//   FileImageOutlined,
//   FileWordOutlined,
//   FilePptOutlined,
// } from "@ant-design/icons";
// import { useDispatch, useSelector } from "react-redux";
// import useGetAllSchools from "../../../../../Hooks/CommonHooks/useGetAllSchool";

// import {
//   nextStep,
//   prevStep,
//   updateFormData,
// } from "../../../../../Store/Slices/Common/User/actions/studentSignupSlice";
// import useCloudinaryUpload from "../../../../../Hooks/CommonHooks/useCloudinaryUpload";
// import useCloudinaryDeleteByPublicId from "../../../../../Hooks/CommonHooks/useCloudinaryDeleteByPublicId";

// const DocumentsUpload = ({ formData }) => {
//   const dispatch = useDispatch();
//   const { schoolList, loading: schoolsLoading } = useGetAllSchools();
//   const { formData: storeFormData } = useSelector(
//     (s) => s.common.studentSignup
//   );

//   const { uploadFile } = useCloudinaryUpload(
//     process.env.REACT_APP_CLOUDINARY_PRESET,
//     "student_documents"
//   );
//   const { deleteMediaByPublicId } = useCloudinaryDeleteByPublicId();

//   const [fileList, setFileList] = useState([]);
//   const [previewVisible, setPreviewVisible] = useState(false);
//   const [previewFile, setPreviewFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [schoolDocuments, setSchoolDocuments] = useState([]);
//   const [uploadingDocs, setUploadingDocs] = useState({});

//   useEffect(() => {
//     if (storeFormData?.school?.schoolId && schoolList?.length > 0) {
//       const selectedSchool = schoolList.find(
//         (school) => school._id === storeFormData.school.schoolId
//       );

//       if (selectedSchool?.attachments) {
//         setSchoolDocuments(selectedSchool.attachments);
//         if (formData?.files) {
//           setFileList(formData.files);
//         }
//       }
//     }
//   }, [storeFormData?.school?.schoolId, schoolList, formData]);

//   const handleFileChange = async (file, doc) => {
//     if (!file) return false;

//     const isImage =
//       file.type?.includes("image") ||
//       [".jpg", ".jpeg", ".png"].some((ext) =>
//         file.name.toLowerCase().endsWith(ext)
//       );
//     const isPdf =
//       file.type?.includes("pdf") || file.name.toLowerCase().endsWith(".pdf");
//     const isWord =
//       file.type?.includes("msword") ||
//       [".doc", ".docx"].some((ext) => file.name.toLowerCase().endsWith(ext));
//     const isPpt =
//       file.type?.includes("ppt") ||
//       [".ppt", ".pptx"].some((ext) => file.name.toLowerCase().endsWith(ext));

//     if (!isImage && !isPdf && !isWord && !isPpt) {
//       message.error(
//         "You can only upload image (JPG, JPEG, PNG), PDF, DOC, or PPT files!"
//       );
//       return false;
//     }

//     if (file.size > 5 * 1024 * 1024) {
//       // 5MB limit
//       message.error("File must be smaller than 5MB");
//       return false;
//     }

//     setUploadingDocs((prev) => ({ ...prev, [doc._id]: true }));

//     try {
//       const url = await uploadFile(file);
//       if (!url) throw new Error("Upload failed");

//       const fileType = isImage
//         ? "image"
//         : isPdf
//         ? "pdf"
//         : isWord
//         ? "word"
//         : isPpt
//         ? "ppt"
//         : "other";

//       const newFile = {
//         url,
//         documentName: file.name, // what BE wants
//         fieldname: doc.name, // tells BE which requirement this fulfils
//         type: fileType, // “image” | “pdf” | …
//         size: file.size,
//         publicId: url.split("/").pop().split(".")[0],
//         uid: `${doc._id}-${Date.now()}`,
//         documentId: doc._id, // keep for internal look-ups
//       };

//       setFileList((prev) => [
//         ...prev.filter((f) => f.documentId !== doc._id),
//         newFile,
//       ]);

//       return false;
//     } catch (error) {
//       message.error("File upload failed");
//       console.error("Upload error:", error);
//       return false;
//     } finally {
//       setUploadingDocs((prev) => ({ ...prev, [doc._id]: false }));
//     }
//   };

//   const handleRemove = async (file) => {
//     try {
//       if (file.publicId) {
//         await deleteMediaByPublicId(file.publicId);
//       }
//       setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
//       return true;
//     } catch (error) {
//       message.error("Failed to delete file");
//       console.error("Delete error:", error);
//       return false;
//     }
//   };

//   const handlePreview = (file) => {
//     setPreviewFile(file);
//     setPreviewVisible(true);
//   };

//   const handleBack = () => {
//     dispatch(prevStep());
//   };

//   // In DocumentsUpload component, modify the handleNext function:
//   const handleNext = async () => {
//     setLoading(true);
//     try {
//       const mandatoryDocs = schoolDocuments.filter((doc) => doc.mandatory);
//       const uploadedMandatory = mandatoryDocs.every((doc) =>
//         fileList.some((file) => file.documentId === doc._id)
//       );

//       if (!uploadedMandatory) {
//         message.error("Please upload all mandatory documents");
//         return;
//       }

//       const documentData = {
//         files: fileList.map(({ url, documentName, fieldname, type }) => ({
//           url,
//           documentName,
//           fieldname,
//           type,
//         })),
//       };

//       dispatch(updateFormData({ documents: documentData }));
//       dispatch(nextStep());
//     } catch (err) {
//       console.error("Error submitting documents:", err);
//       message.error("Error submitting documents");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getFileIcon = (fileType) => {
//     switch (fileType) {
//       case "pdf":
//         return <FilePdfOutlined style={{ fontSize: 24, color: "#f24e1e" }} />;
//       case "image":
//         return <FileImageOutlined style={{ fontSize: 24, color: "#2196f3" }} />;
//       case "word":
//         return <FileWordOutlined style={{ fontSize: 24, color: "#4caf50" }} />;
//       case "ppt":
//         return <FilePptOutlined style={{ fontSize: 24, color: "#ff9800" }} />;
//       default:
//         return <UploadOutlined style={{ fontSize: 24 }} />;
//     }
//   };

//   const mandatoryDocuments = schoolDocuments.filter((doc) => doc.mandatory);
//   const optionalDocuments = schoolDocuments.filter((doc) => !doc.mandatory);

//   if (schoolsLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Spin size="large" />
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto px-4">
//       <Form layout="vertical">
//         {mandatoryDocuments.length > 0 ? (
//           <>
//             <h3 className="text-base font-bold">Mandatory Documents</h3>
//             <Row gutter={[16, 16]}>
//               {mandatoryDocuments.map((doc) => {
//                 const uploadedFile = fileList.find(
//                   (f) => f.documentId === doc._id
//                 );
//                 const isUploading = uploadingDocs[doc._id];

//                 return (
//                   <Col xs={24} key={`mandatory-${doc._id}`}>
//                     <div className="bg-white rounded-lg p-2 shadow-sm flex items-center">
//                       {getFileIcon(uploadedFile?.type)}
//                       <div className="ml-4 flex-1">
//                         <h4 className="text-md font-medium text-gray-700">
//                           {doc.name}*
//                         </h4>
//                         {!uploadedFile ? (
//                           <div>
//                             <Upload
//                               accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.ppt,.pptx"
//                               showUploadList={false}
//                               beforeUpload={(file) =>
//                                 handleFileChange(file, doc)
//                               }
//                               disabled={isUploading}
//                             >
//                               <Button
//                                 icon={<UploadOutlined />}
//                                 loading={isUploading}
//                               >
//                                 {isUploading ? "Uploading..." : "Choose File"}
//                               </Button>
//                             </Upload>
//                             <p className="text-xs text-gray-500 mt-1">
//                               Max file size: 5MB
//                             </p>
//                           </div>
//                         ) : (
//                           <div className="flex items-center justify-between w-full border border-gray-300 bg-blue-50 rounded-r-[2px] px-3">
//                             <div className="flex items-center max-w-full">
//                               <span className="flex-1 min-w-0 text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap">
//                                 {uploadedFile.name}
//                               </span>
//                               <Tag color="blue" className="ms-5">
//                                 {(uploadedFile.size / 1024).toFixed(2)} KB
//                               </Tag>
//                             </div>

//                             <Space>
//                               <Tooltip title="Preview">
//                                 <Button
//                                   type="link"
//                                   icon={<EyeOutlined />}
//                                   onClick={() => handlePreview(uploadedFile)}
//                                   aria-label="Preview file"
//                                 />
//                               </Tooltip>
//                               <Tooltip title="Remove File">
//                                 <Button
//                                   type="link"
//                                   danger
//                                   icon={<DeleteOutlined />}
//                                   onClick={() => handleRemove(uploadedFile)}
//                                   aria-label="Remove file"
//                                 />
//                               </Tooltip>
//                             </Space>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </Col>
//                 );
//               })}
//             </Row>
//           </>
//         ) : (
//           <p className="text-gray-500 mb-4">
//             No mandatory documents required for this school.
//           </p>
//         )}

//         {optionalDocuments.length > 0 && (
//           <>
//             <h3 className="text-base font-bold my-3">Optional Documents</h3>
//             <Row gutter={[16, 16]}>
//               {optionalDocuments.map((doc) => {
//                 const uploadedFile = fileList.find(
//                   (f) => f.documentId === doc._id
//                 );
//                 const isUploading = uploadingDocs[doc._id];

//                 return (
//                   <Col xs={24} key={`optional-${doc._id}`}>
//                     <div className="bg-white rounded-lg p-4 shadow-sm flex items-center">
//                       {getFileIcon(uploadedFile?.type)}
//                       <div className="ml-4 flex-1">
//                         <h4 className="text-md font-medium text-gray-700">
//                           {doc.name}
//                         </h4>
//                         {!uploadedFile ? (
//                           <div>
//                             <Upload
//                               accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.ppt,.pptx"
//                               showUploadList={false}
//                               beforeUpload={(file) =>
//                                 handleFileChange(file, doc)
//                               }
//                               disabled={isUploading}
//                             >
//                               <Button
//                                 icon={<UploadOutlined />}
//                                 loading={isUploading}
//                               >
//                                 {isUploading ? "Uploading..." : "Choose File"}
//                               </Button>
//                             </Upload>
//                             <p className="text-xs text-gray-500 mt-1">
//                               Max file size: 5MB
//                             </p>
//                           </div>
//                         ) : (
//                           <div className="flex items-center justify-between w-full border border-gray-300 bg-blue-50 rounded-r-[2px] px-3">
//                             <span className="flex-1 text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap">
//                               {uploadedFile.name}{" "}
//                               <Tag color="blue">
//                                 {(uploadedFile.size / 1024).toFixed(2)} KB
//                               </Tag>
//                             </span>
//                             <Space>
//                               <Tooltip title="Preview">
//                                 <Button
//                                   type="link"
//                                   icon={<EyeOutlined />}
//                                   onClick={() => handlePreview(uploadedFile)}
//                                   aria-label="Preview file"
//                                 />
//                               </Tooltip>
//                               <Tooltip title="Remove File">
//                                 <Button
//                                   type="link"
//                                   danger
//                                   icon={<DeleteOutlined />}
//                                   onClick={() => handleRemove(uploadedFile)}
//                                   aria-label="Remove file"
//                                 />
//                               </Tooltip>
//                             </Space>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </Col>
//                 );
//               })}
//             </Row>
//           </>
//         )}

//         <div className="flex justify-between mt-8">
//           <Button
//             size="large"
//             onClick={handleBack}
//             className="text-gray-600 border-gray-300"
//           >
//             Back
//           </Button>
//           <Button
//             type="primary"
//             size="large"
//             loading={loading}
//             onClick={handleNext}
//             className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-none hover:opacity-90 focus:opacity-90 transition-opacity"
//             disabled={
//               mandatoryDocuments.length > 0 &&
//               !fileList.some((f) =>
//                 mandatoryDocuments.some((doc) => doc._id === f.documentId)
//               )
//             }
//           >
//             Next
//           </Button>
//         </div>
//       </Form>

//       {/* Preview Modal */}
//       <Modal
//         open={previewVisible}
//         title="File Preview"
//         footer={null}
//         centered
//         onCancel={() => setPreviewVisible(false)}
//         width="70%"
//       >
//         {previewFile?.type === "image" && previewFile?.url ? (
//           <img
//             src={previewFile.url}
//             alt="File preview"
//             style={{ width: "100%", maxHeight: "80vh", objectFit: "contain" }}
//           />
//         ) : previewFile?.type === "pdf" && previewFile?.url ? (
//           <iframe
//             src={previewFile.url}
//             title="PDF Preview"
//             style={{ width: "100%", height: "80vh", border: "none" }}
//           />
//         ) : (
//           <p>No preview available for this file type.</p>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default DocumentsUpload;



import React, { useState, useEffect } from "react";
import {
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
  Form,
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
import useCloudinaryUpload from "../../../../../Hooks/CommonHooks/useCloudinaryUpload";
import useCloudinaryDeleteByPublicId from "../../../../../Hooks/CommonHooks/useCloudinaryDeleteByPublicId";

const DocumentsUpload = ({ formData }) => {
  const dispatch = useDispatch();
  const { schoolList, loading: schoolsLoading } = useGetAllSchools();
  const { formData: storeFormData } = useSelector(
    (s) => s.common.studentSignup
  );

  const { uploadFile } = useCloudinaryUpload(
    process.env.REACT_APP_CLOUDINARY_PRESET,
    "student_documents"
  );
  const { deleteMediaByPublicId } = useCloudinaryDeleteByPublicId();

  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [schoolDocuments, setSchoolDocuments] = useState([]);
  const [uploadingDocs, setUploadingDocs] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({}); // Track selected files before upload

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

  const handleFileChange = async (file, doc) => {
    if (!file) return false;

    const isImage =
      file.type?.includes("image") ||
      [".jpg", ".jpeg", ".png"].some((ext) =>
        file.name.toLowerCase().endsWith(ext)
      );
    const isPdf =
      file.type?.includes("pdf") || file.name.toLowerCase().endsWith(".pdf");
    const isWord =
      file.type?.includes("msword") ||
      [".doc", ".docx"].some((ext) => file.name.toLowerCase().endsWith(ext));
    const isPpt =
      file.type?.includes("ppt") ||
      [".ppt", ".pptx"].some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!isImage && !isPdf && !isWord && !isPpt) {
      message.error(
        "You can only upload image (JPG, JPEG, PNG), PDF, DOC, or PPT files!"
      );
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      message.error("File must be smaller than 5MB");
      return false;
    }

    // Show the selected file name immediately
    setSelectedFiles(prev => ({
      ...prev,
      [doc._id]: {
        name: file.name.length > 30 
          ? `${file.name.substring(0, 15)}...${file.name.substring(file.name.length - 10)}` 
          : file.name,
        size: file.size
      }
    }));

    setUploadingDocs((prev) => ({ ...prev, [doc._id]: true }));

    try {
      const url = await uploadFile(file);
      if (!url) throw new Error("Upload failed");

      const fileType = isImage
        ? "image"
        : isPdf
        ? "pdf"
        : isWord
        ? "word"
        : isPpt
        ? "ppt"
        : "other";

      const newFile = {
        url,
        documentName: file.name,
        fieldname: doc.name,
        type: fileType,
        size: file.size,
        publicId: url.split("/").pop().split(".")[0],
        uid: `${doc._id}-${Date.now()}`,
        documentId: doc._id,
      };

      setFileList((prev) => [
        ...prev.filter((f) => f.documentId !== doc._id),
        newFile,
      ]);

      // Clear the selected file preview after successful upload
      setSelectedFiles(prev => {
        const newState = {...prev};
        delete newState[doc._id];
        return newState;
      });

      return false;
    } catch (error) {
      message.error("File upload failed");
      console.error("Upload error:", error);
      return false;
    } finally {
      setUploadingDocs((prev) => ({ ...prev, [doc._id]: false }));
    }
  };

  const handleRemove = async (file) => {
    try {
      if (file.publicId) {
        await deleteMediaByPublicId(file.publicId);
      }
      setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
      return true;
    } catch (error) {
      message.error("Failed to delete file");
      console.error("Delete error:", error);
      return false;
    }
  };

  const handlePreview = (file) => {
    setPreviewFile(file);
    setPreviewVisible(true);
  };

  const handleBack = () => {
    dispatch(prevStep());
  };

  const handleNext = async () => {
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
        files: fileList.map(({ url, documentName, fieldname, type }) => ({
          url,
          documentName,
          fieldname,
          type,
        })),
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
                const isUploading = uploadingDocs[doc._id];
                const selectedFile = selectedFiles[doc._id];

                return (
                  <Col xs={24} key={`mandatory-${doc._id}`}>
                    <div className="bg-white rounded-lg p-2 shadow-sm flex items-center">
                      {getFileIcon(uploadedFile?.type)}
                      <div className="ml-4 flex-1">
                        <h4 className="text-md font-medium text-gray-700">
                          {doc.name}*
                        </h4>
                        {!uploadedFile ? (
                          <div>
                            <Upload
                              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.ppt,.pptx"
                              showUploadList={false}
                              beforeUpload={(file) =>
                                handleFileChange(file, doc)
                              }
                              disabled={isUploading}
                            >
                              <Button
                                icon={<UploadOutlined />}
                                loading={isUploading}
                              >
                                {isUploading ? "Uploading..." : "Choose File"}
                              </Button>
                            </Upload>
                            {selectedFile && (
                              <div className="mt-2 flex items-center justify-between w-full border border-gray-300 bg-gray-50 rounded px-3 py-1">
                                <span className="text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap">
                                  {selectedFile.name}
                                </span>
                                <Tag color="blue" className="ms-2">
                                  {(selectedFile.size / 1024).toFixed(2)} KB
                                </Tag>
                              </div>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              Max file size: 5MB
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between w-full border border-gray-300 bg-blue-50 rounded-r-[2px] px-3">
                            <div className="flex items-center max-w-full">
                              <span className="flex-1 min-w-0 text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap">
                                {uploadedFile.documentName.length > 30 
                                  ? `${uploadedFile.documentName.substring(0, 15)}...${uploadedFile.documentName.substring(uploadedFile.documentName.length - 10)}` 
                                  : uploadedFile.documentName}
                              </span>
                              <Tag color="blue" className="ms-5">
                                {(uploadedFile.size / 1024).toFixed(2)} KB
                              </Tag>
                            </div>

                            <Space>
                              <Tooltip title="Preview">
                                <Button
                                  type="link"
                                  icon={<EyeOutlined />}
                                  onClick={() => handlePreview(uploadedFile)}
                                  aria-label="Preview file"
                                />
                              </Tooltip>
                              <Tooltip title="Remove File">
                                <Button
                                  type="link"
                                  danger
                                  icon={<DeleteOutlined />}
                                  onClick={() => handleRemove(uploadedFile)}
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

        {optionalDocuments.length > 0 && (
          <>
            <h3 className="text-base font-bold my-3">Optional Documents</h3>
            <Row gutter={[16, 16]}>
              {optionalDocuments.map((doc) => {
                const uploadedFile = fileList.find(
                  (f) => f.documentId === doc._id
                );
                const isUploading = uploadingDocs[doc._id];
                const selectedFile = selectedFiles[doc._id];

                return (
                  <Col xs={24} key={`optional-${doc._id}`}>
                    <div className="bg-white rounded-lg p-4 shadow-sm flex items-center">
                      {getFileIcon(uploadedFile?.type)}
                      <div className="ml-4 flex-1">
                        <h4 className="text-md font-medium text-gray-700">
                          {doc.name}
                        </h4>
                        {!uploadedFile ? (
                          <div>
                            <Upload
                              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.ppt,.pptx"
                              showUploadList={false}
                              beforeUpload={(file) =>
                                handleFileChange(file, doc)
                              }
                              disabled={isUploading}
                            >
                              <Button
                                icon={<UploadOutlined />}
                                loading={isUploading}
                              >
                                {isUploading ? "Uploading..." : "Choose File"}
                              </Button>
                            </Upload>
                            {selectedFile && (
                              <div className="mt-2 flex items-center justify-between w-full border border-gray-300 bg-gray-50 rounded px-3 py-1">
                                <span className="text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap">
                                  {selectedFile.name}
                                </span>
                                <Tag color="blue" className="ms-2">
                                  {(selectedFile.size / 1024).toFixed(2)} KB
                                </Tag>
                              </div>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              Max file size: 5MB
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between w-full border border-gray-300 bg-blue-50 rounded-r-[2px] px-3">
                            <span className="flex-1 text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap">
                              {uploadedFile.documentName.length > 30 
                                ? `${uploadedFile.documentName.substring(0, 15)}...${uploadedFile.documentName.substring(uploadedFile.documentName.length - 10)}` 
                                : uploadedFile.documentName}{" "}
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
                              <Tooltip title="Remove File">
                                <Button
                                  type="link"
                                  danger
                                  icon={<DeleteOutlined />}
                                  onClick={() => handleRemove(uploadedFile)}
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
        onCancel={() => setPreviewVisible(false)}
        width="70%"
      >
        {previewFile?.type === "image" && previewFile?.url ? (
          <img
            src={previewFile.url}
            alt="File preview"
            style={{ width: "100%", maxHeight: "80vh", objectFit: "contain" }}
          />
        ) : previewFile?.type === "pdf" && previewFile?.url ? (
          <iframe
            src={previewFile.url}
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