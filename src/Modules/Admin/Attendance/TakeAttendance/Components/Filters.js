import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useFetchSection from "../../../../../Hooks/AuthHooks/Staff/Admin/Sections/useFetchSection";
import useGetGroupsByClass from "../../../../../Hooks/AuthHooks/Staff/Admin/Groups/useGetGroupByClass";
import { GrPowerReset } from "react-icons/gr";

const Filters = ({ filters, onFilterChange, resetDate }) => {
  const { sectionId, groupId } = filters;
  const AllSections = useSelector((store) => store.Class.sectionsList);
  const { cid } = useParams();
  const { fetchSection } = useFetchSection();
  const className = useSelector((store) => store.Common.selectedClass);
  const { fetchGroupsByClass } = useGetGroupsByClass();
  const groups = useSelector((store) => store.Class.groupsList);

  useEffect(() => {
    const fetchData = async () => {
      await fetchSection(cid);
    };
    fetchData();
  }, [fetchSection, cid]);
  console.log(groups, "sssssssssss");
  useEffect(() => {
    if (!groups || groups.length === 0) {
      fetchGroupsByClass(cid);
    }
  }, [groups, fetchGroupsByClass, cid]);

  const handleSectionChange = (e) => {
    onFilterChange("sectionId", e.target.value);
  };

  const handleGroupChange = (e) => {
    onFilterChange("groupId", e.target.value);
  };

  const handleAllChange = () => {
    onFilterChange("sectionId", "");
    onFilterChange("groupId", "");
    resetDate();
  };

  return (
    <div className="flex justify-between items-center my-2">
      <div className="flex space-x-4">
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Section</label>
          <select
            className="border rounded p-2 w-56"
            value={sectionId}
            onChange={handleSectionChange}
          >
            <option value="">Reset</option>
            {AllSections.map((section) => (
              <option key={section._id} value={section._id}>
                {section.sectionName}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Group</label>
          <select
            className="border rounded p-2 w-56"
            value={groupId}
            onChange={handleGroupChange}
          >
            <option value="">Reset Group</option>
            {groups.map((group) => (
              <option key={group._id} value={group._id}>
                {group.groupName}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex items-center">
        <button
          className="rounded p-2 flex items-center justify-center"
          title="Reset All"
          onClick={handleAllChange}
          style={{ marginTop: "20px" }}
        >
          <GrPowerReset className="size-10 text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default Filters;
