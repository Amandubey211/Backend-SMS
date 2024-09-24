import React from "react";

const DashCard = ({
  label,
  value,
  bgColor,
  textColor,
  icon,
}) => {
  // Debugging to ensure data is coming through
  // console.log("DashCard Props - Label:", label, "Value:", value, "Background:", bgColor, "Text Color:", textColor, "Icon:", icon);

  return (
    <div className={`p-3 px-6 w-[24%] rounded-lg border ${bgColor} hover:shadow-lg transition-shadow duration-200`}>
      <div className="flex gap-4 items-center">
        {/* Icon is displayed */}
        <div className={`p-3 bg-white ${textColor} rounded-full shadow-2xl text-2xl`}>
          {icon}
        </div>
        <div>
          {/* Value and label displayed */}
          <div className="text-xl font-semibold">{value}</div>
          <div className={`mt-2 ${textColor}`}>{label}</div>
        </div>
      </div>
    </div>
  );
};


export default DashCard;
