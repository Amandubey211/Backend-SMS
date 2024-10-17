import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import profileImage from "../../../../../../Assets/DashboardAssets/profileIcon.png";
import { MdOutlineCall} from "react-icons/md";
import { GiBlackBook } from "react-icons/gi";
const TeacherModal = ({ teacher }) => {
  console.log('---',teacher);
  return (
    <div className="flex flex-col">
    <div className="flex flex-col justify-center items-center py-3">
      <img className="object-cover rounded-full w-[100px] h-[100px]" src={teacher?.profile || profileImage} alt={teacher?.name} />
      <h3 className="text-lg font-medium">{teacher?.name}</h3>
    </div>
    <div className="flex flex-col gap-4 p-4">
   
      <InfoItem icon={<MdOutlineCall className="text-pink-600 text-2xl"/>} label="Phone" value={teacher?.phone} />
      <InfoItem icon={<GiBlackBook className="text-pink-600 text-2xl"/>} label="subject" value={teacher?.subject} />
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
export default TeacherModal;
