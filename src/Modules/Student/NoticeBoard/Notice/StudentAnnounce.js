import React, { useEffect, useState } from "react";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Student/StudentDashLayout";
import NoDataFound from "../../../../Components/Common/NoDataFound";
import Spinner from "../../../../Components/Common/Spinner";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import { useDispatch, useSelector } from "react-redux";
import { studentNotice } from "../../../../Store/Slices/Student/Noticeboard/notice.action";
import {
  setCurrentPage,
  setSearchTerm,
  setPriority,
} from "../../../../Store/Slices/Student/Noticeboard/noticeSlice";
import NoticeItem from "./NoticeItem";
import { useTranslation } from "react-i18next";
import { gt } from "../../../../Utils/translator/translation";
import { setShowError } from "../../../../Store/Slices/Common/Alerts/alertsSlice";
import OfflineModal from "../../../../Components/Common/Offline";
import { CiSearch } from "react-icons/ci";
import Pagination from "../../../../Components/Common/pagination";

const StudentAnnounce = () => {
  const {
    loading,
    error,
    noticeData,
    searchTerm,
    totalPages,
    currentPage,
    totalNotices,
    priority,
  } = useSelector((store) => store.student.studentAnnouncement);
  const { showError } = useSelector((store) => store?.common?.alertMsg);

  // Local state for pagination limit (if you want dynamic page size)
  const [limit, setLimit] = useState(10);
  // Add sortOrder state ("desc" for descending, "asc" for ascending)
  const [sortOrder, setSortOrder] = useState("desc");

  const dispatch = useDispatch();
  const { t } = useTranslation();
  useNavHeading("Notice");

  const formatDate = (isoDate) => {
    return new Date(isoDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Instead of filtering/sorting on the client, we simply use the API response.
  const noticesToDisplay = noticeData;

  // Update search term & reset to first page
  const handleSearchTerm = (e) => {
    dispatch(setSearchTerm(e.target.value));
    dispatch(setCurrentPage(1));
  };

  // Function to handle page changes from the Pagination component
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      dispatch(setCurrentPage(newPage));
    }
  };

  // Hide error modal
  const handleDismiss = () => {
    dispatch(setShowError(false));
  };

  // Fetch notices on mount & whenever page/priority/search/sortOrder changes.
  // The API is now expected to handle filtering and sorting.
  useEffect(() => {
    dispatch(
      studentNotice({
        page: currentPage,
        limit: limit,
        search: searchTerm,
        priority: priority,
        sortOrder: sortOrder,
        sortBy: "startDate",
      })
    );
  }, [currentPage, limit, dispatch, priority, searchTerm, sortOrder]);

  // Reset all filters (search term, priority, and sort order)
  const handleApplyFilters = () => {
    dispatch(setSearchTerm(""));
    dispatch(setPriority(""));
    dispatch(setCurrentPage(1));
    setSortOrder("desc");
  };

  return (
    <Layout title="Event">
      <DashLayout>
        <div className="ps-5 pt-3 ">
          <h1 className="mb-1 bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent font-semibold bg-clip-text">
            {t("Student Notice Board", gt.stdNoticeboard)}
          </h1>

          <div className="flex items-center justify-between flex-nowrap gap-4 overflow-x-auto py-2 pr-5">
            {/* Search Bar */}
            <div className="flex-none w-96 relative pl-1">
              <input
                type="text"
                placeholder={t("Search by Notice", gt.stdNoticeboard)}
                value={searchTerm}
                onChange={handleSearchTerm}
                className="px-4 py-2 border rounded-full focus:outline-none focus:ring-1 focus:ring-gray-300 w-full"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <CiSearch className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            {/* Filters Container */}
            <div className="flex flex-none items-center gap-4 whitespace-nowrap">
              {/* Priority Filter */}
              <div className="flex-none">
                <label
                  htmlFor="priority"
                  className="block text-xs text-gray-500 mb-1"
                >
                  Select Priority
                </label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => dispatch(setPriority(e.target.value))}
                  className="px-3 py-2 border rounded text-md text-gray-500"
                >
                  <option value="" className="text-gray-500">
                    Select Priority
                  </option>
                  <option value="High priority">High Priority</option>
                  <option value="Low priority">Low Priority</option>
                </select>
              </div>

              {/* Sort Order Filter */}
              <div className="flex-none">
                <label className="block text-xs text-gray-500 mb-1">
                  Sort Order
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="px-3 py-2 border rounded text-md text-gray-500"
                >
                  <option value="desc">{t("Newest First")}</option>
                  <option value="asc">{t("Oldest First")}</option>
                </select>
              </div>

              {/* Reset All Button */}
              <div className="flex-none">
                <label className="block text-xs text-gray-500 mb-1">
                  Hard Reset
                </label>
                <button
                  onClick={handleApplyFilters}
                  className="p-2 border rounded-md whitespace-nowrap text-md text-gray-500"
                >
                  Reset All
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Handling */}
        <div className="mt-5 rounded-lg w-full">
          {loading ? (
            <div className="flex flex-col justify-center items-center text-center min-h-[300px]">
              <Spinner />
            </div>
          ) : noticesToDisplay?.length > 0 ? (
            noticesToDisplay.map((notice, index) => (
              <NoticeItem
                key={notice.id}
                notice={notice}
                index={index}
                formatDate={formatDate}
              />
            ))
          ) : (
            !loading &&
            noticesToDisplay?.length === 0 && (
              <div className="flex flex-col justify-center items-center text-center min-h-[300px]">
                <NoDataFound title="Notices" />
              </div>
            )
          )}
        </div>

        {/* Pagination Controls */}
        {totalNotices > 0 && (
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            totalRecords={totalNotices}
            limit={limit}
            setPage={handlePageChange}
            setLimit={setLimit}
            t={t}
          />
        )}

        {!loading && showError && (
          <OfflineModal error={error} onDismiss={handleDismiss} />
        )}
      </DashLayout>
    </Layout>
  );
};

export default StudentAnnounce;
