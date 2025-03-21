import { DatePicker } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { FiRefreshCw } from "react-icons/fi";

function FilterExam({
  handleApplyFilters,
  startDate,
  handleStartDateChange,
  endDate,
  handleEndDateChange,
}) {
  const { t } = useTranslation("admModule");

  return (
    <div className="bg-white p-4 border border-gray-200 rounded-lg w-full relative mt-2">
      <div className="flex item-center justify-between py-4">
        <h2 className="text-lg font-medium">{t("Filter")}</h2>
        <FiRefreshCw
          onClick={handleApplyFilters}
          size={25}
          className="cursor-pointer text-gray-500 hover:text-blue-500 transition-transform duration-300 hover:rotate-180"
          title="Reset Filters"
        />
      </div>

      {/* Start Date Filter */}
      <div>
        <label className="text-gray-700 font-medium text-sm">Start Date</label>
        <DatePicker
          selected={startDate}
          onChange={handleStartDateChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          className="border p-2 rounded-md w-full"
          placeholderText="Select Start Date"
        />
      </div>

      {/* End Date Filter */}
      <div className="mt-4">
        <label className="text-gray-700 font-medium text-sm">End Date</label>
        <DatePicker
          selected={endDate}
          onChange={handleEndDateChange}
          selectsEnd
          isClearable
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          className="border p-2 rounded-md w-full"
          placeholderText="Select End Date"
        />
      </div>
    </div>
  );
}

export default FilterExam;
