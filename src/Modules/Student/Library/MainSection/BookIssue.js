import React, { useState, useEffect, useMemo } from "react";
import { GoDotFill } from "react-icons/go"; // Importing the dot icon for checked state
import axios from "axios";
import { baseUrl } from "../../../../config/Common";
import BookIssueRow from "../SubClass/component/BookIssueRow";
import NoDataFound from "../../../../Components/Common/NoDataFound";
import Spinner from "../../../../Components/Common/Spinner"; // Import the Spinner
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../../../../Store/Slices/Student/Library/bookIssuesSlice";
import { GoAlertFill } from "react-icons/go";
import { gt } from "../../../../Utils/translator/translation";
import { useTranslation } from "react-i18next";

const BookIssue = () => {

  const { loading, error, issueBooks, filters } = useSelector((store) => store.student.studentIssueBooks);
  const {  activeTab } = useSelector((store) => store.student.studentLibraryBooks);
 
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFilters({ ...filters, [name]: value }));
  };

  const filteredBookIssueData = () => {
    if (filters?.status === "All") {
      return issueBooks;
    }
    return issueBooks.filter((item) => item.status === filters.status);
  };


  return (
    <div className="">
      {/* Radio buttons for filtering */}
      <div className="flex gap-4 mb-4 ps-5">
        {["All", "Pending", "Return"].map((status) => (
          <label key={status} className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="status"
              value={status}
              checked={filters.status === status}
              onChange={handleFilterChange}
              className="hidden"
            />
            <div
              className={`h-5 w-5 rounded-full mr-2 flex items-center justify-center border-2 transition-colors duration-300 ${filters.status === status
                ? "border-green-500"
                : "border-gray-300"
                }`}
            >
              {/* Icon for selected radio button */}
              {filters.status === status && (
                <GoDotFill className="text-green-500" size={18} />
              )}
            </div>
            <span
              className={`transition-colors duration-300 text-md ${filters.status === status ? "text-gradient" : "text-gray-600"
                } hover:text-pink-500 focus:outline-none`}
            >
              {t(status,gt.stdLibrary)}
            </span>
          </label>
        ))}
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto bg-white">
        {
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 bg-gray-100">
                <th className="px-5 py-3 border-b border-gray-200">
                  {t('Issue Book', gt.stdLibrary)}
                </th>
                <th className="px-5 py-3 border-b border-gray-200"> {t('Author', gt.stdLibrary)} </th>
                <th className="px-5 py-3 border-b border-gray-200"> {t('Category', gt.stdLibrary)} </th>
                <th className="px-5 py-3 border-b border-gray-200">
                  {t('Issue Date', gt.stdLibrary)}
                </th>
                <th className="px-5 py-3 border-b border-gray-200">
                  {t('Return Date', gt.stdLibrary)}
                </th>
                <th className="px-5 py-3 border-b border-gray-200">{t('Status', gt.stdLibrary)}</th>
              </tr>
            </thead>
            <tbody role="rowgroup">

              {/* Display Loading Spinner */}
              {loading && (
                <tr>
                  <td colSpan="6" className="text-center py-10">
                    <Spinner />
                  </td>
                </tr>
              )}

              {/* Display Error Message */}
              { !loading && activeTab == "BookIssue"  &&  error && (
                <tr>
                  <td colSpan="6" className="text-center py-20 text-red-600">
                    <GoAlertFill className="inline-block mb-2 w-12 h-12 mb-3" />
                    <p className="text-lg font-semibold">{error}</p>
                  </td>
                </tr>
              )}

              {/* Display No Data Found */}
              {!loading && !error && issueBooks?.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-20">
                    <NoDataFound />
                  </td>
                </tr>
              )}

              {!loading && !error && !issueBooks?.length === 0 && (filteredBookIssueData()?.map((item) => (
                <BookIssueRow key={item.id} item={item} />
              )))}
            </tbody>
          </table>
        }
      </div>
    </div>
  );
};

export default BookIssue;
