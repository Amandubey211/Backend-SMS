import React from "react";
import { useNavigate } from "react-router-dom";

const DashCard = ({
  label = "N/A",
  value = 0,
  bgColor = "bg-gray-200",
  textColor = "text-gray-500",
  pentagonColor = "bg-gray-800",
  icon = "📅",
  iconBackground = "bg-white",
  url = "/student_dash",
}) => {
  const navigate = useNavigate();
  return (
    <div
      className={`py-6  w-[23%] rounded-md ${bgColor} hover:shadow-lg transition-shadow duration-200 ${
        label === "Upcoming Exams" ? "" : "cursor-pointer"
      }`}
      onClick={() => {
        navigate(url);
      }}
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <div
          className={`flex items-center justify-center ${pentagonColor} text-white`}
          style={{
            clipPath:
              "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            width: "32px", // Reduced size
            height: "37px", // Reduced size
          }}
        >
          <span role="img" aria-label={label} className="text-lg">
            {icon}
          </span>
        </div>
        <div className="text-center">
          <div className={`text-sm font-semibold ${textColor}`}>{label}</div>
          <div className="text-xl font-semibold">{value}</div>
        </div>
      </div>
    </div>
  );
};

export default DashCard;
