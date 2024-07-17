import React from "react";
import { FiUserPlus } from 'react-icons/fi';
import { BiTrash } from 'react-icons/bi';

const ProfileCard = ({ profile, onClick }) => {
  return (
    <div className="relative w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4">
      <div onClick={() => onClick && onClick(profile)}
        className="block p-6 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition cursor-pointer"
      >
        <div className="absolute right-0 top-0 flex flex-col px-4 py-2 gap-2 justify-start">
          {onClick && (
            <>
              <button className="bg-transparent p-2 rounded-full border hover:bg-gray-200 transition">
                <FiUserPlus className="text-sm text-green-500" />
              </button>
              <button className="bg-transparent p-2 rounded-full border hover:bg-gray-200 transition">
                <BiTrash className="text-sm text-red-500" />
              </button>
            </>
          )}
        </div>
        <div className="mb-2 flex flex-col h-[80%] justify-center items-center py-3">
          <img className="object-cover rounded-full w-[100px] h-[100px]" src={profile.profile} alt={profile.name} />
          <h3 className="text-lg font-medium">{profile.name}</h3>
          <p className="font-semibold">{profile.number}</p>
          
          
        </div>
          <hr/>
         <div className="p-4 text-center justify-center items-center ">
          <p className="text-gray-600 mt-2 mb-1">ID: {profile.admissionNumber}</p>
          <p><span className="font-bold">Group:</span> {profile.group}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
