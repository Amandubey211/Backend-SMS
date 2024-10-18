import React from "react";

const BookItem = ({ image, title, category, copies, author, className, role }) => {
  return (
    <div className="flex items-center justify-between bg-white p-4 border border-gray-200 rounded-lg mb-4 shadow-sm hover:shadow-lg hover:translate-y-[-3px] transition-all duration-300 ease-in-out cursor-default">
      <div className="flex items-center">
        <img className="w-16 h-16 rounded-lg mr-6" src={image} alt={title} />
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-green-600">{category}</p>
        </div>
      </div>
      <div className="flex flex-col text-right">
        <div className="flex items-center gap-4">
          <div className="flex flex-col text-right">
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-600">Copies:</p>
              <p className="text-sm font-medium text-gray-800">{copies}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-600">Author:</p>
              <p className="text-sm font-medium text-gray-800">{author}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-600">Class:</p>
              <p className="text-sm font-medium text-gray-800">{className}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookItem;
