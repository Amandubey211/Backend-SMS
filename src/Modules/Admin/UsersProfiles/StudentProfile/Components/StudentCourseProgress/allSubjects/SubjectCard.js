import React, { useEffect, useState } from "react";
import { FaBook } from "react-icons/fa";
const SubjectCard = ({ subject, i }) => {
  const { name, startDate, modules, completedModules, progress } = subject;
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
      className="bg-white shadow-lg hover:shadow-2xl cursor-pointer 
       rounded-lg p-4  flex-none border border-gray-300 flex flex-col gap-3"
      style={{ width: "265px" }}
    >
      <div className="flex items-center gap-2">
      <FaBook className="text-[2.2rem] text-pink-400" />
        <div className="flex flex-col">
          <span>{name}</span>
          <span className="text-[12px] text-gray-600">Started: {startDate}</span>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
        <div
          className={`h-1.5 rounded-full bg-${bgColor}`}
          style={{ width: `${progress}%`, }}
        ></div>
      </div>
      <div className="flex flex-row justify-between">
        <p className="text-right text-sm text-gray-500">{completedModules||0}/{modules?.length} Modules</p>
        <p className="text-right text-sm text-gray-500">{completedModules} Completed</p>
      </div>
    </div>
  );
};

export default SubjectCard;
