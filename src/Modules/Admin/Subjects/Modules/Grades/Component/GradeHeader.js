import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const GradeHeader = ({ onSearch, onFilterChange }) => {
  const [search, setSearch] = useState("");
  const { t } = useTranslation("admClass");

  // Retrieve lists for filtering from Redux
  const { modules: moduleList } = useSelector((state) => state.admin.module);
  const { assignments } = useSelector((state) => state.admin.assignments);
  const { quizzes } = useSelector((state) => state.admin.quizzes);
  const { semesters: semesterList } = useSelector(
    (state) => state.admin.semesters
  );

  // Get the selected semester from the user's class info (with fallback)
  const { selectedSemester } = useSelector(
    (state) => state.common.user.classInfo
  );

  // On mount or when selectedSemester changes, update parent's semester filter
  useEffect(() => {
    onFilterChange("semesterId", selectedSemester || "");
  }, [selectedSemester, onFilterChange]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    onSearch(e.target.value);
  };

  const handleFilterChange = (name, value) => {
    onFilterChange(name, value);
  };

  return (
    <div className="p-2 bg-white">
      <h2 className="text-xl ps-2 font-semibold mb-3">{t("Select Grades")}</h2>
      <div className="flex flex-nowrap items-end gap-4 px-4 overflow-x-auto pb-1">
        {/* Search Field */}
        <div className="relative flex flex-col flex-shrink-0">
          <label className="text-gray-600 mb-1">{t("Search Student")}</label>
          <div className="relative">
            <input
              type="text"
              placeholder={t("Search")}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 w-[12rem]"
              value={search}
              onChange={handleSearchChange}
              aria-label={t("Search")}
            />
            <button className="absolute right-2 top-3" aria-label={t("Search")}>
              <CiSearch className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Module Filter */}
        <div className="flex flex-col flex-shrink-0">
          <label className="text-gray-600 mb-1">{t("Module")}</label>
          <select
            name="moduleId"
            className="px-4 py-2 border w-[10rem] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            onChange={(e) => handleFilterChange("moduleId", e.target.value)}
            aria-label={t("Select Module")}
          >
            <option value="">{t("Select")}</option>
            {moduleList?.map((i) => (
              <option key={i._id} value={i._id}>
                {i.moduleName?.slice(0, 15)}..
              </option>
            ))}
          </select>
        </div>

        {/* Assignment Filter */}
        <div className="flex flex-col flex-shrink-0">
          <label className="text-gray-600 mb-1">{t("Assignment")}</label>
          <select
            name="assignmentId"
            className="px-4 py-2 border w-[10rem] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            onChange={(e) => handleFilterChange("assignmentId", e.target.value)}
            aria-label={t("Select Assignment")}
          >
            <option value="">{t("Select")}</option>
            {assignments?.map((i) => (
              <option key={i._id} value={i._id}>
                {i.name?.slice(0, 15)}..
              </option>
            ))}
          </select>
        </div>

        {/* Quiz Filter */}
        <div className="flex flex-col flex-shrink-0">
          <label className="text-gray-600 mb-1">{t("Quizzes")}</label>
          <select
            name="quizId"
            className="px-4 py-2 border w-[10rem] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            onChange={(e) => handleFilterChange("quizId", e.target.value)}
            aria-label={t("Select Quiz")}
          >
            <option value="">{t("Select")}</option>
            {quizzes?.map((i) => (
              <option key={i._id} value={i._id}>
                {i.name?.slice(0, 15)}..
              </option>
            ))}
          </select>
        </div>

        {/* Semester Filter */}
        <div className="flex flex-col flex-shrink-0">
          <label className="text-gray-600 mb-1">{t("Semester")}</label>
          <select
            name="semesterId"
            className="px-4 py-2 border w-[10rem] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            defaultValue={selectedSemester || ""}
            onChange={(e) => handleFilterChange("semesterId", e.target.value)}
            aria-label={t("Select Semester")}
          >
            <option value="">{t("Select")}</option>
            {semesterList?.map((i) => (
              <option key={i._id} value={i._id}>
                {i.title}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default GradeHeader;
