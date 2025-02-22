import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { NavLink, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ProtectedAction from "../../../../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../../../../config/permission";

const AnnouncementHeader = ({ onSearch }) => {
  const [filter, setFilter] = useState("all");
  const { cid, sid } = useParams();
  const { t } = useTranslation("admClass");

  // Handle filter change
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    onSearch(event.target.value);
  };

  return (
    <div className="p-3">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold mb-4">{t("All Announcements")}</h2>
        <ProtectedAction requiredPermission={PERMISSIONS.ADD_NEW_ANNOUNCEMENT}>
          <NavLink
            to={`/class/${cid}/${sid}/announcements/create_announcement`}
            className="flex items-center border border-gray-300 ps-5 py-2 rounded-full transition-all duration-300 ease-in-out hover:shadow-md"
          >
            <span className="mr-2">{t("Add New Announcement")}</span>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-12 h-12 flex items-center justify-center">
              <span className="text-3xl -mt-2">+</span>
            </div>
          </NavLink>
        </ProtectedAction>
      </div>
      <div className="flex items-center justify-between ps-5 pe-9 mt-3">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder={t("Search here")}
            className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 w-80 transition-all duration-300 ease-in-out"
            onChange={handleSearchChange}
            aria-label={t("Search")}
          />
          <button
            className="absolute right-3 hover:text-gray-700 transition-all duration-200 ease-in-out"
            aria-label={t("Search")}
          >
            <CiSearch className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-gray-500">{t("Status")}: </span>

          <label className="inline-flex items-center">
            <input
              type="radio"
              name="filter"
              value="all"
              checked={filter === "all"}
              onChange={handleFilterChange}
              className="custom-radio"
            />
            <span className="ml-2">{t("All")}</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="filter"
              value="unread"
              checked={filter === "unread"}
              onChange={handleFilterChange}
              className="custom-radio"
            />
            <span className="ml-2">{t("Unread")}</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementHeader;
