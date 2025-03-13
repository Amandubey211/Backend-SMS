import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Layout from "../../../../Components/Common/Layout";
import ParentDashLayout from "../../../../Components/Parents/ParentDashLayout.js";
import { MdExpandMore } from "react-icons/md";
import { RiSignalWifiErrorFill } from "react-icons/ri";
import { IoCalendarOutline } from "react-icons/io5";
import CalendarIcon from "../../../../Assets/ParentAssets/svg/calender.svg";
import announcementIcon from "../../../../Assets/NoticeBoardAssets/noticeIcon.png";
import { CiSearch } from "react-icons/ci";
import { fetchAllNotices } from "../../../../Store/Slices/Parent/NoticeBoard/notice.action.js";
import { useTranslation } from "react-i18next";
import { NoticeSkeleton } from "../../Skeletons.js";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading .js";
import Pagination from "../../../../Components/Common/pagination.js";

const AllNotice = () => {
  const { t } = useTranslation("prtNotices");
  const dispatch = useDispatch();
  const { notices, loading, error, totalPages, currentPage, totalNotices } =
    useSelector((state) => state?.Parent?.notice || {});

  // State for search, pagination, filtering, and sorting
  const [search, setSearchTerm] = useState("");
  const [page, setPage] = useState(currentPage || 1);
  const [limit, setLimit] = useState(5);
  const [filterPriority, setFilterPriority] = useState("All");
  // Default sortOrder is "desc" (Newest First)
  const [sortOrder, setSortOrder] = useState("desc");

  // State for controlling the accordion open/close state
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return t("No Date");
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Dispatch the API call with all parameters
  useEffect(() => {
    const priorityParam = filterPriority === "All" ? "" : filterPriority;
    dispatch(
      fetchAllNotices({
        page,
        limit,
        search,
        priority: priorityParam,
        sortOrder,
        sortBy: "startDate",
      })
    );
  }, [dispatch, page, limit, search, filterPriority, sortOrder]);

  useNavHeading(t("Notice Board"));

  // Handler to reset all filters and search parameters to default values
  const handleResetAll = () => {
    setSearchTerm("");
    setFilterPriority("All");
    setSortOrder("desc");
    setPage(1);
    // The useEffect will re-dispatch fetchAllNotices when state changes.
  };

  return (
    <Layout title={t("Parents | Noticeboard")}>
      <ParentDashLayout hideAvatarList={true}>
        <div className="p-4">
          {/* Search, Filter, Sort Controls and Reset Button */}
          <div className="flex items-center justify-between p-2">
            {/* Search Input */}
            <div className="relative flex items-center max-w-xs w-full mr-4">
              <input
                type="text"
                placeholder={t("Search here")}
                value={search}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 w-full"
              />
              <button className="absolute right-3">
                <CiSearch className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            {/* Filter, Sort Dropdowns and Reset All Button */}
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm text-gray-600">
                  {t("Filter by Priority")}
                </label>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-2 py-1 border rounded"
                >
                  <option value="All">{t("All")}</option>
                  <option value="High priority">{t("High Priority")}</option>
                  <option value="Low priority">{t("Low Priority")}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600">
                  {t("Sort by Date")}
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="px-2 py-1 border rounded"
                >
                  <option value="desc">{t("Newest First")}</option>
                  <option value="asc">{t("Oldest First")}</option>
                </select>
              </div>
              <div>
              <label className="block text-sm text-gray-600">
                  {t("Hard Reset")}
                </label>
                <button
                onClick={handleResetAll}
                className="px-3 py-1 border rounded text-sm text-gray-600"
              >
                {t("Reset All")}
              </button>
              </div>
             
            </div>
          </div>

          {/* Notice List */}
          <div className="mt-5 overflow-auto">
            {loading ? (
              <NoticeSkeleton count={limit || 5} />
            ) : error ? (
              <div className="flex flex-col items-center justify-center mt-6">
                <RiSignalWifiErrorFill className="text-gray-400 text-8xl mb-6" />
                <p className="text-gray-600 text-lg text-center mt-2">
                  {t("Failed to fetch notices")}
                </p>
              </div>
            ) : notices?.length > 0 ? (
              notices.map((notice, index) => (
                <div key={notice?.id || index} className="border-t">
                  <div
                    className="cursor-pointer p-2 flex flex-col bg-white"
                    onClick={() => toggleAccordion(index)}
                  >
                    <div className="flex gap-6 px-3 py-2 items-top">
                      {/* Icon */}
                      <div className="border rounded-md flex items-center justify-center h-16 w-16">
                        <img
                          className="h-12 w-12"
                          src={announcementIcon}
                          alt={t("Announcement Icon")}
                        />
                      </div>

                      {/* Title and Date */}
                      <div className="flex-1 flex flex-col gap-2">
                        <h2 className="font-semibold text-lg break-words">
                          {notice?.title}
                          <span className="ml-4 text-sm text-gray-500">
                            ({t("Posted by")}{" "}
                            <span className="text-sm text-gray-700">
                              {notice?.authorName || "-"}
                            </span>
                            )
                          </span>
                        </h2>
                        <div className="flex items-center text-xs">
                          <IoCalendarOutline className="text-gray-400" />
                          <span className="ml-2 text-sm text-gray-500">
                            {formatDate(notice?.startDate)}
                          </span>
                          <div
                            className={`ml-3 px-3 py-1 text-xs rounded-md border ${
                              notice?.priority?.toLowerCase() === "high priority"
                                ? "border-pink-500 text-pink-600 bg-pink-100/30 shadow-sm"
                                : "border-gray-400 text-gray-600 bg-gray-100/30 shadow-sm"
                            }`}
                          >
                            {notice?.priority || t("Low Priority")}
                          </div>
                        </div>
                      </div>

                      {/* Expand Icon */}
                      <div className="flex items-center">
                        <MdExpandMore
                          className={`text-2xl text-gray-600 transition-transform duration-300 ease-in-out ${
                            activeIndex === index ? "rotate-180" : "rotate-0"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Description */}
                    {activeIndex === index && (
                      <div className="p-4 text-sm text-gray-700">
                        <pre className="whitespace-pre-wrap font-sans">
                          {notice?.description || t("No description available")}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <img
                  src={CalendarIcon}
                  style={{ width: "40px", height: "40px", marginBottom: "10px" }}
                  alt="calendar"
                />
                <p className="text-gray-600 text-lg">
                  {t("No Notices are available")}
                </p>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          <Pagination
            page={page}
            totalPages={totalPages}
            totalRecords={totalNotices}
            limit={limit}
            setPage={setPage}
            setLimit={setLimit}
            t={t}
          />
        </div>
      </ParentDashLayout>
    </Layout>
  );
};

export default AllNotice;
