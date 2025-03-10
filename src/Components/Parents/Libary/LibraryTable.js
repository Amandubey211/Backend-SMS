import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLibraryBooks } from "../../../Store/Slices/Parent/Library/library.action";
import { FaBookOpen } from "react-icons/fa";
import { RiSignalWifiErrorFill } from "react-icons/ri";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { LibraryRowSkeleton } from "../../../Modules/Parents/Skeletons";
import bookNew from "../../../Assets/ParentAssets/images/book_new.png"; // Fallback book image
import Pagination from "../../Common/pagination";
import { CiSearch } from "react-icons/ci";
import BookPreviewPortal from "../../Common/BookPreviewPortal"; // adjust the path as needed

const fallbackProfile = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const LibraryTable = () => {
  const { t } = useTranslation("prtLibrary");
  const dispatch = useDispatch();

  const {
    books = [],
    loading = false,
    error = null,
    currentPage: serverPage = 1,
    totalPages = 1,
    totalBookIsuued = 0,
  } = useSelector((state) => state?.Parent?.library);

  // Local state for query parameters
  const [childFilter, setChildFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(serverPage);
  const [pageSize, setPageSize] = useState(10);

  // State for preview popover
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewPosition, setPreviewPosition] = useState({ top: 0, left: 0 });
  const [previewData, setPreviewData] = useState({
    bookName: "",
    bookImage: "",
  });

  useEffect(() => {
    setPage(serverPage);
  }, [serverPage]);

  useEffect(() => {
    const query = {
      page,
      limit: pageSize,
      search,
      childId: childFilter === "All" ? "" : childFilter,
      status: statusFilter === "All" ? "" : statusFilter,
    };
    dispatch(fetchLibraryBooks(query));
  }, [dispatch, page, pageSize, search, childFilter, statusFilter]);

  const childrenOptions = useMemo(() => {
    const map = {};
    books.forEach((item) => {
      const student = item?.studentId;
      if (student && student._id && !map[student._id]) {
        const fallbackName = [student?.firstName, student?.lastName]
          .filter(Boolean)
          .join(" ");
        map[student._id] = {
          _id: student._id,
          fullName: student?.fullName || (fallbackName ? fallbackName : "N/A"),
          profile: student?.profile || fallbackProfile,
        };
      }
    });
    return Object.values(map);
  }, [books]);

  const formatDate = (dateString) =>
    dateString ? dayjs(dateString).format("DD/MM/YY") : "N/A";

  const paginatedData = books;

  // Event handlers for the preview popover
  const handleMouseEnter = (e, bookName, bookImage) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPreviewPosition({
      top: rect.top, // top position of the trigger element
      left: rect.left + rect.width / 2, // center horizontally
    });
    setPreviewData({ bookName, bookImage });
    setPreviewVisible(true);
  };

  const handleMouseLeave = () => {
    setPreviewVisible(false);
  };

  // Reset all filters to defaults
  const handleReset = () => {
    setChildFilter("All");
    setStatusFilter("All");
    setSearch("");
    setPage(1);
  };

  const renderTableRows = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={7}>
            <LibraryRowSkeleton rows={pageSize || 10} />
          </td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan={7}>
            <div
              className="flex flex-col items-center justify-center text-center py-4"
              style={{ width: "100%", height: "200px" }}
            >
              <RiSignalWifiErrorFill className="text-gray-400 text-8xl mb-6" />
              <p className="text-gray-600 text-lg mt-2">
                {t("Error")}: {error} — {t("Unable to fetch Library data")}
              </p>
            </div>
          </td>
        </tr>
      );
    }

    if (paginatedData.length === 0) {
      return (
        <tr>
          <td colSpan={7}>
            <div
              className="flex flex-col items-center justify-center text-center py-4"
              style={{ width: "100%", height: "200px" }}
            >
              <FaBookOpen className="text-gray-400 text-8xl mb-6" />
              <p className="text-gray-600 text-lg mt-2">
                {t(
                  "No borrowed books at the moment. Encourage your child to explore the library!"
                )}
              </p>
            </div>
          </td>
        </tr>
      );
    }

    return paginatedData.map((record) => {
      const student = record?.studentId || {};
      const fallbackName = [student?.firstName, student?.lastName]
        .filter(Boolean)
        .join(" ");
      const displayName =
        student?.fullName || (fallbackName ? fallbackName : "N/A");

      const book = record?.bookId;
      const bookName = book?.name || "N/A";
      const bookImage = book?.image || bookNew;
      const authorName = book?.author || record?.author || "N/A";
      const category = book?.category || "N/A";
      const status = record?.status || "N/A";
      const isReturned = status.toLowerCase() === "returned";

      return (
        <tr key={record._id} className="border-b hover:bg-gray-50 text-center">
          {/* Child */}
          <td className="px-4 py-3">
            <div className="flex items-center">
              <img
                src={student?.profile || fallbackProfile}
                alt={displayName}
                className="h-10 w-10 rounded-full mr-2 object-cover"
              />
              <span>{displayName}</span>
            </div>
          </td>
          {/* Issue Book with truncation and tooltip */}
          <td
            className="px-4 py-3  overflow-hidden whitespace-nowrap text-ellipsis"
            title={bookName}
          >
            <span
              className="cursor-pointer text-blue-600 "
              onMouseEnter={(e) => handleMouseEnter(e, bookName, bookImage)}
              onMouseLeave={handleMouseLeave}
            >
              {bookName}
            </span>
          </td>
          {/* Author Name with truncation */}
          <td
            className="px-4 py-3 w-32 overflow-hidden whitespace-nowrap text-ellipsis"
            title={authorName}
          >
            {authorName}
          </td>
          {/* Category with truncation */}
          <td
            className="px-4 py-3 w-32 overflow-hidden whitespace-nowrap text-ellipsis"
            title={category}
          >
            {category}
          </td>
          {/* Issue Date */}
          <td className="px-4 py-3">{formatDate(record.issueDate)}</td>
          {/* Return Date */}
          <td className="px-4 py-3">{formatDate(record.returnDate)}</td>
          {/* Status */}
          <td className="px-4 py-3">
            <span
              className={`inline-flex items-center justify-center w-24 h-7 text-sm font-medium rounded-md border whitespace-nowrap ${
                isReturned
                  ? "border-green-700 bg-green-50 text-green-700"
                  : "border-yellow-700 bg-yellow-50 text-yellow-700"
              }`}
            >
              {status}
            </span>
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="p-6 pt-5">
      {/* Header: Search, Filters & Reset */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-4 md:space-y-0">
        {/* Search field on the left */}
        <div className="relative flex items-center max-w-xs w-full mr-4">
          <input
            type="text"
            placeholder={t("Search here")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 w-full"
          />
          <button className="absolute right-3">
            <CiSearch className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        {/* Filters & Reset on the right */}
        <div className="flex items-center space-x-4">
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">
              {t("Select Your Children")}
            </label>
            <select
              className="border border-gray-300 rounded px-3 py-1 w-56 focus:outline-none focus:border-blue-500"
              value={childFilter}
              onChange={(e) => {
                setChildFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="All">{t("All Children")}</option>
              {childrenOptions.map((child) => (
                <option key={child._id} value={child._id}>
                  {child.fullName}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">{t("Status")}</label>
            <select
              className="border border-gray-300 rounded px-3 py-1 w-36 focus:outline-none focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="All">{t("All")}</option>
              <option value="Pending">{t("Pending")}</option>
              <option value="Returned">{t("Returned")}</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">
              {t("Hard Reset")}
            </label>
            <button
              onClick={handleReset}
              className="px-4 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-100"
            >
              {t("Reset All")}
            </button>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-md">
        <table className="min-w-full table-fixed text-left">
          <thead className="bg-gray-100">
            <tr className="border-b text-center">
              <th className="px-4 py-2 text-sm font-semibold text-gray-700">
                {t("Child")}
              </th>
              <th className="px-4 py-2 text-sm font-semibold text-gray-700">
                {t("Issue Book")}
              </th>
              <th className="px-4 py-2 text-sm font-semibold text-gray-700">
                {t("Author Name")}
              </th>
              <th className="px-4 py-2 text-sm font-semibold text-gray-700">
                {t("Category")}
              </th>
              <th className="px-4 py-2 text-sm font-semibold text-gray-700">
                {t("Issue Date")}
              </th>
              <th className="px-4 py-2 text-sm font-semibold text-gray-700">
                {t("Return Date")}
              </th>
              <th className="px-4 py-2 text-sm font-semibold text-gray-700">
                {t("Status")}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">{renderTableRows()}</tbody>
        </table>
      </div>
      <Pagination
        page={page}
        totalPages={totalPages}
        totalRecords={totalBookIsuued}
        limit={pageSize}
        setPage={setPage}
        setLimit={setPageSize}
        t={t}
      />

      {/* Render the preview image via portal */}
      <BookPreviewPortal visible={previewVisible} position={previewPosition}>
        <div className="bg-white border border-gray-200 shadow-lg rounded p-2">
          <img
            src={previewData.bookImage}
            alt={previewData.bookName}
            className="w-24 h-24 object-cover"
          />
        </div>
      </BookPreviewPortal>
    </div>
  );
};

export default LibraryTable;
