import React, {memo} from "react";

const DashCard = ({
  label,
  value = 0, // Set a default value of 0
  bgColor,
  textColor,
  icon,
  iconBackground,
  // url,
}) => {
  return (
    <div
      // to={url}
      className={`p-3 px-6 w-[24%] rounded-lg border ${bgColor} hover:shadow-lg transition-shadow duration-200`}
    >
      <div className="flex gap-4 items-center">
        <div
          className={`p-3 bg-white ${textColor} rounded-full text-2xl`}
        >
          {icon}
        </div>
        <div>
          <div className="text-xl font-semibold">{value}</div>
          <div className={`mt-2 ${textColor}`}>{label}</div>
        </div>
      </div>
    </div>
  );
};

export default memo(DashCard);
