import React from "react";
import { MdFamilyRestroom } from "react-icons/md";
import ParentProfileDetail from "./ParentProfileDetail";

const ParentProfileBlock = ({
  title,
  imageSrc,
  name,
  details,
  accentColor = "from-gray-500 to-gray-700",
}) => {
  const isGuardian = title.toLowerCase().includes("guardian");

  return (
    <div className="w-full border rounded-md shadow-sm overflow-hidden">
      {/* Strip Header */}
      <div
        className={`px-4 py-2 text-white font-semibold text-base bg-gradient-to-r ${accentColor}`}
      >
        {title}
      </div>

      {/* Content */}
      <div className="flex flex-col lg:flex-row gap-4 p-4">
        {/* Avatar or Icon + Name */}
        <div className="flex flex-col items-center gap-2 lg:w-[160px]">
          {isGuardian ? (
            <MdFamilyRestroom className="text-5xl text-pink-600" />
          ) : (
            <img
              src={imageSrc}
              alt={`${title} Image`}
              className="rounded-full h-28 w-28 object-cover border"
            />
          )}
          <span className="font-semibold text-center text-sm">{name}</span>
        </div>

        {/* Details Grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {details?.map((detail) => (
            <ParentProfileDetail
              key={detail.label + detail.type}
              type={detail.type}
              label={detail.label}
              value={detail.value}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParentProfileBlock;
