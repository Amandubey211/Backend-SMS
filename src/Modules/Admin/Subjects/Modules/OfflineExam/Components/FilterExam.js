import { DatePicker } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { FiRefreshCw } from "react-icons/fi";

function FilterExam({
  handleApplyFilters,
  semester,
  setSemester,
  startDate,
  handleStartDateChange,
  endDate,
  handleEndDateChange,
}) {
  const SemesterList = ["Semester I", "Semester II", "Semester III"];
  const { t } = useTranslation("admModule");
  return (
    <div className="bg-white p-4 border border-gray-200 rounded-lg  w-full relative mt-8">
      {/* <button
          onClick={handleApplyFilters}
          className="absolute right-2 mr-1 text-gray-600 rounded-full  pr-4 focus:outline-none transform transition-transform duration-300 hover:rotate-180"
          aria-label={t("Reset filters")}
        > */}
      <FiRefreshCw
        onClick={handleApplyFilters}
        size={25}
        className="ml-auto mt-5 cursor-pointer text-gray-500 hover:text-blue-500
            transition-transform duration-300 hover:rotate-180"
        title="Reset Filters"
      />
      {/* </button> */}

      <h2 className="text-lg font-medium mb-4">{t("Filter")}</h2>
      <div className="mb-4">
        <label
          className="block text-gray-700 font-medium text-sm"
          htmlFor="module-select"
        >
          Semester
        </label>
        <select
          className="mt-1 block w-full pl-3 pr-5 border border-gray-200 py-2 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
        >
          <option value="">{t("Select")}</option>
          {SemesterList.map((name, index) => (
            <option key={index} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

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
