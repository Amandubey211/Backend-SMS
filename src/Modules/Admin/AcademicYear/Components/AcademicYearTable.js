import React from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { BsFillPatchCheckFill, BsPatchCheck } from "react-icons/bs"; // Importing the icons

const AcademicYearTable = ({
  academicYears,
  handleCheckboxChange,
  handleEdit,
  handleDelete,
}) => {
  return (
    <div className="bg-white p-2 rounded-lg w-full">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        All Academic Years
      </h2>
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="text-left text-gray-500 text-base leading-normal bg-gray-100">
            <th className="p-3">Select</th>
            <th className="p-3">Year</th>
            <th className="p-3">Start Date</th>
            <th className="p-3">End Date</th>
            <th className="p-3">Active</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody className="text-base  text-gray-700">
          {academicYears?.map((year) => (
            <tr
              key={year._id}
              className={`${
                year.isActive ? "bg-green-50 hover:bg-green-100" : " hover:bg-gray-50"
              }  border-b border-gray-200  transition duration-200`}
            >
              <td className="p-3 flex justify-center">
                <button onClick={() => handleCheckboxChange(year)}>
                  {year.isActive ? (
                    <BsFillPatchCheckFill className="text-green-500 text-2xl" />
                  ) : (
                    <BsPatchCheck className="text-gray-400 text-2xl" />
                  )}
                </button>
              </td>
              <td className="p-3">{year.academicYear}</td>
              <td className="p-3">{year.startDate}</td>
              <td className="p-3">{year.endDate}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded-md text-base ${
                    year.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {year.isActive ? "Yes" : "No"}
                </span>
              </td>
              <td className="p-3 flex items-center space-x-3 text-2xl">
                <button
                  onClick={() => handleEdit(year)}
                  className="text-purple-600 hover:text-purple-800 transition duration-150"
                >
                  <FaRegEdit />
                </button>
                <button
                  onClick={() => handleDelete(year)}
                  className={`${
                    year.isActive
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-red-500 hover:text-red-700 transition duration-150"
                  }`}
                  disabled={year.isActive}
                >
                  <RiDeleteBin5Line />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AcademicYearTable;
