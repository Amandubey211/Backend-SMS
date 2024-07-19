import React from 'react'
import { RecentStudentDummyGrade } from "../../studentDummyData/studentDummyData"; // Ensure the path is correct
  
const StudentRecentGradeTable = () => {
    const getColorForStatus = (status) => {
        return status === "Submit"
          ? "text-green-500"
          : status === "Excused"
          ? "text-yellow-500"
          : status === "Missing"
          ? "text-red-500"
          : "text-gray-500"; // Optional: default color for any other status
      };
  return (
    <>
    <div className="py-3">
      <table className="min-w-full py-3 px-5">
        <thead className="bg-gray-200 border-b">
          <tr className="text-left text-gray-500">
            <th className="px-5 py-2">Name</th>
            <th className="px-5 py-2">Module</th>
            <th className="px-5 py-2">Due Date</th>
            {/* <th className="px-5 py-2">Submit Date</th> */}
            <th className="px-5 py-2">Status</th>
            <th className="px-5 py-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {RecentStudentDummyGrade.assessments.map((evalItem, idx) => (
            <tr key={idx} className="bg-white">
              <td className="px-5 py-2 flex flex-col ">
                <span>{evalItem.name}</span>
                <span className="text-xs text-gray-500">{evalItem.type}</span>
              </td>

              <td className="px-5 py-2">
                <div className=" flex flex-col">
                  <span>{evalItem.module}</span>
                  <span className="text-xs text-green-700">{evalItem.chapter}</span>
                </div>
              </td>

              <td className="px-5 py-2">{evalItem.dueDate}</td>
              {/* <td className="px-5 py-2">{evalItem.submittedDate}</td> */}
              <td className="px-5 py-2">
                <span className={`${getColorForStatus(evalItem.status)} font-medium`}>
                  {evalItem.status}
                </span>
              </td>
              <td className="px-5 py-2">{evalItem.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  )
}

export default StudentRecentGradeTable