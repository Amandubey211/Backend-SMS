import React, { useState, useEffect, useRef } from "react";
import { CiSearch, CiFilter } from "react-icons/ci"; // Icons for search and filter

const TopNavigationWithFilters = ({ onSearch, onFilterChange }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef(null);

  const [filters, setFilters] = useState({
    academicYear: "",
    class: "",
    section: "",
    groupName: "",
  });

  const availableFilters = {
    academicYear: ["2020-2021", "2021-2022", "2022-2023"],
    classes: ["Computer Science", "Information Technology", "Software Engineering"],
    sections: ["A", "B", "C"],
    groupName: ["CS EXP", "IT EXP", "WD EXP"],
  };

  // Handle search query input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value); // Call the parent function to filter the list
  };

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    const updatedFilters = { ...filters, [filterName]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters); // Call the parent function to filter the list
  };

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex justify-between items-center mb-6">
      {/* Search input */}
      <div className="relative flex items-center max-w-xs w-full mr-4">
        <input
          type="text"
          placeholder="Search by Name or Email"
          value={searchQuery}
          onChange={handleSearchChange}
          className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 w-full transition-all duration-300"
        />
        <button className="absolute right-3">
          <CiSearch className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Filter button */}
      <div className="relative" ref={filterRef}>
        <button
          className="flex items-center bg-gray-100 border rounded-full px-4 py-2 hover:bg-gray-200 hover:shadow-lg transition-all duration-300"
          onClick={() => setShowFilter(!showFilter)}
        >
          <CiFilter className="w-5 h-5 text-gray-500 mr-2" />
          <span className="text-gray-600">Filters</span>
        </button>

        {/* Filter dropdown */}
        {showFilter && (
          <div className="absolute right-0 mt-2 w-64 bg-white shadow-md rounded-lg p-4">
            <h3 className="font-semibold mb-2">Filter By</h3>

            {/* Academic Year Filter */}
            <div className="mb-4">
              <label className="block mb-1">Academic Year</label>
              <select
                className="w-full border px-3 py-2 rounded-lg"
                onChange={(e) => handleFilterChange("academicYear", e.target.value)}
                value={filters.academicYear}
              >
                <option value="">Select Year</option>
                {availableFilters.academicYear.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Class/Department Filter */}
            <div className="mb-4">
              <label className="block mb-1">Class/Department</label>
              <select
                className="w-full border px-3 py-2 rounded-lg"
                onChange={(e) => handleFilterChange("class", e.target.value)}
                value={filters.class}
              >
                <option value="">Select Class</option>
                {availableFilters.classes.map((classItem) => (
                  <option key={classItem} value={classItem}>
                    {classItem}
                  </option>
                ))}
              </select>
            </div>

            {/* Section Filter */}
            <div className="mb-4">
              <label className="block mb-1">Section</label>
              <select
                className="w-full border px-3 py-2 rounded-lg"
                onChange={(e) => handleFilterChange("section", e.target.value)}
                value={filters.section}
              >
                <option value="">Select Section</option>
                {availableFilters.sections.map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </select>
            </div>

            {/* Group Name Filter */}
            <div>
              <label className="block mb-1">Group Name</label>
              <select
                className="w-full border px-3 py-2 rounded-lg"
                onChange={(e) => handleFilterChange("groupName", e.target.value)}
                value={filters.groupName}
              >
                <option value="">Select Group</option>
                {availableFilters.groupName.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(TopNavigationWithFilters);
