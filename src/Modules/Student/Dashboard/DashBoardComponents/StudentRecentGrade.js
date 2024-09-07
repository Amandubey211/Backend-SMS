import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Spinner from "../../../../Components/Common/Spinner";
import { useNavigate } from "react-router-dom";
import { GoAlertFill } from "react-icons/go";


const StudentRecentGrade = () => {
  const { selectedClass, studentId } = useSelector((state) => state.Common);
  const [gradesData, setGradesData] = useState(null);
  useEffect(() => {
    if (!studentId || !selectedClass) return;

    const fetchGradesData = async () => {
      try {
        const token = localStorage.getItem("student:token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(
          `http://localhost:8080/admin/grades/student/${studentId}/class/${selectedClass}`,
          {
            headers: {
              Authentication: token,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch grades, status: ${response.status}`);
        }

        const data = await response.json();
        setGradesData(data.grades || []); // Assuming 'grades' is the key in the response
      } catch (error) {
        console.error("Error fetching grades data:", error);
      }
    };

    fetchGradesData();
  }, [studentId, selectedClass]);

  const getColorForStatus = (status) => {
    return status === "Submit"
      ? "text-green-500"
      : status === "Excused"
        ? "text-yellow-500"
        : status === "Missing"
          ? "text-red-500"
          : "text-gray-500"; // Optional: default color for any other status
  };

  if (!gradesData) {
    return <div className="flex text-gray-500  items-center justify-center">
      <GoAlertFill className="text-[5rem]" />
      No  Data Found
    </div>;
  }
  const sortedGrades = gradesData?.sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate)).slice(0, 5);

  return (
    <div className="py-3">
      <table className="min-w-full py-3 px-5">
        <thead className="bg-gray-200 border-b">
          <tr className="text-left text-gray-500">
            <th className="px-5 py-2">Name</th>
            <th className="px-5 py-2">Module</th>
            <th className="px-5 py-2">Submit Date</th>
            <th className="px-5 py-2">Status</th>
            <th className="px-5 py-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {sortedGrades?.map((evalItem, idx) => (
            <tr key={idx} className="bg-white">
              <td className="px-5 py-2 flex flex-col">
                <span>{evalItem.Name}</span>
                <span className="text-xs text-gray-500">{evalItem.type}</span>
              </td>

              <td className="px-5 py-2">
                <div className="flex flex-col">
                  <span>{evalItem.moduleName}</span>
                  <span className="text-xs text-green-700">
                    {evalItem.chapterName}
                  </span>
                </div>
              </td>

              <td className="px-5 py-2">{evalItem?.submittedDate?.slice(0, 10)}</td>
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
  );
};

export default StudentRecentGrade;
