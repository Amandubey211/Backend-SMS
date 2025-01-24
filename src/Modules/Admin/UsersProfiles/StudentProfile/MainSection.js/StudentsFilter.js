import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGroupsByClass,
  fetchSectionsByClass,
} from "../../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import { fetchAllStudents } from "../../../../../Store/Slices/Admin/Users/Students/student.action";
import { useTranslation } from "react-i18next";

export default function StudentsFilter({ filters, onFilterChange }) {
  const { t } = useTranslation("admAccounts");
  const dispatch = useDispatch();
  const { classes } = useSelector((store) => store?.admin?.class);
  const { sectionsList, groupsList } = useSelector(
    (store) => store?.admin?.group_section
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log(`Selected: ${name} = ${value}`);

    if (name === "classId" && value === "") {
      dispatch(fetchAllStudents({ classId: "", sectionId: "", groupId: "" }));
      onFilterChange("classId", "");
      onFilterChange("sectionId", "");
      onFilterChange("groupId", "");
      return;
    }

    if (name === "classId") {
      dispatch(fetchSectionsByClass(value));
      dispatch(fetchGroupsByClass(value));
    }

    onFilterChange(name, value);
  };

  return (
    <div>
      <div className="flex items-end gap-4 py-4 bg-white w-full">
        <div className="flex flex-col flex-grow">
          <label className="text-sm font-medium text-gray-700">
            {t("Class")}
          </label>
          <select
            name="classId"
            value={filters?.classId || ""}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">{t("All")}</option>
            {classes?.map((c) => (
              <option key={c?._id} value={c?._id}>
                {c?.className}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col flex-grow">
          <label className="text-sm font-medium text-gray-700">
            {t("Section")}
          </label>
          <select
            name="sectionId"
            value={filters?.sectionId || ""}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">{t("All")}</option>
            {sectionsList?.map((s) => (
              <option key={s?._id} value={s?._id}>
                {s?.sectionName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col flex-grow">
          <label className="text-sm font-medium text-gray-700">
            {t("Group")}
          </label>
          <select
            name="groupId"
            value={filters?.groupId || ""}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">{t("All")}</option>
            {groupsList?.map((g) => (
              <option key={g?._id} value={g?._id}>
                {g?.groupName}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
