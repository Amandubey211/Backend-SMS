import React from 'react';
import { Calendar } from 'antd';
import moment from 'moment';
import { FaCheckCircle, FaTimesCircle, FaMinusCircle } from 'react-icons/fa';


const getStatusIcon = (status) => {
  switch (status) {
    case 'attend':
      return <FaCheckCircle className="text-green-500" />;
    case 'absent':
      return <FaTimesCircle className="text-red-500" />;
    case 'leave':
      return <FaMinusCircle className="text-purple-500" />;
    default:
      return null;
  }
};

const CalendarHeader = ({ attendanceData, onPanelChange }) => {
  const dateCellRender = (value) => {
    const dateStr = value.format('YYYY-MM-DD');
    const status = attendanceData[dateStr];
console.log("date____",dateStr,status,value,attendanceData);
    return (
      status ? (
        <div className='flex flex-col items-center'>
          <div className='bg-white border border-gray-300 rounded-full p-2 flex items-center'>
            {getStatusIcon(status)}
          </div>
          <span className='mt-1 text-sm'>{status}</span>
        </div>
      ) : null
    );
  };

  return <Calendar dateCellRender={dateCellRender} onPanelChange={onPanelChange} />;
};

export default CalendarHeader;
