import React from "react";
import { MdOutlineCall, MdEmail, MdOutlineLocationOn, MdOutlinePerson } from "react-icons/md";

const ViewStaff = ({ staff }) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col justify-center items-center py-3">
        <img className="object-cover rounded-full w-[100px] h-[100px]" src={staff.profile} alt={staff.name} />
        <h3 className="text-lg font-medium">{staff.firstName}</h3>
        <p className="text-gray-500">{staff.email}</p>
      </div>
      <div className="flex flex-col gap-4 p-4">
        <InfoItem icon={<MdEmail className="text-pink-600 text-2xl"/>} label="Email" value={staff.email} />
        <InfoItem icon={<MdOutlineCall className="text-pink-600 text-2xl"/>} label="Phone" value={staff.phone} />
        <InfoItem icon={<MdOutlinePerson className="text-pink-600 text-2xl"/>} label="Gender" value={staff.gender} />
        <InfoItem icon={<MdOutlineLocationOn className="text-pink-600 text-2xl"/>} label="Address" value={staff.address.city} />
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    {icon}
    <div className="flex flex-col">
      <span className="font-medium">{label}</span>
      <span className="text-gray-500 text-sm">{value}</span>
    </div>
  </div>
);

export default ViewStaff;
