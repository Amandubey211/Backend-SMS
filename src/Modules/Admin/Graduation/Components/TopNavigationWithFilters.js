import React, { useState, useEffect, useRef } from "react";
import { CiSearch, CiFilter } from "react-icons/ci";
import { useTranslation } from 'react-i18next';

const TopNavigationWithFilters = ({ onSearch, onFilterChange }) => {
  const { t } = useTranslation('admDashboard'); // Initialize i18next hook
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    batchStart: "",
    batchEnd: "",
    email: "",
    Q_Id: "",
    admissionNumber: "",
  });

  const filterRef = useRef(null);

  // Real-time search query input handler
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query); // Trigger the search function in real-time
  };

  // Apply filters and search when user clicks the filter button
  const applyFilters = () => {
    const updatedFilters = { ...filters, searchQuery }; // Include search query in the filters
    onFilterChange(updatedFilters); // Trigger the parent function to fetch the filtered list
    setShowFilter(false); // Close the filter dropdown after applying
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setFilters({
      batchStart: "",
      batchEnd: "",
      email: "",
      Q_Id: "",
      admissionNumber: ""
    });
    onFilterChange({}); // Reset the parent filter function
    onSearch(""); // Reset the search query
  };

  // Handle individual filter changes without triggering a query
  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filterName]: value }));
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
          placeholder={t("Search by Name or Email")}
          value={searchQuery}
          onChange={handleSearchChange} // Update query in real-time
          className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 w-full transition-all duration-300"
        />
        <button className="absolute right-3" onClick={() => onSearch(searchQuery)}>
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
          <span className="text-gray-600">{t("Filters")}</span>
        </button>

        {/* Filter dropdown */}
        {showFilter && (
          <div className="absolute right-0 mt-2 w-72 bg-white shadow-md rounded-lg p-4 z-50">
            <h3 className="font-semibold mb-4">{t("Filter By")}</h3>

            {/* Batch Start Filter */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">{t("Batch Start (Year)")}</label>
              <input
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                placeholder={t("Enter Start Year")}
                className="w-full border px-3 py-2 rounded-lg"
                onChange={(e) => handleFilterChange("batchStart", e.target.value)}
                value={filters.batchStart}
              />
            </div>

            {/* Batch End Filter */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">{t("Batch End (Year)")}</label>
              <input
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                placeholder={t("Enter End Year")}
                className="w-full border px-3 py-2 rounded-lg"
                onChange={(e) => handleFilterChange("batchEnd", e.target.value)}
                value={filters.batchEnd}
              />
            </div>

            {/* Email Filter */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">{t("Email")}</label>
              <input
                type="email"
                placeholder={t("Enter Email")}
                className="w-full border px-3 py-2 rounded-lg"
                onChange={(e) => handleFilterChange("email", e.target.value)}
                value={filters.email}
              />
            </div>

            {/* Q_Id Filter */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">{t("Q_Id")}</label>
              <input
                type="text"
                placeholder={t("Enter Q_Id")}
                className="w-full border px-3 py-2 rounded-lg"
                onChange={(e) => handleFilterChange("Q_Id", e.target.value)}
                value={filters.Q_Id}
              />
            </div>

            {/* Admission Number Filter */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">{t("Admission Number")}</label>
              <input
                type="text"
                placeholder={t("Enter Admission Number")}
                className="w-full border px-3 py-2 rounded-lg"
                onChange={(e) => handleFilterChange("admissionNumber", e.target.value)}
                value={filters.admissionNumber}
              />
            </div>

            {/* Apply and Clear Filters Buttons */}
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all duration-300"
                onClick={clearFilters}
              >
                {t("Clear Filters")}
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-300"
                onClick={applyFilters} // Only trigger query when the button is clicked
              >
                {t("Apply Filters")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(TopNavigationWithFilters);
