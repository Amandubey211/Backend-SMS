import React, { useEffect, useState } from "react";
import { FaBook } from "react-icons/fa";

const SubjectCard = ({ subject, i }) => {
  const {
    subjectName = "No Subject", // Default subject name
    started = "N/A", // Default started date
    totalModule = 0, // Default total modules
    completedModule = 0, // Default completed modules
    percentageValue = 0, // Default percentage value
    subjectIcon = null,
    subjectColor
  } = subject;

  return (
    <div
      className="bg-white shadow-md cursor-pointer 
       rounded-lg  flex-none flex flex-col gap-3 p-4"

    >
      <div className="flex items-center gap-2">
        {
          subjectIcon ? <img src={subjectIcon} className="h-[50px]" /> :
            <FaBook className="text-[2.2rem] text-pink-400" />
        }
        <div className="flex flex-col">
          <span>{subjectName}</span>
          <span className="text-[12px] text-gray-600">Started: {started !== "N/A" ? started?.slice(0, 10) : "N/A"}</span>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
        <div
          className={`h-1.5 rounded-full`}
          style={{ width: `${percentageValue || 0}%`, backgroundColor: subjectColor }} // Ensure valid width
        ></div>
      </div>
      <div className="flex flex-row justify-between">
        <p className="text-right text-sm text-black">{completedModule}/{totalModule} Modules</p>
        <p className="text-right text-sm text-black border-2 rounded-md p-1" style={{ borderColor: subjectColor }}>{percentageValue || 0}%</p>
      </div>
    </div>
  );
};

export default SubjectCard;
