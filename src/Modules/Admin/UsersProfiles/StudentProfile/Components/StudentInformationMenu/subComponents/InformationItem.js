import React from "react";
import { MdOutlineLocationOn, MdMale, MdEmail, MdBloodtype, MdCake, MdPhone } from "react-icons/md";

// A generic information item component
const InformationItem = ({ icon: Icon, title, value }) => (
  <div className="p-3 flex justify-start items-center gap-6">
    <Icon className="text-pink-600 text-2xl p-1 border border-pink-200 rounded-full h-[30px] w-[30px]" />
    <div className="flex flex-col justify-center">
      <span className="font-medium">{title || 'N/A'}</span>
      <span className="text-gray-500 text-sm">{value || 'N/A'}</span>
    </div>
  </div>
);

export default InformationItem;
