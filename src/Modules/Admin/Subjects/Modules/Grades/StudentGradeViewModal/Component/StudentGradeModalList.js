import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const getStatusClass = (status) => {
  switch (status) {
    case "Submit":
      return "text-green-500";
    case "Excused":
      return "text-yellow-500";
    case "Missing":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

const sortData = (data, arrangeBy) => {
  if (arrangeBy === "name") {
    return [...data].sort((a, b) => a.name.localeCompare(b.name));
  } else if (arrangeBy === "module") {
    return [...data].sort((a, b) => a.module.localeCompare(b.module));
  } else if (arrangeBy === "dueDate") {
    return [...data].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  } else {
    return data;
  }
};

const StudentModalGradeList = ({ data, filters }) => {
  const filteredData = data.filter((item) => {
    return (
      (filters.module ? item.module === filters.module : true) &&
      (filters.chapter ? item.chapter === filters.chapter : true) &&
      (filters.status ? item.status === filters.status : true)
    );
  });

  const sortedData = sortData(filteredData, filters.arrangeBy);

  if (sortedData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-500">
        <FaExclamationTriangle className="w-12 h-12 mb-3" />
        <p className="text-lg font-semibold">No data found</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <table className="min-w-full border divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.map((item, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{item.name}</div>
                <div className="text-sm text-gray-500">{item.type}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{item.module}</div>
                <div className="text-sm text-green-500">{item.chapter}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.dueDate}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.submittedDate}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm ${getStatusClass(item.status)}`}>{item.status}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentModalGradeList;
