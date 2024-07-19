import React from 'react';
import { Calendar } from 'antd';
import moment from 'moment';
import { FaCheckCircle, FaTimesCircle, FaMinusCircle } from 'react-icons/fa';

const attendanceData = {
  '2024-03-01': 'Attend',
  '2024-03-02': 'Absent',
  '2024-03-03': 'Attend',
  '2024-03-04': 'Attend',
  '2024-03-05': 'Attend',
  '2024-03-06': 'Leave',
  // Add other dates accordingly
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'Attend':
      return <FaCheckCircle className="text-green-500" />;
    case 'Absent':
      return <FaTimesCircle className="text-red-500" />;
    case 'Leave':
      return <FaMinusCircle className="text-purple-500" />;
    default:
      return null;
  }
};

const CalendarHeader = () => {
  const dateCellRender = (value) => {
    const dateStr = value.format('YYYY-MM-DD');
    const status = attendanceData[dateStr];

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

  const onPanelChange = (value, mode) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };

  return <Calendar dateCellRender={dateCellRender} onPanelChange={onPanelChange} />;
};

export default CalendarHeader;
