import React, { useEffect, useState } from "react";
import { GoAlertFill } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineEye } from "react-icons/ai";
import { fetchStudentDocument } from "../../../../../../../Store/Slices/Admin/Users/Students/student.action";
import { useTranslation } from "react-i18next";

const StudentProfile = ({ student }) => {
  const { studentDocument, loading } = useSelector((store) => store.admin.all_students);
  const dispatch = useDispatch();
  const { t } = useTranslation('admAccounts');

  useEffect(() => {
    dispatch(fetchStudentDocument(student._id));
  }, [dispatch]);

  const [preview, setPreview] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
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

  const colors = [
    "bg-yellow-300",
    "bg-blue-300",
    "bg-green-300",
    "bg-red-300",
    "bg-purple-300",
    "bg-pink-300",
  ];

  const getColor = (index) => colors[index % colors?.length];

  return (
    <div className="bg-white h-full px-7 py-2">
      <h2 className="text-base font-semibold text-gray-600 mb-3">
        {t("Educational Documents")}
      </h2>
      {studentDocument?.length > 0 ? (
        <div className="w-[30rem] p-2 rounded-lg mb-3">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            {t("Document Previews")}
          </h3>
          <div className="flex w-full">
            {studentDocument?.map((doc, index) => (
              <div
                key={index}
                className={`${getColor(index)} p-4 border rounded-lg shadow-md transform transition-transform hover:scale-105`}
              >
                {doc?.documentType?.startsWith("image/") ? (
                  <img
                    src={doc?.documentUrl}
                    alt={`${t("Document")} ${index + 1}`}
                    className="w-full h-40 object-cover mb-2 rounded-md"
                  />
                ) : (
                  <embed
                    src={doc?.documentUrl}
                    type={doc?.documentType}
                    className="w-full h-40 mb-2 rounded-md"
                  />
                )}
                <div className="flex justify-between items-center">
                  <p className="text-white">
                    <span className="font-medium">
                      {t("Document")} {index + 1}:
                    </span>{" "}
                    {doc?.documentLabel}
                  </p>
                  <button
                    title={t("Open Modal")}
                    className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200"
                    onClick={() =>
                      handlePreviewClick(doc?.documentUrl, doc?.documentType)
                    }
                  >
                    <AiOutlineEye size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center flex-col text-2xl h-full text-gray-500">
          <GoAlertFill className="text-[5rem]" />
          {t("No Data Found")}
        </div>
      )}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-4 rounded-lg relative max-h-full overflow-y-auto shadow-lg">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 p-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-lg hover:from-pink-600 hover:to-purple-600 transition-colors duration-200"
            >
              ✕
            </button>
            <div>
              {preview ? (
                previewType.startsWith("image/") ? (
                  <img
                    src={preview}
                    alt={t("Preview")}
                    className="max-h-[80vh] object-contain"
                  />
                ) : (
                  <embed
                    src={preview}
                    type={previewType}
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
    </div>
  );
};

export default StudentProfile;
