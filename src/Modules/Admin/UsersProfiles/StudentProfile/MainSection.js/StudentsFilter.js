import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Select, Input, Button } from "antd";
import {
  fetchGroupsByClass,
  fetchSectionsByClass,
} from "../../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import { fetchAllStudents } from "../../../../../Store/Slices/Admin/Users/Students/student.action";
import { useTranslation } from "react-i18next";

const { Option } = Select;
const { Search } = Input;

export default function StudentsFilter({ filters, onFilterChange }) {
  const { t } = useTranslation("admAccounts");
  const dispatch = useDispatch();
  const { classes } = useSelector((store) => store?.admin?.class);
  const { sectionsList, groupsList } = useSelector(
    (store) => store?.admin?.group_section
  );

  // Reset all filters
  const handleReset = () => {
    onFilterChange("classId", "");
    onFilterChange("sectionId", "");
    onFilterChange("groupId", "");
    onFilterChange("searchTerm", ""); // Changed from "search" to "searchTerm" for consistency
    dispatch(fetchAllStudents({}));
  };

  // When a class is selected
  const handleClassChange = (value) => {
    onFilterChange("classId", value);
    onFilterChange("sectionId", "");
    onFilterChange("groupId", "");

    if (value) {
      dispatch(fetchSectionsByClass(value));
      dispatch(fetchGroupsByClass(value));
    }
  };

  const handleSectionChange = (value) => {
    onFilterChange("sectionId", value);
  };

  const handleGroupChange = (value) => {
    onFilterChange("groupId", value);
  };

  const handleSearch = (value) => {
    onFilterChange("searchTerm", value);
  };

  const handleSearchChange = (e) => {
    // Update search term immediately as user types
    onFilterChange("searchTerm", e.target.value);
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 bg-white w-full justify-between p-1  ">
      {/* Search Box */}
      <div className="w-full md:w-auto">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("Search")}
        </label>
        <Search
          placeholder={t("Search by Name, ID, Admission number")}
          onSearch={handleSearch}
          onChange={handleSearchChange}
          allowClear
          enterButton
          value={filters.searchTerm || ""}
          style={{ width: "100%", maxWidth: 320 }}
          size="large"
        />
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-end gap-4 w-full md:w-auto">
        {/* Class Select */}
        <div className="w-full md:w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("Class")}
          </label>
          <Select
            value={filters.classId || undefined}
            onChange={handleClassChange}
            placeholder={t("All Classes")}
            style={{ width: "100%" }}
            allowClear
            size="large"
          >
            {classes?.map((c) => (
              <Option key={c?._id} value={c?._id}>
                {c?.className}
              </Option>
            ))}
          </Select>
        </div>

        {/* Section Select */}
        <div className="w-full md:w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("Section")}
          </label>
          <Select
            value={filters.sectionId || undefined}
            onChange={handleSectionChange}
            placeholder={t("All Sections")}
            style={{ width: "100%" }}
            allowClear
            size="large"
            disabled={!filters.classId}
          >
            {sectionsList?.map((s) => (
              <Option key={s?._id} value={s?._id}>
                {s?.sectionName}
              </Option>
            ))}
          </Select>
        </div>

        {/* Reset Button */}
        <Button
          type="default"
          onClick={handleReset}
          size="large"
          className="w-full md:w-auto"
        >
          {t("Reset")}
        </Button>
      </div>
    </div>
  );
}
