import React from "react";
import { MdOutlineCall, MdEmail, MdOutlinePerson, MdOutlineLocationOn } from "react-icons/md";
import profileIcon from '../../../../Assets/DashboardAssets/profileIcon.png'
const ViewAccountant = ({ finance }) => {
  
  return (
    <div className="flex flex-col">
    <div className="flex flex-col justify-center items-center py-3">
      <img className="object-cover rounded-full w-[100px] h-[100px]" src={finance.profile || profileIcon} alt={finance.name} />
      <h3 className="text-lg font-medium">{finance.name}</h3>
      <p className="text-gray-500">{finance.email}</p>
    </div>
    <div className="flex flex-col">
      <div className="flex h-full p-4 gap-5 items-start">
        <MdOutlineCall className='text-pink-600 text-2xl p-1 border border-pink-200 rounded-full' />
        <div className="flex flex-col justify-center">
          <span className="font-medium">Phone</span>
          <span className="text-gray-500 text-sm">{finance.mobileNumber}</span>
        </div>
      </div>
      <div className="flex h-full p-4 gap-5 items-start">
        <MdOutlineLocationOn className='text-pink-600 text-2xl p-1 border border-pink-200 rounded-full' />
        <div className="flex flex-col justify-center">
          <span className="font-medium">Address</span>
          <span className="text-gray-500 text-sm">{finance.address.city}</span>
        </div>
      </div>

      <div className="flex  h-full p-4 gap-5 items-start ">
       
       <MdOutlineCall className=' text-pink-600 text-2xl p-1 border border-pink-200 rounded-full h-[30px] w-[30px]' />
       <div className="flex flex-col justify-center">
        <span className="font-medium">Gender</span>
        <span className="text-gray-500 text-sm">{finance.gender}</span>
      </div>
    </div>
    <div className="flex  h-full p-4 gap-5 items-start ">
     
       <MdOutlineLocationOn className=' text-pink-600 text-2xl p-1 border border-pink-200 rounded-full h-[30px] w-[30px]' />
       <div className="flex flex-col justify-center">
        <span className="font-medium">Address</span>
        <span className="text-gray-500 text-sm">{finance.address.city}</span>
      </div>
    </div>
    </div>
  </div>
  );
};

export default ViewAccountant;
