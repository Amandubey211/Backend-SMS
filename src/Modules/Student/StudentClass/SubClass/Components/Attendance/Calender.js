// CalendarHeader.jsx

import React from "react";
import { Calendar, Select } from "antd";
import { FaCheckCircle, FaTimesCircle, FaMinusCircle } from "react-icons/fa";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { gt } from "../../../../../../Utils/translator/translation";

const { Option } = Select;

const getStatusIcon = (status) => {
  switch (status) {
    case "present":
      return <FaCheckCircle className="text-green-500" />;
    case "absent":
      return <FaTimesCircle className="text-red-500" />;
    case "leave":
      return <FaMinusCircle className="text-purple-500" />;
    default:
      return null;
  }
};

const CalendarHeader = ({ attendanceData, onPanelChange, value, yearList }) => {
  const { t } = useTranslation();

  const dateCellRender = (value) => {
    const dateStr = value.format("YYYY-MM-DD");
    const status = attendanceData[dateStr];
    if (!status) return null;

    return (
      <div className="flex flex-col items-center">
        <div className="bg-white border border-gray-300 rounded-full p-2 flex items-center">
          {getStatusIcon(status)}
        </div>
        <span className="mt-1 text-sm">{status}</span>
      </div>
    );
  };

  const headerRender = ({ value, onChange }) => {
    const currentYear = value.year();
    const currentMonth = value.month();

    // Month change
    const handleMonthChange = (newMonth) => {
      onChange(value.clone().month(newMonth));
    };

    // Year change
    const handleYearChange = (newYear) => {
      // Only let user pick from the yearList
      onChange(value.clone().year(newYear));
    };

    return (
      <div className="flex justify-end items-center mb-4 space-x-2">
        {/* Month Select */}
        <Select
          style={{ width: 100 }}
          value={currentMonth}
          onChange={handleMonthChange}
        >
          {moment.monthsShort().map((monthName, index) => (
            <Option key={monthName} value={index}>
              {t(monthName.toLowerCase(), gt.month)}
            </Option>
          ))}
        </Select>

        {/* Year Select */}
        <Select
          style={{ width: 100 }}
          value={currentYear}
          onChange={handleYearChange}
        >
          {yearList.map((yr) => (
            <Option key={yr} value={yr}>
              {yr}
            </Option>
          ))}
        </Select>
      </div>
    );
  };

  return (
    <Calendar
      value={value}
      dateCellRender={dateCellRender}
      onPanelChange={onPanelChange}
      headerRender={headerRender}
    />
  );
};

export default CalendarHeader;
