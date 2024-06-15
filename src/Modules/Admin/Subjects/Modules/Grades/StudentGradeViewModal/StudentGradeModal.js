import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const StudentGradeModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  const studentGrade = useSelector((store) => store.Admin.studentGrade);

  return (
    <div
      className={`fixed inset-0 flex items-end justify-center bg-black bg-opacity-50 z-20 transition-opacity duration-500 ease-in-out ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`bg-white w-full p-3 h-[97vh] rounded-t-lg shadow-lg transform transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex justify-between items-center p-1">
          <h2 className="text-lg font-semibold">Total Grade</h2>
          <button
            onClick={onClose}
            className="text-gray-600 text-3xl hover:text-gray-900"
          >
            &times;
          </button>
        </div>
        <div className="p-4">
          <h1>This is the student grade list</h1>
          <p>
            <b>ID:</b> {studentGrade.id}
          </p>
          <p>
            <b>Name:</b> {studentGrade.name}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentGradeModal;
