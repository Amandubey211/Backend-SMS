import React, { useState, useEffect } from "react";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useFetchSection from "../../../../../Hooks/AuthHooks/Staff/Admin/Sections/useFetchSection";

const Filters = ({ filters, onFilterChange }) => {
  const { sectionId, groupId } = filters;
  const [isSectionDropdownOpen, setIsSectionDropdownOpen] = useState(false);
  const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);
  const AllSections = useSelector((store) => store.Class.sectionsList);
  const { cid } = useParams();
  const { fetchSection } = useFetchSection();

  useEffect(() => {
    const fetchData = async () => {
      await fetchSection(cid);
    };
    fetchData();
  }, [fetchSection, cid]);

  const groups = sectionId
    ? AllSections.find((section) => section._id === sectionId)?.groups || []
    : AllSections.reduce((acc, section) => acc.concat(section.groups), []);

  const toggleDropdown = (setter, currentState) => {
    setter(!currentState);
  };

  const handleSectionChange = (value) => {
    onFilterChange("sectionId", value);
    onFilterChange("groupId", ""); // Reset group when changing sections
    setIsSectionDropdownOpen(false);
  };

  const handleGroupChange = (value) => {
    onFilterChange("groupId", value);
    setIsGroupDropdownOpen(false);
  };

  const handleSectionReset = () => {
    onFilterChange("sectionId", "");
    onFilterChange("groupId", ""); // Reset group when resetting sections
    setIsSectionDropdownOpen(false);
  };

  const handleGroupReset = () => {
    onFilterChange("groupId", "");
    setIsGroupDropdownOpen(false);
  };

  return (
    <div className="flex justify-between space-x-4 my-2">
      <div className="flex flex-col">
        <label className="text-gray-600 mb-1">Class</label>
        <select className="border rounded p-2 w-56">
          <option>Select Class</option>
        </select>
      </div>
      <div className="flex flex-col">
        <label className="text-gray-600 mb-1">Section</label>
        <div className="relative w-56">
          <div
            className="block w-full p-2 border border-gray-300 rounded appearance-none cursor-pointer transition-transform duration-300"
            onClick={() =>
              toggleDropdown(setIsSectionDropdownOpen, isSectionDropdownOpen)
            }
          >
            {AllSections.find((section) => section._id === sectionId)
              ?.sectionName || "Select Sections"}

            <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 cursor-pointer transition-transform transform duration-300 ease-in-out hover:translate-y-1">
              {isSectionDropdownOpen ? (
                <MdOutlineKeyboardArrowUp className="fill-current h-7 w-7" />
              ) : (
                <MdOutlineKeyboardArrowDown className="fill-current h-7 w-7" />
              )}
            </div>
          </div>
          {isSectionDropdownOpen && (
            <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1">
              <div
                key="All"
                className="p-2 cursor-pointer hover:bg-gray-100 transition-transform duration-300 ease-in-out hover:translate-x-1"
                onClick={handleSectionReset}
              >
                Reset
              </div>
              {AllSections.map((section) => (
                <div
                  key={section._id}
                  className="p-2 cursor-pointer hover:bg-gray-100 transition-transform duration-300 ease-in-out hover:translate-x-1"
                  onClick={() => handleSectionChange(section._id)}
                >
                  {section.sectionName}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <label className="text-gray-600 mb-1">Group</label>
        <div className="relative w-56">
          <div
            className="block w-full p-2 border border-gray-300 rounded-lg appearance-none cursor-pointer transition-transform duration-300"
            onClick={() =>
              toggleDropdown(setIsGroupDropdownOpen, isGroupDropdownOpen)
            }
          >
            {groups.find((group) => group._id === groupId)?.groupName ||
              "Select Groups"}
            <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 cursor-pointer transition-transform transform duration-300 ease-in-out hover:translate-y-1">
              {isGroupDropdownOpen ? (
                <MdOutlineKeyboardArrowUp className="fill-current h-7 w-7" />
              ) : (
                <MdOutlineKeyboardArrowDown className="fill-current h-7 w-7" />
              )}
            </div>
          </div>
          {isGroupDropdownOpen && (
            <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1">
              <div
                key="All"
                className="p-2 cursor-pointer hover:bg-gray-100 transition-transform duration-300 ease-in-out hover:translate-x-1"
                onClick={handleGroupReset}
              >
                Reset
              </div>
              {groups.map((group) => (
                <div
                  key={group._id}
                  className="p-2 cursor-pointer hover:bg-gray-100 transition-transform duration-300 ease-in-out hover:translate-x-1"
                  onClick={() => handleGroupChange(group._id)}
                >
                  {group.groupName}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filters;
