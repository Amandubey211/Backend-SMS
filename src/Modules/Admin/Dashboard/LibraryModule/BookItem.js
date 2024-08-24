import React from "react";

const BookItem = ({ image, title, category, copies, available, studentName, status, issueDate, role }) => {
  return (
    <div className="flex items-center justify-between bg-white p-4 border border-gray-200 rounded-lg mb-4 shadow-sm">
      <div className="flex items-center">
        <img className="w-16 h-16 rounded-lg mr-6" src={image} alt={title} />
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-green-600">{category}</p>
        </div>
      </div>
      {role === "teacher" ? (
        <div className="flex flex-col items-start text-right gap-2">
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-600 font-semibold">Student:</p>
            <p className="text-sm font-medium text-gray-800">{studentName || "N/A"}</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-600 font-semibold">Status:</p>
            <p className={`text-sm font-medium ${status === 'Returned' ? 'text-green-600' : 'text-red-600'}`}>
              {status}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-600 font-semibold">Date:</p>
            <p className="text-sm font-medium text-gray-800">{issueDate ? new Date(issueDate).toLocaleDateString() : "N/A"}</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col text-right">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-600">Copies:</p>
              <p className="text-sm font-medium text-gray-800">{copies}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-600">Available:</p>
              <p className="text-sm font-medium text-gray-800">{available}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookItem;
