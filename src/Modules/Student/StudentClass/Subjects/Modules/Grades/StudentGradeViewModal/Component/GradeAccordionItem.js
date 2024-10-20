import React, { useState } from "react";
import {
  MdOutlineQuiz,
  MdAssignment,
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
} from "react-icons/md";

const GradeAccordionItem = ({ grade }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleOpen = () => setIsOpen(!isOpen);
 
  // Ensure grade is an array before sorting and mapping
  // const sortedGrades =  grade?.sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate))
    
  const getColorForStatus = (status) => {
    return status?.toLowerCase() === "submit"
      ? "text-green-500"
      : status?.toLowerCase() === "excused"
      ? "text-yellow-500"
      : status?.toLowerCase() === "missing"
      ? "text-red-500"
      : "text-gray-500";
  };

  return (
    <div className="border-b">
      <div
        className="cursor-pointer py-1 px-2 flex items-center justify-between"
        onClick={toggleOpen}
      >
        <div className="flex items-center gap-2">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTd10fPMHFBu-XhWisAZQlfta8xhF9e_AZ71w&s"
            className="h-8 w-8 rounded-full"
            alt="Profile"
          />
          <span className="font-bold">Grades</span>
        </div>
        <span>
          {isOpen ? (
            <MdKeyboardArrowUp className="border rounded-full text-3xl text-black" />
          ) : (
            <MdKeyboardArrowDown className="border rounded-full text-3xl text-black" />
          )}
        </span>
      </div>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-full" : "max-h-0"
        }`}
      >
        {grade?.length > 0 ? (
          <div className="p-1">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="px-2 py-1">Name</th>
                  <th className="px-2 py-1">Chapter</th>
                  <th className="px-2 py-1">Due Date</th>
                  <th className="px-2 py-1">Submit Date</th>
                  <th className="px-2 py-1">Status</th>
                  <th className="px-2 py-1">Score</th>
                </tr>
              </thead>
              <tbody>
                {grade?.map((evalItem, idx) => (
                  <tr
                    key={idx}
                    className="bg-white hover:bg-gray-100 transition-shadow duration-200 shadow-md rounded-lg mb-2" // Added margin-bottom for spacing
                  >
                    <td className="px-2 py-2">
                      {" "}
                      {/* Increased padding for better spacing */}
                      <span>{evalItem?.Name}</span>
                      <span className="text-xs text-green-400 ml-1">
                        ({evalItem?.type})
                      </span>
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex flex-col">
                        <span className="text-xs" > {evalItem?.chapterName?.slice(0,15)}..</span>
                      </div>
                    </td>
                    <td className="px-2 text-sm py-2">
                      {evalItem?.dueDate ? evalItem?.dueDate?.slice(0, 10) : "N/A"}
                    </td>
                    <td className="px-2 text-sm py-2">
                      {evalItem?.submittedDate
                        ? evalItem?.submittedDate?.slice(0, 10)
                        : "N/A"}
                    </td>
                    <td className="px-2 py-2">
                      <span
                        className={`${getColorForStatus(
                          evalItem?.status
                        )} font-medium`}
                      >
                        {evalItem?.status}
                      </span>
                    </td>
                    <td className="px-2 py-2">{evalItem?.score||0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          isOpen && (
            <div className="p-1 text-center text-gray-500">
              No grades available.
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default GradeAccordionItem;
