import { RiSearchLine } from "react-icons/ri";
import React from "react";
import { NavLink, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ProtectedAction from "../../../../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../../../../config/permission";

const PageHeader = ({ searchQuery, handleSearchChange }) => {
  const { cid, sid } = useParams();
  const { t } = useTranslation("admClass");

  return (
    <div className="flex items-center justify-between w-full p-4 bg-white border-gray-300">
      <h1 className="text-lg font-semibold text-gray-800">{t("All Pages")}</h1>
      <div className="flex items-center space-x-4">
        <div className="relative flex items-center w-80">
          <input
            type="text"
            placeholder={t("Search by Title or Author")}
            value={searchQuery}
            onChange={handleSearchChange}
            className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 w-full"
            aria-label={t("Search Input")}
          />
          <button className="absolute right-3" aria-label={t("Search")}>
            <RiSearchLine className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <ProtectedAction requiredPermission={PERMISSIONS.CREATE_PAGE}>
          <NavLink
            to={`/class/${cid}/${sid}/page/create_Page`}
            className="flex items-center border border-gray-300 ps-5 rounded-full"
            aria-label={t("Add new Page")}
          >
            <span className="mr-2 font-normal">{t("Add new Page")}</span>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
              <span className="text-3xl -mt-2">+</span>
            </div>
          </NavLink>
        </ProtectedAction>
      </div>
    </div>
  );
};

export default PageHeader;
