import React from "react";
import { GoAlertFill } from "react-icons/go";

const StudentGradeTable = ({ grades, getColorForStatus }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg border">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2 text-gray-600 font-semibold">Name</th>
            <th className="px-4 py-2 text-gray-600 font-semibold">Module</th>
            <th className="px-4 py-2 text-gray-600 font-semibold">Due Date</th>
            <th className="px-4 py-2 text-gray-600 font-semibold">Submitted Date</th>
            <th className="px-4 py-2 text-gray-600 font-semibold">Status</th>
            <th className="px-4 py-2 text-gray-600 font-semibold">Score / Max</th>
          </tr>
        </thead>
        <tbody>
          {grades.length > 0 ? (
            grades.map((item, idx) => (
              <tr
                key={idx}
                className="border-b last:border-none hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 text-gray-700">{item?.Name}</td>
                <td className="px-4 py-3 text-gray-700">{item?.moduleName || "-"}</td>
                <td className="px-4 py-3 text-gray-700">
                  {item?.dueDate ? item.dueDate.slice(0, 10) : "-"}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {item?.submittedDate ? item.submittedDate.slice(0, 10) : "-"}
                </td>
                <td className="px-4 py-3">
                  <span className={`${getColorForStatus(item?.status)} font-medium`}>
                    {item?.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-700 text-center">
                  {item?.score} / {item?.maxMarks ?? 0}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-5 py-5 text-center" colSpan={6}>
                <div className="flex flex-col items-center text-gray-500">
                  <GoAlertFill className="text-3xl mb-2 text-gray-400" />
                  <span className="font-medium text-sm">No Data Found</span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentGradeTable;
