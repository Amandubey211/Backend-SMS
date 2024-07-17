
import React from "react";
import { FiUserPlus } from 'react-icons/fi';
import { BiTrash } from 'react-icons/bi';
const ProfileCard = ({ profile }) => {
  return (
    <div className=" relative w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4">
      <div
        className="block p-6 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition cursor-pointer"
      >

        <div className="mb-2 flex flex-col h-[80%] justify-center items-center py-3 ">

          <div className="mb-1 bg-gray-300 flex justify-center items-center text-center rounded-full w-[100px] h-[100px] overflow-hidden">
            <img className="object-cover rounded-full w-full h-full" src={profile.imageUrl} alt={profile.name} />
          </div>
          <h3 className="text-lg font-medium">{profile.name}</h3>
          <p className="text-gray-500">{profile.subject}</p>
        </div>
        <hr />
        <div className="p-4 text-center justify-center items-center ">
          <p className="text-gray-600 mt-2 mb-1">Phone</p>
          <p className="font-semibold">{profile.phone}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
