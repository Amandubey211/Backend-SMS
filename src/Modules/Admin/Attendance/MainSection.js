import React from "react";
import { navData } from "./Components/Data/NavData";
import DashCard from "../Dashboard/Dashcard";

const MainSection = () => {
  return (
    <div className="p-2">
      <div className="flex items-center justify-between mb-6 ">
        <h2 className="text-xl font-semibold text-gradient text-purple-600">
          Student Attendance
        </h2>
        <button className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md shadow-lg">
          Take Attendance
        </button>
      </div>
      <div className="flex justify-around ">
        {navData.map((item, index) => {
          return <DashCard key={index} {...item} />;
        })}
      </div>
    </div>
  );
};

export default MainSection;
