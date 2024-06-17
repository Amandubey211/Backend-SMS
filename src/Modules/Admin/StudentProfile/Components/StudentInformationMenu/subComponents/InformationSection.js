import React from "react";
import InformationItem from "./InformationItem";
import { MdOutlineLocationOn, MdMale, MdTempleHindu, MdEmail, MdBloodtype, MdCake, MdPhone } from "react-icons/md";

const InformationSection = ({ student }) => {
  return (
    <div className="flex flex-col h-full w-full p-2 ">
      <h2 className="text-base font-normal text-gray-600">Student Information</h2>

      <div className="flex flex-row w-full">
<div className="flex-1">
     <InformationItem icon={MdOutlineLocationOn} title="Address" value={student.information.address} />
      <InformationItem icon={MdMale} title="Gender" value={student.information.gender} />
      <InformationItem icon={MdTempleHindu} title="Religion" value={student.information.religion} />
     
     </div>
     <div  className="flex-1">
     <InformationItem icon={MdEmail} title="Email" value={student.information.email} />
      <InformationItem icon={MdBloodtype} title="Blood Group" value="O+" />
      
     </div>
     <div  className="flex-1">  
        <InformationItem icon={MdPhone} title="Phone" value={student.information.phone} />
      <InformationItem icon={MdCake} title="Birthday" value="25th July, 2008" />
   </div>

      </div>
     
     </div>
  );
};

export default InformationSection;
