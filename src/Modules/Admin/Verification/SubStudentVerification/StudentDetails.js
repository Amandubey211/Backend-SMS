import React, { useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineEye } from "react-icons/ai";
import Details from "./Details";
import { useTranslation } from "react-i18next"; // Import useTranslation hook
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
  const { t } = useTranslation("admVerification"); // Initialize useTranslation hook
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
  const closeModal = () => setModalOpen(false);

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
              {t("Document Previews")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.keys(student?.attachments?.optional || {}).map((key, index) => {
                const docUrl = student?.attachments?.optional[key];
                const docLabel = key.charAt(0).toUpperCase() + key.slice(1); // Capitalize the key for label

                return (
                  <div
                    key={key} // Use a unique identifier if available
                    className={`${getColor(index)} p-4 border rounded-lg shadow-md transform hover:scale-105 transition-transform`}
                  >
                    {docUrl?.startsWith("http") && docUrl?.match(/\.(jpg|jpeg|png)$/) ? (
                      <img
                        src={docUrl}
                        alt={`${t("Document")} ${docLabel}`}
                        className="w-full h-40 object-cover mb-2 rounded-md"
                        onError={(e) => e.target.src = "/path/to/default-image.jpg"} // Handle broken image URLs
                      />
                    ) : (
                      <embed
                        src={docUrl}
                        type="application/pdf"
                        className="w-full h-40 mb-2 rounded-md"
                        alt={`${t("Document")} ${docLabel}`} // Ensure accessibility for embedded files
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

        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
            <div className="bg-white p-4 rounded-lg relative max-h-full overflow-y-auto shadow-lg">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 p-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-lg hover:from-pink-600 hover:to-purple-600"
              >
                ✕
              </button>
              <div>
                {preview ? (
                  previewType == "image" ? (
                    <img
                      src={preview}
                      alt={t("Preview")}
                      className="max-h-[80vh] object-contain"
                    />
                  ) : (
                    <embed
                      src={preview}
                      type={'application/pdf'}
                      className="w-full h-[80vh] object-contain"
                    />
                  )
                ) : (
                  <p className="text-center text-gray-500">
                    {t("No preview available")}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </ProtectedSection>
    </div>
  );
};

export default StudentDetail;
