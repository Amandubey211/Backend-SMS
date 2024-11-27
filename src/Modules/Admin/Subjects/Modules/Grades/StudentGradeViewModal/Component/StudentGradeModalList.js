import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { useSelector } from "react-redux";

const getStatusClass = (status) => {
  switch (status) {
    case "Submit":
      return "text-green-700";
    case "Excused":
      return "text-yellow-500";
    case "Missing":
      return "text-red-700";
    default:
      return "text-gray-500";
  }
};

const sortData = (data, arrangeBy) => {
 
  
  if (arrangeBy) {
    return data.sort((a, b) => {
      if (a.type === arrangeBy && b.type !== arrangeBy) {
        return -1;
      }
      if (a.type !== arrangeBy && b.type === arrangeBy) {
        return 1;
      }
      return 0;
    });
  }
  return data;
};

const StudentModalGradeList = ({ data, filters }) => {

  const filteredData = data?.filter((item) => {
    return filters.status ? item.status === filters.status : true;
  })
  if (data?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-500">
        <FaExclamationTriangle className="w-12 h-12 mb-3" />
        <p className="text-lg font-semibold">No data found</p>
      </div>
    );
  }

  const getBoldClass = (item) => {
    const isBold =
      (filters.arrangeBy && item.type === filters.arrangeBy) ||
      (filters.module && item.module === filters.module) ||
      (filters.chapter && item.chapter === filters.chapter) ||
      (filters.status && item.status === filters.status);
    return isBold ? "font-bold bg-purple-50" : "";
  };

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
          {filteredData?.map((item, index) => (
            <tr key={index}>
              <td className={`px-6 py-4 whitespace-nowrap ${getBoldClass(item)}`}>
                <div className="text-sm text-gray-900">{item.Name}</div>
                <div className="text-sm ">{item.type}</div>
              </td>
              <td className={`px-6 py-4 whitespace-nowrap ${getBoldClass(item)}`}>
                <div className="text-sm text-gray-900">{item.moduleName}</div>
                {/* <div className="text-sm text-green-500">{item.chapterId}</div> */}
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${getBoldClass(item)}`}>{item.dueDate?.slice(0,10)}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${getBoldClass(item)}`}>{item.submittedDate?item.submittedDate?.slice(0,10):item.createAt?.slice(0,10)}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm ${getBoldClass(item)} ${getStatusClass(item?.status)}`}>{item.status}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${getBoldClass(item)}`}>{item?.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentModalGradeList;
