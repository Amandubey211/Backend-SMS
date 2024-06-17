import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CustomCalendar = () => {
  const [date, setDate] = useState(new Date());

  const onChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <div className="">
      <Calendar
        onChange={onChange}
        value={date}
        tileClassName={({ date, view }) => {
          if (date.getDate() === 12 && date.getMonth() === 6 && date.getFullYear() === 2023) {
            return 'highlight';
          }
          return null;
        }}
        className="w-full"
        next2Label={null}
        prev2Label={null}
        formatShortWeekday={(locale, date) => date.toString().slice(0, 2)}
      />
    </div>
  );
};

export default CustomCalendar;
