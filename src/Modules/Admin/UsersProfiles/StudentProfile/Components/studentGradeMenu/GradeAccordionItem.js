import React, { useState } from "react";
import {
  MdOutlineQuiz,
  MdAssignment,
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
} from "react-icons/md";

const GradeAccordionItem = ({ grade }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);
  const getIconForType = (type) => {
    switch (type) {
      case "Quiz":
        return (
          <MdOutlineQuiz style={{ marginRight: 8 }} className="text-blue-500" />
        );
      case "Assignment":
        return (
          <MdAssignment style={{ marginRight: 8 }} className="text-green-500" />
        );
      default:
        return null;
    }
  };

  const getColorForStatus = (status) => {
    return status === "Completed" ? "text-green-500" : "text-red-500";
  };
  return (
    <div className=" border-b p-3">
      <div
        className="cursor-pointer py-3 px-5  flex  items-center justify-between "
        onClick={toggleOpen}
      >
        <div className="flex  justify-center items-center gap-3">
          <img
            src="https://via.placeholder.com/50"
            className=" h-10 w-10 rounded-full"
          />
          <span className="font-bold">{grade.subject}</span>
        </div>

        <span>
          {isOpen ? (
            <MdKeyboardArrowUp className="border rounded  text-black" />
          ) : (
            <MdKeyboardArrowDown />
          )}
        </span>
      </div>
      {isOpen && (
        <div className="p-3 ">
          <table className="min-w-full  py-3 px-5">
            <thead className="border-b">
              <tr className="text-left">
                <th className="px-5 py-2">Name</th>
                <th className="px-5 py-2">Due Date</th>
                <th className="px-5 py-2">Submit Date</th>
                <th className="px-5 py-2">Status</th>
                <th className="px-5 py-2">Score</th>
              </tr>
            </thead>
            <tbody>
              {grade.evaluations.map((evalItem, idx) => (
                <tr key={idx} className="bg-white">
                  {/* <td className="px-5 py-2">{evalItem.name}</td> */}
                  <td className="px-5 py-2 flex items-center">
                    {getIconForType(evalItem.type)}
                    <span>{evalItem.name}</span>
                  </td>
                  <td className="px-5 py-2">{evalItem.dueDate}</td>
                  <td className="px-5 py-2">{evalItem.submitDate}</td>
                  {/* <td className="px-5 py-2">{evalItem.status}</td> */}
                  <td className="px-5 py-2">
                    <span
                      className={`${getColorForStatus(
                        evalItem.status
                      )} font-medium `}
                    >
                      {" "}
                      {evalItem.status}{" "}
                    </span>
                  </td>
                  <td className="px-5 py-2">{evalItem.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GradeAccordionItem;
