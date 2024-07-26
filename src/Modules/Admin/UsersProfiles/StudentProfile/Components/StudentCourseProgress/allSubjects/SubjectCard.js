import React, { useEffect, useState } from "react";

const SubjectCard = ({ subject,i}) => {
  const { name, startDate, totalModules, completedModules, progress } = subject;
  const [bgColor,setBgColor] =useState('')
  useEffect(() => {
    console.log(i);
  
    // Map of colors for each value from 1 to 6
    const colorMap = {
      1: 'green',
      2: 'red',
      3: 'blue',
      4: 'orange',
      5: 'yellow',
      6: 'red',
      7: 'purple',
      8: 'cyan',
      9: 'magenta',
      10: 'lime',
    };
    setBgColor(colorMap[1]); 
  
  }, []); 
  
  return (
    <div
      className="bg-white shadow-lg hover:shadow-2xl cursor-pointer 
       rounded-lg p-4  flex-none border border-gray-300 flex flex-col gap-3"
      style={{ width: "265px" }}
    >
      {/* <h3 className="text-xl font-semibold">{name}</h3>
      <p className="text-gray-500">Started: {startDate}</p>
      <p className="text-gray-500">{completedModules}/{totalModules} Modules</p> */}

      <div className="flex items-center gap-2">
        <img
          src="https://plus.unsplash.com/premium_photo-1666900440561-94dcb6865554?q=80&w=1854&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA/3D/3D"
          alt="Profile"
          className="h-10 w-10 mr-2 rounded-lg "
        />
        <div className="flex flex-col">
          <span>{name}</span>
          <span className="text-[12px] text-gray-600">Started: {startDate}</span>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
        <div
          className={`bg-blue-600 h-1.5 rounded-full`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="flex flex-row justify-between">
        <p className="text-right text-sm text-gray-500">17/5 Module</p>
      <p className="text-right text-sm text-gray-500">{progress}/ Completed</p></div>
    </div>
  );
};

export default SubjectCard;
