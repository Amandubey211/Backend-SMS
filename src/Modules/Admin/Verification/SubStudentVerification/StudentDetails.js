import React, { useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineEye } from "react-icons/ai";
import Details from "./Details";

const colors = [
  "bg-yellow-300",
  "bg-blue-300",
  "bg-green-300",
  "bg-red-300",
  "bg-purple-300",
  "bg-pink-300",
];

const getColor = (index) => colors[index % colors.length];

const StudentDetail = () => {
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
    return <p className="text-center text-red-500">Student not found</p>;
  }

  return (
    <div className="container p-2 w-full ">
      <NavLink
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mt-5 ps-6 text-sm text-gray-500 hover:text-gray-700"
      >
        <div className="w-6 h-6 flex justify-center items-center border rounded-full text-xl">
          &larr;
        </div>
        <span>Back</span>
      </NavLink>

      <div className="bg-white p-2">
        <Details student={student} />

        <div className="p-2 rounded-lg mb-3">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Document Previews
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {student?.documentId?.documents?.map((doc, index) => (
              <div
                key={index}
                className={`${getColor(
                  index
                )} p-4 border rounded-lg shadow-md transform hover:scale-105 transition-transform`}
              >
                {doc.documentType.startsWith("image/") ? (
                  <img
                    src={doc?.documentUrl}
                    alt={`Document ${index + 1}`}
                    className="w-full h-40 object-cover mb-2 rounded-md"
                  />
                ) : (
                  <embed
                    src={doc?.documentUrl}
                    type={doc.documentType}
                    className="w-full h-40 mb-2 rounded-md"
                  />
                )}
                <div className="flex justify-between items-center">
                  <p className="text-white">
                    <span className="font-medium">Document {index + 1}:</span>{" "}
                    {doc?.documentLabel}
                  </p>
                  <button
                    title="Open Modal"
                    className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-lg hover:from-pink-600 hover:to-purple-600"
                    onClick={() =>
                      handlePreviewClick(doc?.documentUrl, doc.documentType)
                    }
                  >
                    <AiOutlineEye size={20} />
                  </button>
                </div>
              </div>
            ))}
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
                previewType.startsWith("image/") ? (
                  <img
                    src={preview}
                    alt="Preview"
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
                  No preview available
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDetail;
