import React, { useEffect, useState } from "react";
import { GoDotFill, GoSearch } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../../../../Store/Slices/Student/Library/bookIssuesSlice";
import BookIssueRow from "../SubClass/component/BookIssueRow";
import OfflineModal from "../../../../Components/Common/Offline";
import Spinner from "../../../../Components/Common/Spinner";
import NoDataFound from "../../../../Components/Common/NoDataFound";
import { setShowError } from "../../../../Store/Slices/Common/Alerts/alertsSlice";
import { studentIssueBooks } from "../../../../Store/Slices/Student/Library/bookIssues.action";
import Pagination from "../../../../Components/Common/pagination";
import { useTranslation } from "react-i18next";

const BookIssue = () => {
  const {
    loading,
    error,
    issueBooks = [],
    filters,
    totalIssueBookPages,
    currentIssuedBookPage,
    totalIssuedBook,
  } = useSelector((store) => store?.student?.studentIssueBooks);
  const { showError } = useSelector((store) => store?.common?.alertMsg);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(currentIssuedBookPage || 1);
  const { t } = useTranslation();

  // ✅ Fetch books based on status, search, limit, and page
  useEffect(() => {
    dispatch(
      studentIssueBooks({
        status: filters.status === "All" ? "" : filters.status,
        search,
        page,
        limit,
      })
    );
  }, [filters.status, search, limit, page, dispatch]);

  // ✅ Handle status filter change
  const handleFilterChange = (e) => {
    dispatch(setFilters({ ...filters, status: e.target.value }));
  };

  // ✅ Handle search input
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on search
  };

  // ✅ Handle limit change
  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1); // Reset to first page on limit change
  };

  // ✅ Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalIssueBookPages) {
      setPage(newPage);
    }
  };

  // ✅ Handle dismiss error
  const handleDismiss = () => {
    dispatch(setShowError(false));
  };

  return (
    <div>
      {/* Filters and Search Section */}
      <div className="flex justify-between items-center gap-4 mb-4 ps-5">
        <div className="flex gap-4">
          {["All", "Pending", "Returned"].map((status) => (
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
                className={`h-5 w-5 rounded-full mr-2 border-2 ${
                  filters.status === status
                    ? "border-green-500"
                    : "border-gray-300"
                }`}
              >
                {filters.status === status && (
                  <GoDotFill className="text-green-500" size={18} />
                )}
              </div>
              <span
                className={`text-md ${
                  filters.status === status ? "text-green-500" : "text-gray-600"
                }`}
              >
                {status}
              </span>
            </label>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Search here"
            value={search}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <GoSearch
            className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>
      </div>

      {/* Table for Book Issues */}
      <div className="overflow-x-auto bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 bg-gray-100">
              <th className="px-5 py-3 border-b">Issue Book</th>
              <th className="px-5 py-3 border-b">Author</th>
              <th className="px-5 py-3 border-b">Category</th>
              <th className="px-5 py-3 border-b">Issue Date</th>
              <th className="px-5 py-3 border-b">Last Return Date</th>
              <th className="px-5 py-3 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="6" className="text-center py-10">
                  <Spinner />
                </td>
              </tr>
            )}
            {!loading && issueBooks?.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-20">
                  <NoDataFound />
                </td>
              </tr>
            )}
            {!loading &&
              !error &&
              issueBooks?.map((item) => (
                <BookIssueRow key={item.id} item={item} />
              ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Component */}
      {totalIssuedBook > 0 && (
        <Pagination
          page={page}
          totalPages={totalIssueBookPages}
          totalRecords={totalIssuedBook}
          limit={limit}
          setPage={handlePageChange}
          setLimit={setLimit}
          t={t}
        />
      )}

      {!loading && showError && (
        <OfflineModal error={error} onDismiss={handleDismiss} />
      )}
    </div>
  );
};

export default BookIssue;
