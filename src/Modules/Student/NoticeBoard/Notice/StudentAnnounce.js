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
import { FiRefreshCw } from "react-icons/fi";

const StudentAnnounce = () => {
  const {
    loading,
    error,
    noticeData,
    activeIndex,
    searchTerm,
    totalPages,
    currentPage,
    totalNotices,
    priority,
  } = useSelector((store) => store.student.studentAnnouncement);
  const { showError } = useSelector((store) => store?.common?.alertMsg);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  useNavHeading("Notice");

  console.log("data notice", currentPage, totalNotices, totalPages);

  const formatDate = (isoDate) => {
    return new Date(isoDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const filteredNotices = () => {
    return noticeData.filter((notice) => {
      const titleMatch = notice?.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      const priorityMatch = priority ? notice.priority === priority : true;

      const dateMatch =
        (!startDate || new Date(notice.startDate) >= new Date(startDate)) &&
        (!endDate || new Date(notice.endDate) <= new Date(endDate));

      return titleMatch && priorityMatch && dateMatch;
    });
  };

  const handleSearchTerm = (e) => {
    dispatch(setSearchTerm(e.target.value));
    dispatch(setCurrentPage(1));
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      dispatch(setCurrentPage(newPage));
    }
  };
  const handleDismiss = () => {
    dispatch(setShowError(false));
  };
  useEffect(() => {
    dispatch(
      studentNotice({
        page: currentPage,
        limit: 10,
        search: searchTerm,
        priority: priority,
      })
    ).then((res) => {
      console.log("res", res);
    });
  }, [currentPage, dispatch, priority, searchTerm]);

  const handleApplyFilters = () => {
    dispatch(setSearchTerm(""));
    dispatch(setPriority(""));
    dispatch(setCurrentPage(1));
    setEndDate(null);
    setStartDate(null);
  };
  return (
    <Layout title="Event">
      <DashLayout>
        <div className="ps-5 pt-3 ">
          <h1 className="mb-1 bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent font-semibold bg-clip-text">
            {t("Student Notice Board", gt.stdNoticeboard)}
          </h1>

          <div className="flex flex-row w-[100%] gap-x-4 items-center justify-between mt-2 pr-5">
            <div className="relative flex items-center w-[50%] ">
              <input
                type="text"
                placeholder={t("Search by Notice", gt.stdNoticeboard)}
                value={searchTerm}
                onChange={(e) => handleSearchTerm(e)}
                className="px-4 py-2 border rounded-full focus:outline-none focus:ring-1 focus:ring-gray-300 w-full"
              />
              <button className="absolute right-3">
                <CiSearch className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            {/* Search & Priority Filters */}
            <div className="w-[23%] ">
              <select
                value={priority}
                onChange={(e) => dispatch(setPriority(e.target.value))}
                className="px-3 py-2 border rounded w-full text-md text-gray-500"
              >
                <option value="" className="text-gray-500">
                  Select Priority
                </option>
                <option value="High priority">High Priority</option>
                <option value="Low priority">Low Priority</option>
              </select>
            </div>
            <div className="md:w-[23%] pr-2 mb-2 md:mb-0">
              <input
                type="date"
                value={startDate ? startDate.toISOString().split("T")[0] : ""}
                onChange={(e) =>
                  setStartDate(e.target.value ? new Date(e.target.value) : null)
                }
                className="px-3 py-2 border rounded w-full text-md text-gray-500"
              />
            </div>
            <div className=" md:w-[23%]">
              <input
                type="date"
                value={endDate ? endDate.toISOString().split("T")[0] : ""}
                onChange={(e) =>
                  setEndDate(e.target.value ? new Date(e.target.value) : null)
                }
                className="px-3 py-2 border rounded w-full text-md text-gray-500"
              />
            </div>
            <FiRefreshCw
              onClick={handleApplyFilters}
              size={25}
              className="ml-auto cursor-pointer text-gray-500 hover:text-blue-500
                        transition-transform duration-300 hover:rotate-180"
              title="Reset Filters"
            />
          </div>
        </div>

        {/* Content Handling */}
        <div className="mt-5 rounded-lg w-[100%]">
          {loading ? (
            <div className="flex flex-col justify-center items-center text-center min-h-[300px]">
              <Spinner />
            </div>
          ) : filteredNotices()?.length > 0 ? (
            filteredNotices()?.map((notice, index) => (
              <NoticeItem
                key={notice.id}
                notice={notice}
                index={index}
                formatDate={formatDate}
              />
            ))
          ) : (
            !loading &&
            filteredNotices()?.length === 0 && (
              <div className="flex flex-col justify-center items-center text-center min-h-[300px]">
                <NoDataFound title="Notices" />
              </div>
            )
          )}
        </div>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex w-[100%] justify-center p-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 mx-1 rounded-md border-purple-500 text-purple-500 bg-white 
              hover:bg-purple-500 hover:text-white transition-all duration-300 text-sm
              disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <span className="px-4 py-2 mx-1 text-sm font-semibold text-gray-700">
              {`Page ${currentPage} of ${totalPages}`}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 mx-1 rounded-md border-purple-500 text-purple-500 bg-white text-sm
                 hover:bg-purple-500 hover:text-white transition-all duration-300 
                 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {!loading && showError && (
          <OfflineModal error={error} onDismiss={handleDismiss} />
        )}
      </DashLayout>
    </Layout>
  );
};

export default StudentAnnounce;
