import React from "react";
import { useNavigate } from "react-router-dom";

const DashCard = ({
  label = "N/A",
  value = 0,
  bgColor = "bg-gray-200",
  textColor = "text-gray-500",
  icon = "📅", 
  iconBackground = "bg-white",
  url="/student_dash'"
}) => {
  const navigate = useNavigate()
  return (
    <div
      className={`p-3 px-6 w-[24%] rounded-lg border ${bgColor} hover:shadow-lg transition-shadow duration-200 cursor-pointer`}
      onClick={()=>{navigate(url)}}
    >
      <div className="flex gap-4 items-center">
        <div className={`p-3 ${iconBackground} ${textColor} rounded-full shadow-2xl text-2xl`}>
          {/* Display the icon as emoji */}
          <span role="img" aria-label={label}>{icon}</span>
        </div>
        <div>
          <div className={`mt-2 ${textColor}`}>{label}</div>
          <div className="text-xl font-semibold">{value}</div>
        </div>
      </div>
    </div>
  );
};

export default DashCard;
