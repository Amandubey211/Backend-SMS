import React, { useEffect } from "react";
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
      const titleMatch = notice?.title?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Ensure priority filtering works
      const priorityMatch = priority ? notice.priority === priority : true;

      return titleMatch && priorityMatch;
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

  return (
    <Layout title="Event">
      <DashLayout>
        <div className="ps-5 pt-3 ">
          <h1 className="mb-1 bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent font-semibold bg-clip-text">
            {t("Student Notice Board", gt.stdNoticeboard)}
          </h1>

          <div className="flex flex-row w-[60%] items-center justify-between mt-2">
            <div className="relative flex items-center w-[65%] ">
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
            <div className="w-[25%] pr-4">
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
          </div>
        </div>

        {/* Content Handling */}
        <div className="mt-5 rounded-lg overflow-auto">
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
