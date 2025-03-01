import React from "react";
import { useTranslation } from "react-i18next";
import { BiBook, BiUser, BiCategoryAlt } from "react-icons/bi";
import { gt } from "../../../../../Utils/translator/translation";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentPage } from "../../../../../Store/Slices/Student/Library/libararySlice";

const BookCard = ({
  title,
  author,
  category,
  classLevel,
  copies,
  available,
  coverImageUrl,
  name,
  totalCopies,
  issuedCount,
  studentIssueStatus,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { totalPages, currentPage } = useSelector(
    (store) => store.student.studentLibraryBooks
  );
  const availableCopies = totalCopies - issuedCount;


  return (
    <div className="relative  overflow-hidden rounded-md hover:shadow-md transition-shadow duration-30 m-1 bg-white border border-gray-300">
      {/* Book Cover */}
      <div className="relative">
        <img
          src={coverImageUrl}
          alt={title}
          className="h-40 object-fill w-full"
        />

        {studentIssueStatus === "Issued" && (
          <span className="absolute top-2 right-2 bg-white text-green-600 px-2 py-1 rounded-md shadow-md text-xs font-semibold">
            {studentIssueStatus}
          </span>
        )}
      </div>

      {/* Book Info */}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <h2 className="capitalize text-md text-black flex items-center gap-1 mt-1 font-medium w-full truncate group relative">
          {name}

          {/* ✅ Full Book Name Tooltip on Hover */}
          <span className="absolute left-0 top-full hidden group-hover:block bg-black text-white text-xs p-2 rounded shadow-md w-max max-w-xs">
            {name}
          </span>
        </h2>
        <p className="capitalize text-sm font-medium text-pink-700 flex items-center gap-1 mt-1">
          <BiUser className="text-gray-500" size={15} /> {author}
        </p>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <BiCategoryAlt className="text-gray-500" />
          <span>
            {t("Category", gt.stdLibrary)}:{" "}
            <span className="font-semibold text-gray-800 capitalize">
              {category}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-600">
          <BiBook className="text-gray-500" />
          <span>
            {t("Available", gt.stdLibrary)}:{" "}
            <span
              className={`font-semibold ${
                availableCopies > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {availableCopies > 0 ? availableCopies : "Out of Stock"}
            </span>
          </span>
          <span className="text-green-600">
            {studentIssueStatus === "Issued" ? studentIssueStatus : ""}
          </span>
        </div>
        {/* </div> */}
      </div>
    </div>
  );
};

export default BookCard;
