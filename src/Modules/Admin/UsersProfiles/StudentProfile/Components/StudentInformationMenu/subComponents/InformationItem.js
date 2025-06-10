import React from "react";


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
  return !isNaN(date.getTime()) && dateString.includes("T");
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

const InformationItem = ({ icon: Icon, title, value }) => {


  // Format the value if it's a date string
  const formattedValue = isValidDate(value) ? formatDate(value) : value;

  return (
    <div className="p-3 flex justify-start items-center gap-3">
      <Icon className="text-pink-600 text-2xl p-1 border border-pink-200 rounded-full h-[30px] w-[30px] flex-shrink-0" />
      <div className="flex flex-col justify-center w-full max-w-[200px] sm:max-w-[250px] lg:max-w-[300px] overflow-hidden">
        <span className="font-medium truncate">{title || "N/A"}</span>
        <span className="text-gray-500 text-sm break-words">{formattedValue || "N/A"}</span>
      </div>
    </div>
  );
};

export default InformationItem;