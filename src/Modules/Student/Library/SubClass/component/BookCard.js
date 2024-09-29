import React from "react";
import { useTranslation } from "react-i18next";
import { BsThreeDotsVertical } from "react-icons/bs";
import { gt } from "../../../../../Utils/translator/translation";

const BookCard = ({
  title,
  author,
  category,
  classLevel,
  copies,
  available,
  coverImageUrl,
}) => {

  const { t } = useTranslation();

  return (
    <div className="relative border p-2 bg-white rounded-lg shadow-sm  overflow-hidden capitalize">
      <div className="flex border-b pb-2">
        {/* Book Cover */}
        <img
          src={coverImageUrl}
          alt={title}
          className="w-40 h-36 object-cover rounded-md"
        />

        {/* Book Info */}
        <div className="ml-5 ">
          <div className="flex flex-col">
            <span className=" text-gray-500">{t('Class',gt.stdLibrary)}</span>
            <span className=" font-bold text-gradient mb-1">{classLevel}</span>
            {/* <span className="text-lg  font-bold text-gradient mb-1">10</span> */}

            <span className=" text-gray-500">{t('Copies',gt.stdLibrary)}</span>
            <span className=" text-lg font-bold text-gradient mb-1">
              {copies}
            </span>
            <span className=" text-gray-500">{t('Available',gt.stdLibrary)}</span>
            <span className="text-lg  font-bold text-gradient">
              {available}
            </span>
          </div>
        </div>
      </div>

      {/* Book Details */}
      <div className="mt-3 ps-2 pb-2">
        <h3 className="text-lg font-bold  text-gray-800">{title}</h3>
        <p className="text-sm font-medium text-gradient">{category}</p>
        <p className="text-sm text-gray-500 mt-3">{t('Author',gt.stdLibrary)}</p>
        <p className="text-base text-gray-700">{author}</p>
      </div>

      {/* Three Dots Icon in Bottom-Right */}
      <div className="absolute right-4 bottom-4 p-1 border rounded-full">
        <BsThreeDotsVertical className="text-gray-700 cursor-pointer" />
      </div>
    </div>
  );
};

export default BookCard;
