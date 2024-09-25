import React from "react";
import profileImage from '../../../../../../Assets/DashboardAssets/profileIcon.png'
const ProfileCard = ({ profile, onClick }) => {
  return (
    <div onClick={onClick} className=" relative w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4">
      <div
        className="block p-6 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition cursor-pointer"
      >
        <div className="mb-2 flex flex-col h-[80%] justify-center items-center py-3 ">
          <div className="mb-1 bg-gray-300 flex justify-center items-center text-center rounded-full w-[100px] h-[100px] border border-grey-100">
            <img className="object-cover rounded-full w-full h-full object-contain" src={profile?.profile || profileImage} alt={profile?.name} />
          </div>
          <h3 className="text-lg font-medium">{profile?.name}</h3>
          <p className="text-gray-500">{profile?.subject || "N/A"}</p>
        </div>
        <hr />
        <div className="p-4 text-center justify-center items-center ">
          <p className="text-gray-600 mt-2 mb-1">Phone</p>
          <p className="font-semibold">{profile?.phone || "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
