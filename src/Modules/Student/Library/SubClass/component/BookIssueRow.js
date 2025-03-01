import React from "react";
import { useTranslation } from "react-i18next";
import { GiBookmarklet } from "react-icons/gi"; // Import the bookmark icon
import { gt } from "../../../../../Utils/translator/translation";

const BookIssueRow = ({ item }) => {
  const { t } = useTranslation();
  const formatDate = (isoDate) => {
    if (!isoDate) return "N/A"; // Handle missing dates
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <tr className="text-left text-gray-700 capitalize">
      {/* Book Image and Name */}
      <td className="px-3 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="rounded-full border border-gray-200 overflow-hidden w-10 h-10 flex items-center justify-center">
            {item?.bookId?.image ? (
              <img
                src={item?.bookId?.image}
                alt={`${item?.bookId?.name} || ${t("Unknown Title", gt.stdLibrary)} cover`}
                className="h-full w-full object-cover"
              />
            ) : (
              <GiBookmarklet className="text-gray-400 w-8 h-8" /> // Use icon if no image
            )}
          </div>
          <div className="flex flex-col ml-4">
            <span className="font-medium text-gray-800">
             { item?.bookId?.name || t("Unknown Title", gt.stdLibrary)}
            </span>
          </div>
        </div>
      </td>

      {/* Author */}
      <td className="px-3 py-4 border-b border-gray-200">
        <span className="text-gray-800">
          {item?.author || t("Unknown Author", gt.stdLibrary)}
        </span>
      </td>

      {/* Category */}
      <td className="px-3 py-4 border-b border-gray-200">
        <span className="text-gray-800">
          {item?.bookId?.category || t("Unknown Category", gt.stdLibrary)}
        </span>
      </td>

      {/* Issue Date */}
      <td className="px-3 py-4 border-b border-gray-200">
        <span>{formatDate(item?.issueDate)}</span>
      </td>

      {/* Return Date */}
      <td className="px-3 py-4 border-b border-gray-200">
        <span>{formatDate(item?.returnDate)}</span>
      </td>

      {/* Status */}
      <td className="px-3 py-4 border-b border-gray-200">
        <span
          className={`inline-block px-3 py-1 text-md font-semibold rounded-full ${item?.status === "Return"
              ? "bg-green-100 text-green-800"
              : "bg-blue-100 text-gray-600"
            }`}
        >
          {item?.status || t("No Status",gt.stdLibrary)}
        </span>
      </td>
    </tr>
  );
};

export default BookIssueRow;
