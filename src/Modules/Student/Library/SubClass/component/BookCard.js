import React from "react";
import { useTranslation } from "react-i18next";
import { BiBook, BiUser, BiCategoryAlt } from "react-icons/bi";
import { gt } from "../../../../../Utils/translator/translation";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentPage } from "../../../../../Store/Slices/Student/Library/libararySlice";
import { Popover } from "antd"; // Import Popover from antd

const BookCard = ({
  title,
  author,
  categories,
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

  // Calculate category count
  const categoryCount = categories?.length-1;

  const category =
    categories?.length === 1
      ? categories[0].name
      : `${categories[0].name} +${categories?.length - 1}`;

  const availableCopies = totalCopies - issuedCount;

  return (
    <div className="relative overflow-hidden rounded-md hover:shadow-md transition-shadow duration-30 m-1 bg-white border border-gray-300">
      {/* Book Cover */}
      <div className="relative">
        <img
          src={coverImageUrl}
          alt={title}
          className="h-40 object-fit w-full"
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

          {/* ✅ Full Book Name Popover on Hover */}
          <Popover
            content={name}
            trigger="hover"
            overlayStyle={{
              backgroundColor: "white",
              color: "black",
              border: "1px solid #ccc", // optional: for adding a border around the popover
            }}
          >
            <span className="absolute left-0 top-full hidden group-hover:block bg-black text-white text-xs p-2 rounded shadow-md w-max max-w-xs">
              {name}
            </span>
          </Popover>
        </h2>
        <p className="capitalize text-sm font-medium text-pink-700 flex items-center gap-2 mt-1">
          <BiUser className="text-gray-500" size={15} /> {author}
        </p>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <BiCategoryAlt className="text-gray-500" />
          <span>
            {t("Categories", gt.stdLibrary)} :{" "}
            <span className="font-semibold text-gray-800 capitalize">
              {categories?.length > 1 ? categories[0].name : category}
            </span>
            <Popover
              content={categories?.map((cat) => cat.name).join(", ")}
              trigger="hover"
              overlayStyle={{
                backgroundColor: "white",
                color: "black",
                border: "1px solid #ccc", // optional: for adding a border around the popover
              }}
            >
              {categories?.length > 1 &&  <span
                className={`inline-flex items-center justify-center ml-2 w-7 h-7 text-xs font-semibold text-white bg-gray-700 rounded-full`}
              >
              +{categories.length - 1}
              </span>}
            </Popover>
            {/* Category Count in Rounded Circle */}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <BiBook className="text-gray-500" />
          <span>
            {t("Available", gt.stdLibrary)} :{" "}
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
      </div>
    </div>
  );
};

export default BookCard;
