import React, { useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineEye } from "react-icons/ai";
import { Modal } from "antd"; // Import Ant Design Modal
import Details from "./Details";
import { useTranslation } from "react-i18next";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../config/permission";

const colors = [
  "bg-yellow-300",
  "bg-blue-300",
  "bg-green-300",
  "bg-red-300",
  "bg-purple-300",
  "bg-pink-300",
];

const getColor = (index) => colors[index % colors?.length];

const StudentDetail = () => {
  const { t } = useTranslation("admVerification");
  const { sid } = useParams();
  const navigate = useNavigate();
  const { unVerifiedStudents, rejectedStudents } = useSelector(
    (store) => store.admin.verification
  );
  const student = [...unVerifiedStudents, ...rejectedStudents].find(
    (student) => student._id === sid
  );

  const [preview, setPreview] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    setPreview(null);
    setPreviewType(null);
  };

  const handlePreviewClick = (url, type) => {
    if (url) {
      setPreview(url);
      setPreviewType(type);
      openModal();
    } else {
      console.error("Invalid URL:", url);
    }
  };

  if (!student) {
    return <p className="text-center text-red-500">{t("Student not found")}</p>;
  }

  return (
    <div className="container p-2 w-full h-full ">
      <ProtectedSection requiredPermission={PERMISSIONS.VERIFY_STUDENT}>
        <NavLink
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mt-5 ps-6 text-sm text-gray-500 hover:text-gray-700"
        >
          <div className="w-6 h-6 flex justify-center items-center border rounded-full text-xl">
            &larr;
          </div>
          <span>{t("Back")}</span>
        </NavLink>

        <div className="bg-white p-2">
          <Details student={student} />
          <div className="p-2 rounded-lg mb-3">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              {t("Mandatory Document Previews")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.keys(student?.attachments?.mandatory || {}).map((key, index) => {
                const docUrl = student?.attachments?.mandatory[key];
                const docLabel = key.charAt(0).toUpperCase() + key.slice(1);

                return (
                  <div
                    key={key}
                    className={`${getColor(index)} p-4 border rounded-lg shadow-md transform hover:scale-105 transition-transform`}
                  >
                    {docUrl?.startsWith("http") && docUrl?.match(/\.(jpg|jpeg|png)$/) ? (
                      <img
                        src={docUrl}
                        alt={`${t("Document")} ${docLabel}`}
                        className="w-full h-40 object-cover mb-2 rounded-md"
                        onError={(e) => e.target.src = "/path/to/default-image.jpg"}
                      />
                    ) : (
                      <embed
                        src={docUrl}
                        type="application/pdf"
                        className="w-full h-40 mb-2 rounded-md"
                        alt={`${t("Document")} ${docLabel}`}
                      />
                    )}
                    <div className="flex justify-between items-center">
                      <p className="text-white">
                        <span className="font-medium">
                          {t("Document")} {index + 1}:
                        </span>{" "}
                        {docLabel}
                      </p>
                      <button
                        title={t("Open Modal")}
                        className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-lg hover:from-pink-600 hover:to-purple-600"
                        onClick={() =>
                          handlePreviewClick(docUrl, docUrl?.startsWith("http") && docUrl?.match(/\.(jpg|jpeg|png)$/) ?"image":"pdf")
                        }
                      >
                        <AiOutlineEye size={20} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="p-2 rounded-lg mb-3">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              {t("Optional Document Previews")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.keys(student?.attachments?.optional || {}).map((key, index) => {
                const docUrl = student?.attachments?.optional[key];
                const docLabel = key.charAt(0).toUpperCase() + key.slice(1);

                return (
                  <div
                    key={key}
                    className={`${getColor(index)} p-4 border rounded-lg shadow-md transform hover:scale-105 transition-transform`}
                  >
                    {docUrl?.startsWith("http") && docUrl?.match(/\.(jpg|jpeg|png)$/) ? (
                      <img
                        src={docUrl}
                        alt={`${t("Document")} ${docLabel}`}
                        className="w-full h-40 object-cover mb-2 rounded-md"
                        onError={(e) => e.target.src = "/path/to/default-image.jpg"}
                      />
                    ) : (
                      <embed
                        src={docUrl}
                        type="application/pdf"
                        className="w-full h-40 mb-2 rounded-md"
                        alt={`${t("Document")} ${docLabel}`}
                      />
                    )}
                    <div className="flex justify-between items-center">
                      <p className="text-white">
                        <span className="font-medium">
                          {t("Document")} {index + 1}:
                        </span>{" "}
                        {docLabel}
                      </p>
                      <button
                        title={t("Open Modal")}
                        className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-lg hover:from-pink-600 hover:to-purple-600"
                        onClick={() =>
                          handlePreviewClick(docUrl, docUrl?.startsWith("http") && docUrl?.match(/\.(jpg|jpeg|png)$/) ?"image":"pdf")
                        }
                      >
                        <AiOutlineEye size={20} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <Modal
          open={modalOpen}
          onCancel={closeModal}
          footer={null}
          width="100%"
          style={{ top: 20 }}
          bodyStyle={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "calc(100vh - 100px)",
            padding: 0,
            overflow: "hidden"
          }}
          centered
          destroyOnClose
        >
          {preview ? (
            previewType === "image" ? (
              <img
                src={preview}
                alt={t("Preview")}
                style={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  objectFit: "contain"
                }}
              />
            ) : (
              <embed
                src={preview}
                type="application/pdf"
                style={{
                  width: "100%",
                  height: "100%",
                  minHeight: "80vh"
                }}
              />
            )
          ) : (
            <p className="text-center text-gray-500">
              {t("No preview available")}
            </p>
          )}
        </Modal>
      </ProtectedSection>
    </div>
  );
};

export default StudentDetail;