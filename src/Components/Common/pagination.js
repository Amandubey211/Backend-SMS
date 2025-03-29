import React from "react";
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md";

const Pagination = ({ page, totalPages, totalRecords, limit, setPage, setLimit, t }) => {
  const isDisabled = totalRecords === 0;

  const getPageNumbers = () => {
    const pages = [];
    const delta = 2;
    let start = Math.max(1, page - delta);
    let end = Math.min(totalPages, page + delta);

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center p-4">
      {/* Total Results Info */}
      <span className="text-gray-600">
        {t("Results")}:{" "}
        {isDisabled ? 0 : (page - 1) * limit + 1} -{" "}
        {isDisabled ? 0 : Math.min(page * limit, totalRecords)}{" "}
        {t("of")} {totalRecords}
      </span>

      {/* Pagination Controls */}
      <div className="flex items-center space-x-2">
        {/* Previous Button */}
        <button
          className={`px-3 py-2 border rounded-md ${
            page === 1 || isDisabled
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
          disabled={page === 1 || isDisabled}
          onClick={() => setPage(page - 1)}
        >
          <MdKeyboardDoubleArrowLeft className="w-5 h-5" />
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((p, idx) => (
          <button
            key={idx}
            className={`px-3 py-1 border rounded-md transition-all font-semibold ${
              p === page
                ? "text-white bg-gradient-to-r from-red-400 via-pink-600 to-purple-500 shadow-md"
                : p === "..."
                ? "cursor-default text-gray-500 bg-transparent"
                : "bg-white text-gray-700 hover:bg-gradient-to-r hover:from-red-300 hover:via-pink-400 hover:to-purple-400 hover:text-white"
            }`}
            disabled={p === "..." || isDisabled}
            onClick={() => typeof p === "number" && setPage(p)}
          >
            {p}
          </button>
        ))}

        {/* Next Button */}
        <button
          className={`px-3 py-2 border rounded-md ${
            page === totalPages || isDisabled
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
          disabled={page === totalPages || isDisabled}
          onClick={() => setPage(page + 1)}
        >
          <MdKeyboardDoubleArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Limit Selector */}
      <select
        value={limit}
        onChange={(e) => {
          setLimit(Number(e.target.value));
          setPage(1); // Reset to first page when limit changes
        }}
        className="ml-3 px-3 py-2 border rounded-md focus:outline-none bg-white hover:bg-gray-100"
      >
        {[5, 10, 20, 50].map((val) => (
          <option key={val} value={val}>
            {val} {t("/ page")}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Pagination;
