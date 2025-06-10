import React from "react";
import {
  MdOutlineCall, MdEmail, MdOutlinePerson, MdOutlineLocationOn,
  MdCalendarToday, MdCardMembership, MdWork, MdFlag, MdTempleHindu,
  MdFamilyRestroom
} from "react-icons/md";

const iconMap = {
  phone: MdOutlineCall,
  email: MdEmail,
  child: MdOutlinePerson,
  address: MdOutlineLocationOn,
  idExpiry: MdCalendarToday,
  idNumber: MdCardMembership,
  jobTitle: MdWork,
  nationality: MdFlag,
  religion: MdTempleHindu,
  guardianRelationToStudent: MdFamilyRestroom,
  name: MdOutlinePerson
};

// Function to add ordinal suffix to the day (e.g., 1st, 2nd, 3rd, 4th)
const getOrdinalSuffix = (day) => {
  if (day % 10 === 1 && day !== 11) return `${day}st`;
  if (day % 10 === 2 && day !== 12) return `${day}nd`;
  if (day % 10 === 3 && day !== 13) return `${day}rd`;
  return `${day}th`;
};

// Function to check if a string is a valid date
const isValidDate = (dateString) => {
  if (!dateString || typeof dateString !== "string") return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && dateString.includes("T"); // Check for ISO format with 'T'
};

// Function to format the date as "25th July, 2025"
const formatDate = (dateString) => {
  if (!dateString || !isValidDate(dateString)) return "N/A";

  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  return `${getOrdinalSuffix(day)} ${month}, ${year}`;
};

const ParentProfileDetail = ({ type, label, value }) => {
  const IconComponent = iconMap[type] || MdOutlinePerson; // Fallback to person icon if type not found

  // Format the value if it's a date string
  const formattedValue = isValidDate(value) ? formatDate(value) : value;

  return (
    <div className="flex items-center gap-3 w-full">
      <IconComponent className="text-pink-600 text-xl border border-pink-200 rounded-full h-8 w-8 p-1 flex-shrink-0" />
      <div className="flex flex-col justify-center min-w-0 flex-1">
        <span className="font-medium truncate">{label}</span>
        <span className="text-gray-500 text-sm break-words">{formattedValue || "N/A"}</span>
      </div>
    </div>
  );
};

export default ParentProfileDetail;