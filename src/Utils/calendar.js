import React, { useState } from "react";
import Calendar from "react-calendar";

function DatePicker({ startDate = new Date(), setStartDate = new Date() }) {
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div className="relative">
      <label className="block text-gray-700">Start Date</label>
      <input
        type="text"
        value={startDate ? startDate.toDateString() : ""}
        onClick={() => setShowCalendar(!showCalendar)}
        readOnly
        className="mt-1 block w-full px-3 py-2 border focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md cursor-pointer"
      />
      {showCalendar && (
        <div className="bg-gray-100 absolute -top-4 -left-9 z-50 shadow-lg rounded-md scale-75">
          <Calendar
            className="shadow-lg rounded-md px-4"
            onChange={(date) => {
              setStartDate(date);
              setShowCalendar(false); // Close calendar after selection
            }}
            value={startDate}
          />
        </div>
      )}
    </div>
  );
}

export default DatePicker;
