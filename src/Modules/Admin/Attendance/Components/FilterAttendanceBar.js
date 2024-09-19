import React, { useState, useEffect } from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { useParams } from "react-router-dom";
import { months } from "./Data/AttendenceData";
import {
  fetchGroupsByClass,
  fetchSectionsByClass,
} from "../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";

const FilterAttendanceBar = ({ filters, onFilterChange }) => {
  const { sectionId, groupId, month } = filters;
  const [isSectionDropdownOpen, setIsSectionDropdownOpen] = useState(false);
  const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);

  const dispatch = useDispatch();
  const { cid } = useParams();

  const sections = useSelector(
    (state) => state.admin.group_section.sectionsList
  );
  const groups = useSelector((state) => state.admin.group_section.groupsList);

  useEffect(() => {
    if (cid) {
      dispatch(fetchSectionsByClass(cid));
    }
  }, [cid, dispatch]);

  useEffect(() => {
    if (cid) {
      dispatch(fetchGroupsByClass(cid));
    }
  }, [cid, dispatch]);

  const handleSectionChange = (value) => {
    onFilterChange("sectionId", value);
    onFilterChange("groupId", ""); // Reset group when changing sections
    setIsSectionDropdownOpen(false);
  };

  const handleGroupChange = (value) => {
    onFilterChange("groupId", value);
    setIsGroupDropdownOpen(false);
  };

  const handleMonthChange = (value) => {
    onFilterChange("month", value);
    setIsMonthDropdownOpen(false);
  };

  return (
    <div className="flex items-center justify-between space-x-4 p-3">
      <div className="flex items-center gap-4">
        {/* Section Dropdown */}
        <div className="relative w-48">
          <div
            className="relative"
            onClick={() => setIsSectionDropdownOpen(!isSectionDropdownOpen)}
          >
            <div className="block w-full p-2 border border-gray-300 rounded-lg cursor-pointer">
              {sections.length > 0 ? (
                sections.find((section) => section._id === sectionId)
                  ?.sectionName || "All Sections"
              ) : (
                <span className="text-gray-500">No sections found</span>
              )}
              <span className="absolute right-0 p-2">
                {isSectionDropdownOpen ? (
                  <MdOutlineKeyboardArrowUp />
                ) : (
                  <MdOutlineKeyboardArrowDown />
                )}
              </span>
            </div>
            {isSectionDropdownOpen && (
              <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1">
                {sections.length > 0 ? (
                  sections.map((section) => (
                    <div
                      key={section._id}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSectionChange(section._id)}
                    >
                      {section.sectionName}
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-gray-500">No sections available</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Group Dropdown */}
        <div className="relative w-48">
          <div
            className="relative"
            onClick={() => setIsGroupDropdownOpen(!isGroupDropdownOpen)}
          >
            <div className="block w-full p-2 border border-gray-300 rounded-lg cursor-pointer">
              {groups.length > 0 ? (
                groups.find((group) => group._id === groupId)?.groupName ||
                "All Groups"
              ) : (
                <span className="text-gray-500">No groups found</span>
              )}
              <span className="absolute right-0 p-2">
                {isGroupDropdownOpen ? (
                  <MdOutlineKeyboardArrowUp />
                ) : (
                  <MdOutlineKeyboardArrowDown />
                )}
              </span>
            </div>
            {isGroupDropdownOpen && (
              <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1">
                {groups.length > 0 ? (
                  groups.map((group) => (
                    <div
                      key={group._id}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleGroupChange(group._id)}
                    >
                      {group.groupName}
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-gray-500">No groups available</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Month Dropdown */}
      <div className="relative w-64">
        <div
          className="flex items-center cursor-pointer p-2 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-lg"
          onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
        >
          <IoCalendarOutline className="text-white mr-2" />
          <span className="text-white">
            {months.find((monthObj) => monthObj.number === month)?.name ||
              "Select Month"}
          </span>
          <span className="ml-auto">
            {isMonthDropdownOpen ? (
              <MdOutlineKeyboardArrowUp />
            ) : (
              <MdOutlineKeyboardArrowDown />
            )}
          </span>
        </div>
        {isMonthDropdownOpen && (
          <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1">
            {months.map((monthObj) => (
              <div
                key={monthObj.name}
                className={`p-2 cursor-pointer ${
                  month === monthObj.number ? "bg-gray-200" : ""
                }`}
                onClick={() => handleMonthChange(monthObj.number)}
              >
                {monthObj.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterAttendanceBar;
