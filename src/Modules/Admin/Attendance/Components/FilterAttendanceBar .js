import React, { useState } from 'react';
import { IoCalendarOutline } from "react-icons/io5";

const FilterAttendanceBar = () => {
  const [section, setSection] = useState('');
  const [group, setGroup] = useState('');
  const [date, setDate] = useState('Aug-2024');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="flex items-center justify-between space-x-4 p-3">
      <div className="flex gap-3 items-center">
        <div className="relative w-48">
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          >
            <option value="">Section</option>
            <option value="section1">Section 1</option>
            <option value="section2">Section 2</option>
            <option value="section3">Section 3</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className={`fill-current h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
            </svg>
          </div>
        </div>
        <div className="relative w-48">
          <select
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          >
            <option value="">Group</option>
            <option value="group1">Group 1</option>
            <option value="group2">Group 2</option>
            <option value="group3">Group 3</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className={`fill-current h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
            </svg>
          </div>
        </div>
      </div>
      <div className="relative w-64">
        <div className="flex items-center" style={{ background: "linear-gradient(to right, #fce7f3, #e9d5ff)", padding: "8px 16px", borderRadius: "8px" }}>
          <IoCalendarOutline className="text-purple-500 mr-2 text-2xl" />
          <select
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="block appearance-none w-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white  px-4 pr-8 rounded leading-tight focus:outline-none"
            style={{
              background: "linear-gradient(to right, #f43f5e, #8b5cf6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            <option className='text-black' value="Aug-2024">Aug-2024</option>
            <option  className='text-black' value="Sep-2024">Sep-2024</option>
            <option  className='text-black' value="Oct-2024">Oct-2024</option>
            <option className='text-black' value="Nov-2024">Nov-2024</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className={`fill-current h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterAttendanceBar;
