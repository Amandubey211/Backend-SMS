import React from "react";

const BookItem = ({ image, title, category, copies }) => {
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="flex items-center">
        <img className="w-12 h-12 rounded-lg mr-4" src={image} alt={title} />
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-green-600">{category}</p>
        </div>
      </div>
      <div className="flex items-center">
        <p className="text-sm text-gray-600 mr-4">Copies</p>
        <p className="text-lg font-semibold text-gray-800 mr-4">{copies}</p>
        <button className="text-sm text-blue-600">Read now</button>
      </div>
    </div>
  );
};

export default BookItem;
