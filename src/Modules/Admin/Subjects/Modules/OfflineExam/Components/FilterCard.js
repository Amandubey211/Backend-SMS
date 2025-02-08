import { FiRefreshCw } from "react-icons/fi";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import DatePicker from "../../../../../../Utils/calendar";

const FilterCard = () => {
  const { t } = useTranslation("admModule");
  const [examType, setExamType] = useState("");
  const [startDate, setStartDate] = useState(new Date());

  const ExamTypeList = ["Quiz", "Viva", "practical"];

  const handleApplyFilters = () => {};

  const handleExamTypeChange = (e) => {
    setExamType(e.target.value);
  };

  const handleResetFilters = () => {
    setExamType("");
    setStartDate("");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-80 relative">
      <button
        onClick={handleResetFilters}
        className="absolute top-2 right-2 text-gray-600 rounded-full p-2 focus:outline-none transform transition-transform duration-300 hover:rotate-180"
        aria-label={t("Reset filters")}
      >
        <FiRefreshCw size={24} />
      </button>

      <h2 className="text-lg font-semibold mb-4">{t("Filter")}</h2>

      <div className="mb-4">
        <label className="block text-gray-700" htmlFor="module-select">
          {t("Exam Type")}
        </label>
        <select
          className="mt-1 block w-full pl-3 pr-10 border py-2 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={examType}
          onChange={handleExamTypeChange}
        >
          <option value="">{t("Select")}</option>
          {ExamTypeList?.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <DatePicker startDate={startDate} setStartDate={setStartDate} />
      </div>

      <button
        onClick={handleApplyFilters}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-full focus:outline-none transform transition-transform duration-300 hover:scale-105"
        aria-label={t("Apply filters")}
      >
        {t("Apply")}
      </button>
    </div>
  );
};

export default FilterCard;
