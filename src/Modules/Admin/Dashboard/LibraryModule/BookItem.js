import React from "react";

const BookItem = ({ image, title, category, copies }) => {
  return (
    <div className="flex items-center justify-between bg-white p-2 pe-4 border rounded-md mb-4">
      <div className="flex items-center">
        <img className="w-12 h-12 rounded-lg mr-4" src={image} alt={title} />
        <div>
          <h3 className="text-md">{title}</h3>
          <p className="text-sm text-green-600">{category}</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <p className="text-sm text-gray-600">Copies</p>
        <p className="text-sm font-medium text-gray-600">{copies}</p>
      </div>
      <div className="flex items-center gap-1">
        <p className="text-sm text-gray-600">Available</p>
        <p className="text-sm font-medium text-gray-600">350</p>
      </div>
    </div>
  );
};

export default BookItem;
