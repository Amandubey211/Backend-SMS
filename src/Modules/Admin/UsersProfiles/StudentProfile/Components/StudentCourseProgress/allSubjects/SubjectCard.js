import React, { useEffect, useState } from "react";
import { FaBook } from "react-icons/fa";

const SubjectCard = ({ subject, i }) => {
  const {
    subjectName = "No Subject", // Default subject name
    started = "N/A", // Default started date
    totalModule = 0, // Default total modules
    completedModule = 0, // Default completed modules
    percentageValue = 0, // Default percentage value
  } = subject;

  const [bgColor, setBgColor] = useState("");

  useEffect(() => {
    const colorMap = [
      "green-500", "red-500", "blue-500", "orange-500", "yellow-500", "purple-500",
      "pink-500", "indigo-500", "teal-500", "cyan-500", "amber-500", "lime-500",
      "emerald-500", "fuchsia-500", "rose-500", "violet-500", "sky-500", "slate-500",
      "zinc-500", "neutral-500"
    ];
    setBgColor(colorMap[i]);

  }, [i]);

  return (
    <div
      className="bg-white shadow-md cursor-pointer 
       rounded-lg  flex-none flex flex-col gap-3 p-4"
      
    >
      <div className="flex items-center gap-2">
        <FaBook className="text-[2.2rem] text-pink-400" />
        <div className="flex flex-col">
          <span>{subjectName}</span>
          <span className="text-[12px] text-gray-600">Started: {started !== "N/A" ? started?.slice(0, 10) : "N/A"}</span>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
        <div
          className={`h-1.5 rounded-full bg-${bgColor}`}
          style={{ width: `${percentageValue || 0}%`, }} // Ensure valid width
        ></div>
      </div>
      <div className="flex flex-row justify-between">
        <p className="text-right text-sm text-gray-500">{completedModule}/{totalModule} Modules</p>
        <p className="text-right text-sm text-gray-500">{percentageValue || 0}%</p>
      </div>
    </div>
  );
};

export default SubjectCard;
