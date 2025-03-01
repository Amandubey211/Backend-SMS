import React from 'react';
import { Calendar } from 'antd';
import { FaCheckCircle, FaTimesCircle, FaMinusCircle } from 'react-icons/fa';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { gt } from '../../../../../../Utils/translator/translation';
import { useSelector } from 'react-redux';

const getStatusIcon = (status) => {
  switch (status) {
    case 'present':
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
  const { t } = useTranslation();
  const StartAcademicYear = 2024; 
  const currentYear = moment().year(); 
  const lastAcademicYear = currentYear + 1; 

  const dateCellRender = (value) => {
    const dateStr = value.format('YYYY-MM-DD');
    const status = attendanceData[dateStr];

    return status ? (
      <div className='flex flex-col items-center'>
        <div className='bg-white border border-gray-300 rounded-full p-2 flex items-center'>
          {getStatusIcon(status)}
        </div>
        <span className='mt-1 text-sm'>{status}</span>
      </div>
    ) : null;
  };

  const headerRender = ({ value, onChange }) => {
    const currentYear = value.format('YYYY'); 
    const currentMonth = value.month();

    const monthOptions = moment.monthsShort().map((month, index) => (
      <option key={index} value={index}>
        {t(month.toLowerCase(), gt.month)}
      </option>
    ));

    const yearOptions = [];
    for (let i = StartAcademicYear; i <= lastAcademicYear; i++) {
      yearOptions.push(
        <option key={i} value={i}>
          {i} {/* No translation needed for year */}
        </option>
      );
    }

    const handleMonthChange = (event) => {
      const newMonth = parseInt(event.target.value, 10);
      const newValue = value.clone().month(newMonth);
      onChange(newValue);
    };

    const handleYearChange = (event) => {
      const newYear = parseInt(event.target.value, 10);
      const newValue = value.clone().year(newYear);
      onChange(newValue);
    };

    return (
      <div className="flex justify-end items-center mb-4">
        <div className="flex space-x-2">
          <select
            value={currentMonth}
            onChange={handleMonthChange}
            className="border border-gray-300 rounded px-2 py-1"
          >
            {monthOptions}
          </select>

          <select
            value={currentYear}
            onChange={handleYearChange}
            className="border border-gray-300 rounded px-2 py-1"
          >
            {yearOptions}
          </select>
        </div>
      </div>
    );
  };

  return (
    <Calendar 
      dateCellRender={dateCellRender} 
      onPanelChange={onPanelChange} 
      headerRender={headerRender} 
    />
  );
};

export default CalendarHeader;
