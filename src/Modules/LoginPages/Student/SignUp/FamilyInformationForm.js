import React from "react";

const FamilyInformationForm = ({ studentDetails, handleChange }) => {
  return (
    <>
      <h3 className="text-lg font-semibold mb-2">Family Information</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          name="motherName"
          value={studentDetails.motherName}
          onChange={handleChange}
          placeholder="Mother's Name*"
          className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
        <input
          type="text"
          name="fatherName"
          value={studentDetails.fatherName}
          onChange={handleChange}
          placeholder="Father's Name*"
          className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          name="guardianName"
          value={studentDetails.guardianName}
          onChange={handleChange}
          placeholder="Guardian's Name*"
          className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
        <input
          type="number"
          name="guardianContactNumber"
          value={studentDetails.guardianContactNumber}
          onChange={handleChange}
          placeholder="Guardian's Contact Number*"
          className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
    </>
  );
};

export default FamilyInformationForm;
