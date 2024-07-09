import React from "react";

const BookCard = ({
  title,
  author,
  category,
  classLevel,
  copies,
  available,
  coverImageUrl,
}) => {
  return (
    <div className="border p-2 bg-white rounded-lg shadow overflow-hidden">
      <div className="w-full h-40 flex ">

        <img
          src={coverImageUrl}
          alt={title}
          className="w-[70%] h-full object-cover rounded-md"
        />

        <div className="flex flex-col  p-2 space-y-1">
          <span className=" font-semibold text-[#7F7F7F]text-sm ">Class: </span>
          <span className="text-base font-semibold bg-gradient-to-r from-pink-500  via-green-500 to-purple-500 inline-block text-transparent bg-clip-text">{classLevel}</span>
          <span className="text-sm font-semibold text-gray-700">Copies:</span>
          <span className="text-base font-semibold bg-gradient-to-r from-pink-500  via-green-500 to-purple-500 inline-block text-transparent bg-clip-text"> {copies}</span>
          <span className="text-sm font-semibold text-gray-700"> Available</span>
          <span className="text-base font-semibold bg-gradient-to-r from-pink-500  via-green-500 to-purple-500 inline-block text-transparent bg-clip-text"> {available}</span>
        </div>
      </div>
      <div className=" relative p-4 ">
        <h3 className="text-lg font-bold text-[#333333]">{title}</h3>
        <p className="text-base font-semibold bg-gradient-to-r from-pink-500   to-purple-500 inline-block text-transparent bg-clip-text">{category}</p>

        <p className=" mt-2  text-sm font-medium text-gray-500">Author</p>
        <p className="text-sm font-medium text-gray-600"> {author}</p>
        <button className=" absolute right-2  bottom-2 text-indigo-600 hover:text-indigo-900">Edit</button>

      </div>

 
    </div>
  );
};

export default BookCard;
