import {
  MdOutlineCall,
  MdEmail,
  MdOutlinePerson,
  MdOutlineLocationOn,
  MdCalendarToday,
  MdCardMembership,
  MdWork,
  MdFlag,
  MdTempleHindu,
  MdFamilyRestroom,
} from "react-icons/md";
import { useEffect, useState } from "react";

const iconMap = {
  phone: MdOutlineCall,
  email: MdEmail,
  primaryEmail: MdEmail,
  secondaryEmail: MdEmail,
  child: MdOutlinePerson,
  address: MdOutlineLocationOn,
  idExpiry: MdCalendarToday,
  idNumber: MdCardMembership,
  jobTitle: MdWork,
  nationality: MdFlag,
  religion: MdTempleHindu,
  guardianRelationToStudent: MdFamilyRestroom,
  name: MdOutlinePerson,
};

const getOrdinalSuffix = (day) => {
  if (day % 10 === 1 && day !== 11) return `${day}st`;
  if (day % 10 === 2 && day !== 12) return `${day}nd`;
  if (day % 10 === 3 && day !== 13) return `${day}rd`;
  return `${day}th`;
};

const isValidDate = (dateString) => {
  if (!dateString || typeof dateString !== "string") return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && dateString.includes("T");
};

const formatDate = (dateString) => {
  if (!dateString || !isValidDate(dateString)) return "N/A";
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  return `${getOrdinalSuffix(day)} ${month}, ${year}`;
};

const ParentProfileDetail = ({ type, label, value }) => {
  const IconComponent = iconMap[type] || MdOutlinePerson;
  const formattedValue = isValidDate(value) ? formatDate(value) : value;
  const isEmailType = ["email", "primaryEmail", "secondaryEmail"].includes(type);

  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
  }, []);

  return (
    <div
      className={`flex items-start gap-2 w-full px-1 py-1 rounded-md transition-all duration-300 ease-in-out
        transform ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}
        group hover:bg-gray-50`}
    >
      <IconComponent className="text-pink-600 text-[18px] mt-0.5 flex-shrink-0" />
      <div className="flex flex-col min-w-0 flex-1 max-w-full">
        <span className="text-xs font-semibold text-gray-700 truncate">{label}</span>
        <span
          className={`text-[11px] text-gray-600 leading-snug ${
            isEmailType ? "truncate" : "break-words break-all whitespace-pre-wrap"
          }`}
          title={isEmailType ? formattedValue : ""}
        >
          {formattedValue || "N/A"}
        </span>
      </div>
    </div>
  );
};

export default ParentProfileDetail;
