import React from "react";
import profileImage from "../../../../../../Assets/DashboardAssets/profileIcon.png";
import { AiOutlinePlus } from "react-icons/ai"; // Import an icon to indicate additional groups

const ProfileCard = ({ profile, onClick }) => {
  const groups = profile?.group?.split(",")?.map(group => group.trim()) || [];
  const firstGroup = groups[0]; // First group
  const hasMoreGroups = groups.length > 1;  // Count of additional groups

  return (
    <div className="relative w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4">
      <div
        onClick={onClick}
        className="block p-6 bg-white rounded-lg border hover:bg-gray-100 hover:shadow-sm duration-150 transition cursor-pointer"
        role="button"
        aria-label={`Profile of ${profile.name}`}
        tabIndex="0"
      >
        {/* Profile Image */}
        <div className="mb-2 flex flex-col justify-center items-center py-3">
          <img
            className="object-contain rounded-full w-20 h-20 border border-gray-100"
            src={profile?.profile || profileImage}
            alt={`Profile of ${profile?.name}`}
          />
        </div>

        {/* Profile Information */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800">
            {profile?.name || "name : N/A"}
          </h3>
          <p className="text-gray-500 mb-2">+{profile?.number || "contact : N/A"}</p>
        </div>

        <hr className="my-2" />

        {/* Additional Information */}
        <div className="p-4 text-center">
          {/* <p className="text-gray-400 text-sm mb-1 font-semibold">
            <span>ID: </span>
            {profile?.admissionNumber || "N/A"}
          </p> */}
          <div className="text-gray-600 font-semibold text-md">
            <span>Group: {firstGroup || "N/A"}
            </span>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
