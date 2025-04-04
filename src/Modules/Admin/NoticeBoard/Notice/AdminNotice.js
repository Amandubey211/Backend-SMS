import React, { useEffect, useState } from "react";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import NoDataFound from "../../../../Components/Common/NoDataFound";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNoticesThunk,
  deleteNoticeThunk,
} from "../../../../Store/Slices/Admin/NoticeBoard/Notice/noticeThunks";
import AdminNoticeItem from "./AdminNoticeItem";
import DeleteModal from "../../../../Components/Common/DeleteModal";
import AddNotice from "./AddNotice";
import Sidebar from "../../../../Components/Common/Sidebar";
import {
  resetEditMode,
  setEditMode,
  setSelectedNotice,
  setTitleToDelete,
  resetTitleToDelete,
} from "../../../../Store/Slices/Admin/NoticeBoard/Notice/noticeSlice";
import { useTranslation } from "react-i18next";
import { PERMISSIONS } from "../../../../config/permission";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";
import ProtectedAction from "../../../../Routes/ProtectedRoutes/ProtectedAction";
import { DatePicker, Select, Tooltip, Button } from "antd";
import { motion } from "framer-motion";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";

// Icons
import { FiPlus } from "react-icons/fi";
import { CiSearch } from "react-icons/ci";
import { FaSync } from "react-icons/fa";
import Pagination from "../../../../Components/Common/pagination";

// Custom shimmer component mimicking the Notice item layout
const ShimmerNoticeItem = () => {
  return (
    <motion.div
      className="border-t p-4 bg-white animate-pulse"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex gap-6">
        <div className="bg-blue-300 rounded-md h-16 w-16" />
        <div className="flex-1 space-y-2">
          <div className="h-6 bg-gray-300 rounded w-3/4" />
          <div className="flex gap-4">
            <div className="h-4 bg-gray-300 rounded w-1/4" />
            <div className="h-4 bg-gray-300 rounded w-1/4" />
          </div>
          <div className="h-4 bg-gray-300 rounded w-1/2" />
        </div>
      </div>
    </motion.div>
  );
};

const { RangePicker } = DatePicker;
const { Option } = Select;

const AdminNotice = () => {
  const { t } = useTranslation("admNotice");
  const {
    loading,
    error,
    notices,
    editMode,
    titleToDelete,
    currentPage,
    totalNotices,
  } = useSelector((store) => store.admin.notice);
  const role = useSelector((store) => store.common.auth.role);
  const dispatch = useDispatch();

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState([]);
  const [dateFilterValue, setDateFilterValue] = useState([]); // AntD RangePicker value
  const [priorityFilter, setPriorityFilter] = useState("all");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    dispatch(fetchNoticesThunk({ page, limit }));
  }, [dispatch, page, limit]);

  // Filter logic: match on Title or Author, plus optional date and priority checks
  const filteredNotices = notices?.filter((notice) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      notice?.title?.toLowerCase().includes(query) ||
      notice?.authorName?.toLowerCase().includes(query);

    let matchesDate = true;
    if (dateFilter && dateFilter[0] && dateFilter[1]) {
      const noticeDate = new Date(notice.startDate);
      const startFilter = new Date(dateFilter[0]);
      const endFilter = new Date(dateFilter[1]);
      matchesDate = noticeDate >= startFilter && noticeDate <= endFilter;
    }

    const matchesPriority =
      priorityFilter === "all" ||
      notice.priority?.toLowerCase() === priorityFilter.toLowerCase();

    return matchesSearch && matchesDate && matchesPriority;
  });

  // Handlers
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDateFilter = (dates, dateStrings) => {
    setDateFilterValue(dates);
    setDateFilter(dateStrings);
  };

  const handlePriorityFilter = (value) => {
    setPriorityFilter(value);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setDateFilter([]);
    setDateFilterValue([]);
    setPriorityFilter("all");
    // Optionally re-fetch or reset to page 1
    dispatch(fetchNoticesThunk(1));
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setNoticeToDelete(null);
    dispatch(resetTitleToDelete());
  };

  const confirmDelete = async () => {
    await dispatch(deleteNoticeThunk(noticeToDelete));
    setDeleteModalOpen(false);
    setNoticeToDelete(null);
    dispatch(resetTitleToDelete());
  };

  const toggleAccordion = (index) =>
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));

  const handleSidebarClose = () => {
    setSidebarOpen(false);
    dispatch(resetEditMode());
  };

  const handleEditNotice = (notice) => {
    dispatch(setSelectedNotice(notice));
    dispatch(setEditMode(true));
    setSidebarOpen(true);
  };

  const handlePageChange = (page) => {
    dispatch(fetchNoticesThunk(page));
  };

  useNavHeading(t("Noticeboard"), t("Notices"));

  return (
    <Layout title={"Notice | Student diwan"}>
      <DashLayout>
        <div className="p-5">
          {/* Filter Section */}
          <div className="flex flex-wrap gap-4 p-2 items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Search Box (Rounded Full) */}
              <div className="relative flex items-center max-w-xs w-full">
                <input
                  type="text"
                  placeholder={t("Search by Notice or Author")}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 w-full"
                />
                <button className="absolute right-3">
                  <CiSearch className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Date Filter (Rounded Full) */}
              <RangePicker
                style={{ height: "40px" }}
                onChange={handleDateFilter}
                value={dateFilterValue}
              />

              {/* Priority Filter (Rounded Full) */}
              <Select
                value={priorityFilter}
                style={{
                  minWidth: "150px",
                  height: "40px",
                  borderRadius: "9999px",
                }}
                onChange={handlePriorityFilter}
              >
                <Option value="all">{t("All Priorities")}</Option>
                <Option value="high priority">{t("High Priority")}</Option>
                <Option value="low priority">{t("Low Priority")}</Option>
              </Select>

              {/* Reset Filters Button with Spin Animation on Hover */}
              <Tooltip title={t("Reset Filters")}>
                <Button
                  onClick={handleResetFilters}
                  type="default"
                  shape="circle"
                  className="group border-gray-300 text-gray-600 hover:border-purple-500 hover:text-purple-600 transition-colors duration-300"
                  icon={
                    <FaSync className="group-hover:animate-spin transition-transform duration-300" />
                  }
                />
              </Tooltip>
            </div>

            {/* Add Notice Button */}
            <ProtectedAction requiredPermission={PERMISSIONS.ADD_NEW_NOTICE}>
              <button
                className="flex items-center justify-center border border-transparent bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-300 transform hover:scale-105 hover:shadow-xl"
                onClick={() => {
                  dispatch(resetEditMode());
                  dispatch(setSelectedNotice(null));
                  setSidebarOpen(true);
                }}
              >
                <FiPlus className="mr-2" />
                {t("Add Notice")}
              </button>
            </ProtectedAction>
          </div>

          {/* Notices Section */}
          <ProtectedSection
            requiredPermission={PERMISSIONS.SHOW_NOTICES}
            title={"Notices"}
          >
            <div className="mt-5">
              {loading ? (
                <>
                  <ShimmerNoticeItem />
                  <ShimmerNoticeItem />
                  <ShimmerNoticeItem />
                  <ShimmerNoticeItem />
                  <ShimmerNoticeItem />
                </>
              ) : error ? (
                <NoDataFound
                  title={t(" Notices ")}
                  desc={t("Create one by Clicking on Add Notice.")}
                />
              ) : filteredNotices?.length > 0 ? (
                filteredNotices.map((notice, index) => (
                  <AdminNoticeItem
                    key={notice?._id}
                    notice={notice}
                    index={index}
                    activeIndex={activeIndex}
                    toggleAccordion={toggleAccordion}
                    handleEditNotice={handleEditNotice}
                    setDeleteModalOpen={setDeleteModalOpen}
                    setNoticeToDelete={setNoticeToDelete}
                  />
                ))
              ) : (
                <NoDataFound
                  title={t("Notices ")}
                  desc={t(" Please add a new notice.")}
                />
              )}
            </div>
          </ProtectedSection>

          {/* Pagination on Bottom Right */}
          {totalNotices > 0 && (
            <Pagination
              page={page}
              totalPages={Math.ceil(totalNotices / limit)}
              totalRecords={totalNotices}
              limit={limit}
              setPage={setPage}
              setLimit={setLimit}
              t={t}
            />
          )}

          {/* Sidebar for Add/Edit Notice */}
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={handleSidebarClose}
            title={editMode ? t("Edit Notice") : t("Add Notice")}
            width="70%"
          >
            <AddNotice isEditing={editMode} onClose={handleSidebarClose} />
          </Sidebar>

          {/* Delete Confirmation Modal */}
          <DeleteModal
            isOpen={isDeleteModalOpen}
            onClose={handleDeleteModalClose}
            onConfirm={confirmDelete}
            title={`${t(titleToDelete)}`}
          />
        </div>
      </DashLayout>
    </Layout>
  );
};

export default AdminNotice;
