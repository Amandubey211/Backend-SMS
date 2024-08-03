
import React from "react";
import { FiUserPlus } from 'react-icons/fi';
import { BiTrash } from 'react-icons/bi';
import useDeleteUser from "../../../../Hooks/AuthHooks/Staff/Admin/staff/useDeleteUser";
import profileIcon from '../../../../Assets/DashboardAssets/profileIcon.png'
const ProfileCard = ({ profile, onClick,editUser}) => {
  const {deleteUser} = useDeleteUser()
  const deleteTeacher = (event,id)=>{
    deleteUser(id)
    event.stopPropagation();
   
   };
 

  return (
    <div className="relative w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4">
      
      <div onClick={() => onClick(profile)}
        className="block p-6 bg-white rounded-lg hover:shadow-lg  transition cursor-pointer border"
      >
        <div className="absolute right-0 top-0 flex flex-col px-4 py-2 gap-2 justify-start">
          <button className="bg-transparent p-2 rounded-full border hover:bg-gray-200 transition" onClick={(event)=>editUser(event,profile)}>
            <FiUserPlus className="text-sm text-green-500" />
          </button>
          <button className="bg-transparent p-2 rounded-full border hover:bg-gray-200 transition">
            <BiTrash className="text-sm text-red-500" onClick={(event)=>deleteTeacher(event,profile._id)} />
          </button>
        </div>
        <div className="flex flex-col h-[80%] justify-center items-center py-3">
          <img className="object-cover rounded-full w-[100px] h-[100px] border" src={profile?.profile || profileIcon } alt={profile.firstName} />
          <h3 className="text-lg font-medium">{profile.firstName} {profile.lastName}</h3>
          <p className="text-gray-500">{profile.position}</p>
        </div>
        <div className="p-4 text-center justify-center items-center border-t-2">
          <p className="text-gray-600">Phone: {profile.mobileNumber}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
