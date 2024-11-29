import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Sidebar from "../../../../../../Components/Common/Sidebar";
import Filter from "./Filter";

const GradeHeader = ({ onSearch, onFilterChange }) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const { cid, sid } = useParams();
  const { t } = useTranslation("admClass");

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    onSearch(e.target.value);
  };

  const handleFilterChange = (name, value) => {
    onFilterChange(name, value);
  };

  const { modules: moduleList } = useSelector((state) => state.admin.module);
  const {
    assignments
  } = useSelector((state) => state.admin.assignments);
  const {quizzes } = useSelector(
    (state) => state.admin.quizzes
  );

  return (
    <div className="p-2 bg-white">
      <h2 className="text-xl ps-2 font-semibold mb-3">{t("All Grades")}</h2>
      <div className="flex items-end justify-around gap-1 px-4">
        <div className="relative flex flex-col">
          <label className="text-gray-600 mb-1">{t("Search Student")}</label>
          <div className="relative">
            <input
              type="text"
              placeholder={t("Search")}
              className="text px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 w-[13rem]"
              value={search}
              onChange={handleSearchChange}
              aria-label={t("Search")}
            />
            <button className="absolute right-2 top-3" aria-label={t("Search")}>
              <CiSearch className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">{t("Module")}</label>
          <select
            name="moduleId"
            className="px-4 py-2 border w-[13rem] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            onChange={(e) => handleFilterChange("moduleId", e.target.value)}
            aria-label={t("Select Module")}
          >
            <option value="">{t("All")}</option>
            {moduleList?.map((i) => (
              <option key={i._id} value={i._id}>
                {i.moduleName?.slice(0, 15)}..
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">{t("Assignment")}</label>
          <select
            name="assignmentId"
            className="px-4 py-2 border w-[13rem] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            onChange={(e) => handleFilterChange("assignmentId", e.target.value)}
            aria-label={t("Select Assignment")}
          >
            <option value="">{t("All")}</option>
            {assignments?.map((i) => (
              <option key={i._id} value={i._id}>
                {i.name?.slice(0, 15)}..
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">{t("Quizzes")}</label>
          <select
            name="quizId"
            className="px-4 py-2 border w-[13rem] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            onChange={(e) => handleFilterChange("quizId", e.target.value)}
            aria-label={t("Select Quiz")}
          >
            <option value="">{t("All")}</option>
            {quizzes?.map((i) => (
              <option key={i._id} value={i._id}>
                {i.name?.slice(0, 15)}..
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default GradeHeader;
