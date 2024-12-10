// SortFilterModal.js
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

const SortFilterModal = ({
  isOpen,
  onClose,
  onApply,
  sortOptions,
  filterOptions,
  department, // Optional: To display department-specific information
}) => {
  const [selectedSort, setSelectedSort] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);

  // Reset selections when the modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedSort(null);
      setSelectedFilters([]);
    }
  }, [isOpen]);

  // Handler for filter checkbox changes
  const handleFilterChange = (filterName) => {
    setSelectedFilters((prev) =>
      prev.includes(filterName)
        ? prev.filter((name) => name !== filterName)
        : [...prev, filterName]
    );
  };

  // Handler for applying sort and filter
  const handleApply = () => {
    onApply({
      sortOption: selectedSort,
      filterOptions: selectedFilters,
    });
    onClose();
  };

  // Handler for refreshing (resetting) sort and filter
  const handleRefresh = () => {
    setSelectedSort(null);
    setSelectedFilters([]);
    onApply({
      sortOption: null,
      filterOptions: [],
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg w-80 p-6 max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {department && (
              <h3 className="text-lg font-semibold mb-4">
                {`Sort & Filter ${
                  department.charAt(0).toUpperCase() + department.slice(1)
                }`}
              </h3>
            )}
            {!department && (
              <h3 className="text-lg font-semibold mb-4">Sort & Filter</h3>
            )}
            <div className="space-y-6">
              {/* Sort Section */}
              {sortOptions && sortOptions.length > 0 && (
                <div>
                  <p className="font-medium text-gray-700">Sort By</p>
                  <div className="ml-4 mt-2 space-y-2">
                    {sortOptions.map((option) => (
                      <label
                        key={option.value}
                        className="inline-flex items-center"
                      >
                        <input
                          type="radio"
                          name="sort"
                          value={option.value}
                          checked={selectedSort === option.value}
                          onChange={() => setSelectedSort(option.value)}
                          className="form-radio h-4 w-4 text-purple-600"
                        />
                        <span className="ml-2 text-gray-700">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Filter Section */}
              {filterOptions && filterOptions.length > 0 && (
                <div>
                  <p className="font-medium text-gray-700">Filter By</p>
                  <div className="ml-4 mt-2 space-y-2 max-h-40 overflow-y-auto">
                    {filterOptions.map((filter) => (
                      <label
                        key={filter.value}
                        className="inline-flex items-center"
                      >
                        <input
                          type="checkbox"
                          value={filter.value}
                          checked={selectedFilters.includes(filter.value)}
                          onChange={() => handleFilterChange(filter.value)}
                          className="form-checkbox h-4 w-4 text-purple-600"
                        />
                        <span className="ml-2 text-gray-700">
                          {filter.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
              >
                Refresh
              </button>
              <button
                onClick={handleApply}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
              >
                Apply
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// PropTypes for type checking
SortFilterModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
  sortOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
  filterOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
  department: PropTypes.string, // Optional
};

SortFilterModal.defaultProps = {
  sortOptions: [],
  filterOptions: [],
  department: "",
};

export default SortFilterModal;
