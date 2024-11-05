import React from "react";
import InformationItem from "./InformationItem";
import { MdOutlinePerson, MdPhone, MdEmail, MdOutlineLocationOn } from "react-icons/md";

const ParentInformation = ({ parents }) => (
  <div className="w-[40%] border-r border-gray-300 p-2">
    <h2 className="text-base font-semibold text-gray-600">Parents Information</h2>
    <InformationItem icon={MdOutlinePerson} title="Father Name" value={parents?.guardianName} />
    <InformationItem icon={MdOutlinePerson} title="Mother Name" value={parents?.motherName} />
    <InformationItem icon={MdPhone} title="Phone" value={parents?.guardianContactNumber} />
    <InformationItem icon={MdEmail} title="Email" value={parents?.
      guardianEmail
    } />
    <InformationItem icon={MdOutlineLocationOn} title="Address" value={`${parents?.permanentAddress?.
      country || '-'}, ${parents?.permanentAddress?.city || ''}, ${parents?.permanentAddress?.
          street || ''}`} />
  </div>
);

export default ParentInformation;
