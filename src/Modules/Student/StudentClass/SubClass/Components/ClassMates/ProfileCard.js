import React from "react";
import { FiUserPlus } from "react-icons/fi";
import { BiChat } from "react-icons/bi"; // Import the discussion icon

const ProfileCard = ({ profile, onClick }) => {
  // Extract the first group only
  const firstGroup = profile.group.split(",")[0].trim();

  return (
    <div className="relative w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4">
      <div
        onClick={() => onClick && onClick(profile)}
        className="block p-6 bg-white rounded-lg border hover:bg-gray-100 hover:shadow-sm duration-150 transition cursor-pointer"
        role="button"
        aria-label={`Profile of ${profile.name}`}
        tabIndex="0"
      >
        {/* Top Right Icon Buttons */}
        {/* <div className="absolute right-4 top-3 flex flex-col gap-2">
          <button
            className="bg-transparent p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
            aria-label="Start a discussion"
          >
            <BiChat className="text-green-500 text-lg" />
          </button>
        </div> */}

        {/* Profile Image */}
        <div className="mb-2 flex flex-col justify-center items-center py-3">
          <img
            className="object-cover rounded-full w-20 h-20 border border-gray-200"
            src={profile.profile}
            alt={`Profile of ${profile.name}`}
          />
        </div>

        {/* Profile Information */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800">
            {profile.name}
          </h3>
          <p className="text-gray-500 mb-2">+{profile.number}</p>
        </div>

        <hr className="my-2" />

        {/* Additional Information */}
        <div className="p-4 text-center ">
          <p className="text-gray-400 text-sm mb-1 font-semibold">
            <span className="">ID: </span>
            {profile.admissionNumber || "N/A"}
          </p>
          <p className="text-gray-600 font-semibold text-md">
            <span className="">Group : </span> {firstGroup}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
