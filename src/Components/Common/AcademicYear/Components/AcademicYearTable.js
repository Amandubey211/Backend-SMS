import React from "react";
import { BsFillPatchCheckFill, BsPatchCheck } from "react-icons/bs"; // Importing the icons

const AcademicYearTable = ({
  academicYears,
  handleCheckboxChange,
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
          </tr>
        </thead>
        <tbody className="text-base  text-gray-700">
          {academicYears?.map((year) => (
            <tr
              key={year?._id}
              className={`${
                year?.isActive ? "bg-green-50 hover:bg-green-100" : " hover:bg-gray-50"
              }  border-b border-gray-200  transition duration-200`}
            >
              <td className="p-3 flex justify-center">
                <button onClick={() => handleCheckboxChange(year)}>
                  {year?.isActive ? (
                    <BsFillPatchCheckFill className="text-green-500 text-2xl" />
                  ) : (
                    <BsPatchCheck className="text-gray-400 text-2xl" />
                  )}
                </button>
              </td>
              <td className="p-3">{year?.academicYear}</td>
              <td className="p-3">{year?.startDate?.slice(0,10)}</td>
              <td className="p-3">{year?.endDate?.slice(0,10)}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded-md text-base ${
                    year?.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {year?.isActive ? "Yes" : "No"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AcademicYearTable;
