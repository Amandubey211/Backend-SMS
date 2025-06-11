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

const CalendarHeader = ({ attendanceData, onMonthChange, onYearChange, value, yearList, selectedMonth, selectedYear }) => {
  const { t } = useTranslation();

  const dateCellRender = (date) => {
    const dateStr = date.format("YYYY-MM-DD");
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
    const currentYear = selectedYear;
    const currentMonth = selectedMonth;

    // Month change (do not affect year)
    const handleMonthChange = (newMonth) => {
      onMonthChange(newMonth);
      const newDate = moment(`${currentYear}-${newMonth + 1}-01`, "YYYY-MM-DD");
      onChange(newDate);
    };

    // Year change
    const handleYearChange = (newYear) => {
      onYearChange(newYear);
      const newDate = moment(`${newYear}-${currentMonth + 1}-01`, "YYYY-MM-DD");
      onChange(newDate);
    };

    return (
      <div className="flex justify-end items-center mb-4 space-x-2">
        {/* Month Select */}
        <Select
          style={{ width: 100 }}
          value={currentMonth}
          onChange={handleMonthChange}
        >
          {moment.monthsShort()?.map((monthName, index) => (
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
          {yearList?.map((yr) => (
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
      headerRender={headerRender}
    />
  );
};

export default CalendarHeader;