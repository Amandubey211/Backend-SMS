import React from "react";
import { useTranslation } from 'react-i18next';

const BookItem = ({ image, title, category, copies, author, className, role }) => {
  const { t } = useTranslation('admLibrary');

  return (
    <div className="flex items-center justify-between bg-white p-4 border border-gray-200 rounded-lg mb-4 shadow-sm hover:shadow-lg hover:translate-y-[-3px] transition-all duration-300 ease-in-out cursor-default w-full">
      <div className="flex items-center w-[100%] ">
        <img className="w-16 h-16 rounded-lg mr-6" src={image} alt={title} />
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800">
            {title?.slice(0, 50) || t("Untitled Book")}{title?.length > 50 && '...'}
          </h3>
          <p className="text-sm text-green-600">{category || t("Uncategorized")}</p>
          <div className="flex items-top gap-2">
          <p className="text-md font-medium text-gray-800 ">{className || t("Unknown Class")} </p>
          </div>
        </div>
      </div>
      
      
    </div>
  );
};

export default BookItem;
