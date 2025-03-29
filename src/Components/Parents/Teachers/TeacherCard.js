import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import { truncateText } from "../../../Utils/helperFunctions";
import profileIcon from "../../../Assets/DashboardAssets/profileIcon.png";

// Helper function to truncate text if it's too long

const TeacherCard = ({ instructor }) => {
  const { t } = useTranslation("prtNotices");

  return (
    <div className="relative w-full md:w-64 rounded-md shadow border border-gray-300 p-6 m-4 flex flex-col items-center bg-white hover:shadow-lg">
      <div className="w-full flex flex-col items-center">
        {/* Profile Image */}
        <div className="w-28 h-28 rounded-full border-2 border-gray-300 overflow-hidden mt-2 mb-4 flex items-center justify-center">
          <img
            className="w-full h-full object-cover rounded-full p-1"
            src={instructor?.image || profileIcon}
            alt={`${instructor?.name || "Instructor"}'s photo`}
            loading="lazy"
            onError={(e) =>
              (e.currentTarget.src =
                "https://cdn-icons-png.flaticon.com/512/149/149071.png")
            }
          />
        </div>

        {/* Instructor Details */}
        <div className="text-center">
          <h2 className="text-gray-900 text-xl font-bold mb-1">
            {truncateText(instructor?.name || "N/A", 20)}
          </h2>
          <p className="text-gray-600 text-sm font-medium">
            {truncateText(instructor?.department || "N/A", 20)}
          </p>
        </div>

        {/* Contact Information */}
        <div className="w-full border-t border-gray-200 mt-4 pt-3 flex flex-col items-center">
          <span className="text-gray-600 font-semibold text-sm">Phone</span>
          <span className="text-gray-900 text-md mt-1">
            {truncateText(instructor?.phone || "N/A", 20)}
          </span>
        </div>
      </div>
    </div>
  );
};

// Memoize to prevent unnecessary re-renders
export default memo(TeacherCard);
