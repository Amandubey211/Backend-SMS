// src/Modules/Admin/Verification/TopNavigation.js

import React from "react";
import { CiSearch } from "react-icons/ci";
import { useSelector, useDispatch } from "react-redux";
import {
  setActiveTab,
  setSearchQuery,
} from "../../../Store/Slices/Admin/Verification/VerificationSlice";
import { useTranslation } from 'react-i18next';

const TopNavigation = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation('admVerification');
  const { unVerifiedStudents, rejectedStudents, activeTab, searchQuery } =
    useSelector((state) => state.admin.verification);

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex gap-2 items-center">
        {/* Unverified Students Tab */}
        <h1
          className={`text-xl font-semibold p-1 border rounded-2xl px-4 cursor-pointer transition-all duration-300 ${
            activeTab === "unverified"
              ? "text-purple-500 bg-purple-100"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => dispatch(setActiveTab("unverified"))}
        >
          {t("Unverified Students")} ({unVerifiedStudents?.length})
        </h1>

        {/* Rejected Students Tab */}
        <h1
          className={`text-xl font-semibold p-1 border rounded-2xl px-4 cursor-pointer transition-all duration-300 ${
            activeTab === "rejected"
              ? "text-purple-500 bg-purple-100"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => dispatch(setActiveTab("rejected"))}
        >
          {t("Rejected Students")} ({rejectedStudents?.length})
        </h1>
      </div>

      {/* Search input */}
      <div className="relative flex items-center max-w-xs w-full mr-4">
        <input
          type="text"
          placeholder={t("Search By Email")}
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 w-full transition-all duration-300"
        />
        <button className="absolute right-3">
          <CiSearch className="w-5 h-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default React.memo(TopNavigation);
