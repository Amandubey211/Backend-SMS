import React from "react";
import { MdOutlineCall, MdEmail, MdOutlinePerson, MdOutlineLocationOn } from "react-icons/md";

const iconMap = {
  phone: MdOutlineCall,
  email: MdEmail,
  child: MdOutlinePerson,
  address: MdOutlineLocationOn,
};

const ParentProfileDetail = ({ type, label, value }) => {
  const IconComponent = iconMap[type];

  return (
    <div className="flex flex-1 justify-start items-center gap-6 ">
      <IconComponent className="text-pink-600 text-2xl p-1 border border-pink-200 rounded-full h-[30px] w-[30px]" />
      <div className="flex flex-col justify-center">
        <span className="font-medium">{label}</span>
        <span className="text-gray-500 text-sm">{value}</span>
      </div>
    </div>
  );
};

export default ParentProfileDetail;
