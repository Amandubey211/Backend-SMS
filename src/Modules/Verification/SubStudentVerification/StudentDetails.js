import React, { useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { mockStudents } from "../VerificationData/NonVerifiedStudentData";
import axios from "axios";
import VerificationForm from "./VerificationForm";
import { AiOutlineEye } from "react-icons/ai";

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
  const student = mockStudents.find((student) => student._id?.$oid === sid);
  const [preview, setPreview] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handlePreviewClick = (url) => {
    setPreview(url);
    openModal();
  };

  if (!student) {
    return <p className="text-center text-red-500">Student not found</p>;
  }

  return (
    <div className="container mx-auto p-3">
      <div className="flex">
        <NavLink
          onClick={() => navigate(-1)}
          className="text-sm text-gray-500 hover:text-gray-700 mb-4 items-center flex gap-2"
        >
          <div className="rounded-full border text-xl w-6 h-6 flex justify-center items-center">
            &larr;
          </div>
          <span>Back</span>
        </NavLink>
      </div>
      <div className="bg-white p-2 rounded-lg ">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Details for {student?.firstName}
        </h2>
        <div className="bg-gray-50 p-6 rounded-lg mb-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { label: "Email", value: student?.email },
              { label: "Student ID", value: student?.Q_Id },
              { label: "Contact Number", value: student?.contactNumber },
              { label: "Place of Birth", value: student?.placeOfBirth },
              { label: "Guardian Name", value: student?.guardianName },
              {
                label: "Guardian Contact Number",
                value: student?.guardianContactNumber,
              },
            ].map((item, index) => (
              <p key={index} className="text-gray-700">
                <span className="font-medium">{item.label}:</span> {item.value}
              </p>
            ))}
          </div>
          <div className="mt-6">
            {[
              {
                label: "Permanent Address",
                value: `${student?.permanentAddress?.street}, ${student?.permanentAddress?.city}, ${student?.permanentAddress?.state}, ${student?.permanentAddress?.postalCode}`,
              },
              {
                label: "Residential Address",
                value: `${student?.residentialAddress?.street}, ${student?.residentialAddress?.city}, ${student?.residentialAddress?.state}, ${student?.residentialAddress?.postalCode}`,
              },
            ].map((item, index) => (
              <p key={index} className="text-gray-700">
                <span className="font-medium">{item.label}:</span> {item.value}
              </p>
            ))}
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg mb-2 ">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Document Previews
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {student?.documents?.map((doc, index) => (
              <div
                key={index}
                className={`${getColor(index)} p-4 border rounded-lg shadow-md`}
              >
                <img
                  src={doc?.url}
                  alt={`Document ${index + 1}`}
                  className="w-full h-40 object-cover mb-2 rounded-md"
                />
                <div className="flex justify-between items-center">
                  <p className="text-white">
                    <span className="font-medium">Document {index + 1}:</span>{" "}
                    {doc?.name}
                  </p>
                  <button
                    title="Open Modal"
                    style={{
                      background: "linear-gradient(to right, #fce7f3, #e9d5ff)",
                      transition: "background-color 0.3s ease",
                      transform: "scale(1)",
                    }}
                    className="hover:border-purple-500 shadow-2xl opacity-85 hover:opacity-100 hover:shadow-2xl hover:border hover rounded-full p-1"
                    onClick={() => handlePreviewClick(doc?.url)}
                  >
                    <AiOutlineEye
                      size={25}
                      style={{
                        background:
                          "linear-gradient(to right, #f43f5e, #8b5cf6)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        transition: "transform 0.3s ease-in",
                        transform: "scale(1)",
                      }}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <VerificationForm email={student.email} studentId={student._id.$oid} />
      </div>
      {modalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-4 rounded-lg relative max-h-full overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 p-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transition-colors duration-200 shadow-lg"
            >
              ✕
            </button>
            <div>
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-[80vh] object-contain"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDetail;
