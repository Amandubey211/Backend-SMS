import React, { memo, useMemo } from "react";
import { GiBookmarklet } from "react-icons/gi";
import { Popover } from "antd";
import dayjs from "dayjs";

// Utility — format ISO → DD/MM/YY
const formatDate = (iso) =>
  iso ? dayjs(iso).format("DD/MM/YY") : "N/A";

const BookIssueRow = memo(({ item }) => {
  console.log(item);
  
  const bookName = item?.name || "N/A"
  const bookAuthor = item?.author || "N/A"
  const bookImage = item?.bookImage || null
  const bookCategories = item?.bookCategories || []
  const issueDate = item?.issueDate || "N/A"
  const returnDate = item?.returnDate || "N/A"
  const status = item?.status || "N/A"

  // Memoized category strings
  const categoryNames = useMemo(
    () => bookCategories.map((c) => c.name).filter(Boolean),
    [bookCategories]
  );
  const firstCategory = categoryNames[0] || "N/A";
  const extraCount = Math.max(0, categoryNames.length - 1);
  const allCategories = categoryNames.join(", ");

  // Badge style
  const badgeClass = useMemo(() => {
    const s = status.toLowerCase();
    return s === "returned"
      ? "bg-green-100 text-green-800"
      : s === "pending"
        ? "bg-yellow-100 text-yellow-800"
        : "bg-blue-100 text-blue-800";
  }, [status]);

  return (
    <tr className="text-left text-gray-700 capitalize">
      {/* Book + Preview */}
      <td className="px-3 py-4 border-b border-gray-200">
        <Popover
          content={
            <div className="flex flex-col items-center">
              {bookImage ? (
                <img
                  src={bookImage}
                  alt={bookName}
                  className="w-24 h-24 object-cover mb-2 rounded"
                />
              ) : (
                <GiBookmarklet className="text-gray-400 w-12 h-12 mb-2" />
              )}
              <span className="font-medium">{bookName}</span>
            </div>
          }
          trigger="hover"
          placement="right"
        >
          <div className="flex items-center cursor-pointer">
            {bookImage ? (
              <img
                src={bookImage}
                alt={bookName}
                className="w-10 h-10 rounded-full object-cover mr-2"
                loading="lazy"
              />
            ) : (
              <GiBookmarklet className="text-gray-400 w-8 h-8 mr-2" />
            )}
            <span>{bookName}</span>
          </div>
        </Popover>
      </td>

      {/* Author */}
      <td className="px-3 py-4 border-b border-gray-200">{bookAuthor}</td>

      {/* Category */}
      <td className="px-3 py-4 border-b border-gray-200">
        <div className="inline-flex items-center">
          <span>{firstCategory}</span>
          {extraCount > 0 && (
            <Popover content={allCategories} trigger="hover">
              <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs">
                +{extraCount}
              </span>
            </Popover>
          )}
        </div>
      </td>

      {/* Dates */}
      <td className="px-3 py-4 border-b border-gray-200">{formatDate(issueDate)}</td>
      <td className="px-3 py-4 border-b border-gray-200">{formatDate(returnDate)}</td>

      {/* Status */}
      <td className="px-3 py-4 border-b border-gray-200">
        <span className={`inline-block px-3 py-1 font-semibold rounded-full ${badgeClass}`}>
          {status}
        </span>
      </td>
    </tr>
  );
});



export default BookIssueRow;
