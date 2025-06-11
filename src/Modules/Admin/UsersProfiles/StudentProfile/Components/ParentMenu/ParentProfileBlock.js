import React from "react";
import { MdMarkChatUnread } from "react-icons/md";
import ParentProfileDetail from "./ParentProfileDetail";

const ParentProfileBlock = ({ title, imageSrc, name, details }) => {
  return (
    <div className="flex flex-col h-auto p-4 border border-gray-300 rounded-lg w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
          {title}
        </h2>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Image and Name Section (Right) */}
        {title !== 'Guardian Details' && (
          <div className="p-3 flex flex-col justify-center items-center gap-2 lg:w-[100px] flex-shrink-0">
            <img
              src={imageSrc}
              alt={`${title} Image`}
              className="rounded-full w-[50px] h-[50px] object-cover"
            />
            <span className="font-semibold text-center">{name}</span>

          </div>
        )}
        {/* Details Section (Left) */}
        <div className="flex-1">
          <div className="flex flex-wrap gap-3">
            {details?.map((detail) => (
              <div key={detail.type} className="flex-1 min-w-[150px] max-w-[180px]">
                <ParentProfileDetail
                  type={detail.type}
                  label={detail.label}
                  value={detail.value}
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ParentProfileBlock;