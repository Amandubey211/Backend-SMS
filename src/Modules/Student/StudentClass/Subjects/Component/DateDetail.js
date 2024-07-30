import React from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { format } from "date-fns";

const DateDetail = ({ label, value, labelAbove = false }) => {
  const formattedDate = format(new Date(value), "dd/MM/yyyy");

  return (
    <div className="mt-4">
      {labelAbove ? (
        <>
          <p className="text-sm text-gray-600 mb-2">{label}</p>
          <div className="flex items-center p-3 text-green-500 text-sm font-medium border rounded-full border-gray-300">
            <FaRegCalendarAlt className="mr-2" aria-hidden="true" />
            <p className="font-semibold">{formattedDate}</p>
          </div>
        </>
      ) : (
        <div className="flex items-center p-3 text-green-500 text-sm font-medium">
          <FaRegCalendarAlt className="mr-2" aria-hidden="true" />
          <p>{label} :</p>
          <p className="ml-2 font-semibold">{formattedDate}</p>
        </div>
      )}
    </div>
  );
};

export default DateDetail;
