import React from "react";
import { useTranslation } from "react-i18next";
import { Tag } from "antd";

const BookItem = ({
  image,
  title,
  categories, // New prop for categories array
  copies,
  author,
  className,
  role,
}) => {
  const { t } = useTranslation("admLibrary");

  return (
    <div className="flex items-center justify-between bg-white p-4 border border-gray-200 rounded-lg mb-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-default w-full">
      <div className="flex items-center w-full">
        <img
          className="w-16 h-16 rounded-lg mr-6 object-cover"
          src={image}
          alt={title}
        />
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800">
            {title?.slice(0, 50) || t("Untitled Book")}
            {title?.length > 50 && "…"}
          </h3>
          <div className="flex flex-wrap gap-1 mt-1">
            {categories && categories.length > 0 ? (
              categories.map((cat) => (
                <Tag key={cat._id} color="blue">
                  {cat.name}
                </Tag>
              ))
            ) : (
              <span className="text-sm text-green-600">
                {t("no Categories")}
              </span>
            )}
          </div>
          <div className="flex items-top gap-2 mt-1">
            <p className="text-md font-medium text-gray-800">
              {className || t("No Class")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookItem;
