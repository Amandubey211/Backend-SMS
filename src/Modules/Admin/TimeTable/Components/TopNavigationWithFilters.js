import React, { useState, useEffect } from "react";

const TopNavigationWithFilters = ({ onSearch, onFilterChange, academicYears }) => {
  const [filters, setFilters] = useState({
    name: "",
    classId: "",
    type: "",
    status: "",
    academicYear: academicYears?.length ? academicYears[0]._id : "", // Default to first academic year
  });

  useEffect(() => {
    if (academicYears?.length) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        academicYear: academicYears[0]._id, // Default to the first academic year
      }));
    }
  }, [academicYears]);

  // Handle filter change for text input fields
  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filterName]: value }));
  };

  // Handle apply filters
  const applyFilters = () => {
    onFilterChange(filters); // Trigger the filter update in parent component
  };

  return (
    <div className="flex justify-between items-center mb-6">
      {/* Name Filter */}
      <div className="relative flex items-center max-w-xs w-full mr-4">
        <input
          type="text"
          placeholder="Filter by Name"
          value={filters.name}
          onChange={(e) => handleFilterChange("name", e.target.value)}
          className="px-4 py-2 border rounded-full focus:outline-none w-full transition-all duration-300"
        />
      </div>

      {/* Class ID Filter */}
      <div className="relative flex items-center max-w-xs w-full mr-4">
        <input
          type="text"
          placeholder="Filter by Class ID"
          value={filters.classId}
          onChange={(e) => handleFilterChange("classId", e.target.value)}
          className="px-4 py-2 border rounded-full focus:outline-none w-full transition-all duration-300"
        />
      </div>

      {/* Type Filter */}
      <div className="relative max-w-xs w-full mr-4">
        <select
          value={filters.type}
          onChange={(e) => handleFilterChange("type", e.target.value)}
          className="px-4 py-2 border rounded-full focus:outline-none w-full transition-all duration-300"
        >
          <option value="">All Types</option>
          <option value="weekly">Weekly</option>
          <option value="exam">Exam</option>
          <option value="event">Event</option>
          <option value="others">Others</option>
        </select>
      </div>

      {/* Status Filter */}
      <div className="relative max-w-xs w-full mr-4">
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="px-4 py-2 border rounded-full focus:outline-none w-full transition-all duration-300"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Academic Year Filter */}
      <div className="relative max-w-xs w-full">
        <select
          value={filters.academicYear}
          onChange={(e) => handleFilterChange("academicYear", e.target.value)}
          className="px-4 py-2 border rounded-full focus:outline-none w-full transition-all duration-300"
        >
          {academicYears.map((year) => (
            <option key={year._id} value={year._id}>
              {year.year}
            </option>
          ))}
        </select>
      </div>

      {/* Apply Filters Button */}
      <button
        onClick={applyFilters}
        className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-all duration-300"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default React.memo(TopNavigationWithFilters);
