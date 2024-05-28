import React from "react";
import StudentDiwanLogo from "../Assets/HomeAssets/StudentDiwanLogo.png";
const Fallback = () => {
  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <img src={StudentDiwanLogo} className="h-20" alt="student diwan " />
    </div>
  );
};

export default Fallback;
