import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Select, Input } from "antd";
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

  // When a class is selected
  const handleClassChange = (value) => {
    if (value === "") {
      dispatch(fetchAllStudents({ classId: "", sectionId: "", groupId: "" }));
      onFilterChange("classId", "");
      onFilterChange("sectionId", "");
      onFilterChange("groupId", "");
      return;
    }
    dispatch(fetchSectionsByClass(value));
    dispatch(fetchGroupsByClass(value));
    onFilterChange("classId", value);
  };

  const handleSectionChange = (value) => {
    onFilterChange("sectionId", value);
  };

  const handleGroupChange = (value) => {
    onFilterChange("groupId", value);
  };

  const handleSearch = (value) => {
    // When search text is entered, update the filter key "search"
    onFilterChange("search", value);
  };

  return (
    <div>
      <div className="flex items-end gap-4 py-4 bg-white w-full justify-start">
        {/* Search Box */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">
            {t("Search")}
          </label>
          <Search
            placeholder={t("Search by Name, QID, Admission number")}
            onSearch={handleSearch}
            allowClear
            style={{ width: 320 }}
            size="large"
            className="mt-1"
          />
        </div>

        {/* Class Select */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">
            {t("Class")}
          </label>
          <Select
            value={filters?.classId || ""}
            onChange={handleClassChange}
            placeholder={t("All")}
            style={{ width: 200 }}
            allowClear
            size="large"
            className="mt-1"
          >
            <Option value="">{t("All")}</Option>
            {classes?.map((c) => (
              <Option key={c?._id} value={c?._id}>
                {c?.className}
              </Option>
            ))}
          </Select>
        </div>

        {/* Section Select */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">
            {t("Section")}
          </label>
          <Select
            value={filters?.sectionId || ""}
            onChange={handleSectionChange}
            placeholder={t("All")}
            style={{ width: 200 }}
            allowClear
            size="large"
            className="mt-1"
          >
            <Option value="">{t("All")}</Option>
            {sectionsList?.map((s) => (
              <Option key={s?._id} value={s?._id}>
                {s?.sectionName}
              </Option>
            ))}
          </Select>
        </div>

        {/* Group Select */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">
            {t("Group")}
          </label>
          <Select
            value={filters?.groupId || ""}
            onChange={handleGroupChange}
            placeholder={t("All")}
            style={{ width: 200 }}
            allowClear
            size="large"
            className="mt-1"
          >
            <Option value="">{t("All")}</Option>
            {groupsList?.map((g) => (
              <Option key={g?._id} value={g?._id}>
                {g?.groupName}
              </Option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}
