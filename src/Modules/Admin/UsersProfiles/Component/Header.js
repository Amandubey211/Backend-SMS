// Header.js
import React, { useState } from "react";
import PropTypes from "prop-types";
import { FiLock, FiUserPlus } from "react-icons/fi";
import { GoPlus } from "react-icons/go";
import { useTranslation } from "react-i18next";
import SortFilterModal from "./SortFilterModal"; // Ensure the path is correct based on your project structure
import { useSelector } from "react-redux";
import { CiFilter } from "react-icons/ci";
import { MdOutlineSort } from "react-icons/md";
const Header = ({
  title,
  count,
  sortOptions,
  filterOptions,
  department,
  onSortFilterApply,
  navigateToManageRoles,
  handleCreateRole,
  isAdmin,
  currentSort, // New prop
  currentFilters, // New prop
}) => {
  const { t } = useTranslation("admAccounts");
  const [isSortModalOpen, setSortModalOpen] = useState(false);
  const teacher = useSelector((store) => store.common.auth.userRole);

  return (
    <>
      {/* Header Container */}
      <div className="flex justify-between items-center mb-4 border-b-2 h-20">
        {/* Left Section: Title and Count */}
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            {title}
            {/* Gradient Circle Badge */}
            <span className="inline-flex items-center justify-center">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 p-[2px]">
                <span className="flex items-center justify-center w-full h-full bg-pink-50 rounded-full text-sm font-medium text-pink-600">
                  {count}
                </span>
              </span>
            </span>
          </h2>
          {isAdmin && (
            <div className="flex items-center justify-end">
              <button
                onClick={() => setSortModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-800 bg-white border-2 border-purple-500 rounded-full font-medium hover:shadow-lg hover:bg-purple-50 transition duration-200"
                aria-label="Open Sort and Filter Modal"
              >
                <span>Sort</span>
                <MdOutlineSort className="text-purple-500 text-xl" />
              </button>
            </div>
          )}
          {/* Sort & Filter Modal */}
          {isAdmin && (
            <SortFilterModal
              isOpen={isSortModalOpen}
              onClose={() => setSortModalOpen(false)}
              onApply={onSortFilterApply}
              sortOptions={sortOptions}
              filterOptions={filterOptions}
              department={department} // Optional: Customize modal title
              initialSort={currentSort} // Pass current sort
              initialFilters={currentFilters} // Pass current filters
            />
          )}
        </div>

        {/* Right Section: Action Buttons */}
        {isAdmin && (
          <div className="flex items-center gap-4">
            <button
              onClick={navigateToManageRoles}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md inline-flex items-center gap-2 hover:opacity-90 transition duration-200"
            >
              <FiLock className="text-white" />
              {t("Manage Roles")}
            </button>

            <button
              onClick={handleCreateRole}
              className="inline-flex items-center border border-gray-300 rounded-full ps-4   bg-white hover:shadow-lg transition duration-200 gap-2"
            >
              <span className="text-gray-800 font-medium">
                {t("Create Role")}
              </span>
              <div className="w-11 h-11 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
                <FiUserPlus size={20} />
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Sort & Filter Modal Trigger */}
    </>
  );
};

// Update PropTypes to include new props
Header.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  sortOptions: PropTypes.array.isRequired,
  filterOptions: PropTypes.array.isRequired,
  department: PropTypes.string,
  onSortFilterApply: PropTypes.func.isRequired,
  navigateToManageRoles: PropTypes.func.isRequired,
  handleCreateRole: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  currentSort: PropTypes.string, // New PropType
  currentFilters: PropTypes.array, // New PropType
};

Header.defaultProps = {
  department: "",
  currentSort: null,
  currentFilters: [],
};

export default Header;
