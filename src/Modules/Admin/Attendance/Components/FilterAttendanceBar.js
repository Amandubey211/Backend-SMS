import React, { useState, useEffect } from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { useParams } from "react-router-dom";
import useFetchSection from "../../../../Hooks/AuthHooks/Staff/Admin/Sections/useFetchSection";

const months = [
  { name: "January", number: 1 },
  { name: "February", number: 2 }, // Assuming leap year for example
  { name: "March", number: 3 },
  { name: "April", number: 4 },
  { name: "May", number: 5 },
  { name: "June", number: 6 },
  { name: "July", number: 7 },
  { name: "August", number: 8 },
  { name: "September", number: 9 },
  { name: "October", number: 10 },
  { name: "November", number: 11 },
  { name: "December", number: 12 },
];

const FilterAttendanceBar = ({ filters, onFilterChange }) => {
  const { sectionId, groupId, month } = filters;
  const [isSectionDropdownOpen, setIsSectionDropdownOpen] = useState(false);
  const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const AllSections = useSelector((store) => store.Class.sectionsList);
  const { cid } = useParams();
  const { fetchSection } = useFetchSection();

  const groups = sectionId
    ? AllSections.find((section) => section._id === sectionId)?.groups || []
    : AllSections.reduce((acc, section) => acc.concat(section.groups), []);

  const toggleDropdown = (setter, currentState) => {
    setter(!currentState);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchSection(cid);
    };
    fetchData();
  }, [fetchSection]);

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
    console.log(value);
    onFilterChange("month", value);
    setIsMonthDropdownOpen(false);
  };

  useEffect(() => {
    // Set the current month initially
    const currentMonth = new Date().toLocaleString("default", {
      month: "long",
    });
    if (!month) {
      onFilterChange("month", currentMonth);
    }
  }, [month, onFilterChange]);

  return (
    <div className="flex items-center justify-between space-x-4 p-3">
      <div className="flex gap-3 items-center">
        <div className="relative w-48">
          <div className="relative">
            <div
              className="block w-full p-2 border border-gray-300 rounded-lg appearance-none cursor-pointer transition-transform duration-300"
              onClick={() =>
                toggleDropdown(setIsSectionDropdownOpen, isSectionDropdownOpen)
              }
            >
              {AllSections.find((section) => section._id === sectionId)
                ?.sectionName || "All Sections"}
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
        <div className="relative w-48">
          <div className="relative">
            <div
              className="block w-full p-2 border border-gray-300 rounded-lg appearance-none cursor-pointer transition-transform duration-300"
              onClick={() =>
                toggleDropdown(setIsGroupDropdownOpen, isGroupDropdownOpen)
              }
            >
              {groups.find((group) => group._id === groupId)?.groupName ||
                "All Groups"}
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
      <div className="relative w-64">
        <div
          className="flex items-center cursor-pointer transition-transform duration-300"
          style={{
            background: "linear-gradient(to right, #fce7f3, #e9d5ff)",
            padding: "8px 16px",
            borderRadius: "8px",
          }}
          onClick={() =>
            toggleDropdown(setIsMonthDropdownOpen, isMonthDropdownOpen)
          }
        >
          <IoCalendarOutline className="text-purple-500 mr-2 text-2xl" />
          <div className="block appearance-none w-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-gradient px-4 pr-8 rounded leading-tight focus:outline-none">
            {months.find((monthObj) => monthObj.number === month)?.name ||
              "Select Month"}
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            {isMonthDropdownOpen ? (
              <MdOutlineKeyboardArrowUp className="fill-current h-7 w-7" />
            ) : (
              <MdOutlineKeyboardArrowDown className="fill-current h-7 w-7" />
            )}
          </div>
        </div>
        {isMonthDropdownOpen && (
          <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1">
            {months.map((monthObj) => (
              <div
                key={monthObj.name}
                className={`p-1 ps-8  cursor-pointer hover:bg-gray-100 transition-transform duration-300 ease-in-out hover:translate-x-2 ${
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
