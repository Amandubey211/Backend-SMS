import React from "react";
import { FaRegCalendarAlt } from "react-icons/fa";

const DateDetail = ({ label, value }) => (
  <div className="mt-4">
    <div className="flex items-center justify-between p-3 px-4 border rounded-full border-gray-300 text-gray-600">
      <div className="flex items-center">
        <FaRegCalendarAlt className="mr-2" aria-hidden="true" />
        <p className="text-sm font-medium">{label} :</p>
      </div>
      <p className="text-sm font-normal text-gray-900">
        {value || "MM/DD/YYYY"}
      </p>
    </div>
  </div>
);

export default DateDetail;
