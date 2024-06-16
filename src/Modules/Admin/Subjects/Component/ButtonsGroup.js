import React from 'react';
import { FaBan } from 'react-icons/fa';
import { AiOutlineEdit } from 'react-icons/ai';import { HiOutlineDotsVertical } from 'react-icons/hi';

const ButtonsGroup = () => (
  <div className="flex justify-center gap-4 items-center w-full p-2 text-gray-700">
    <button
      className="flex items-center space-x-1 px-4 py-2 border rounded-md border-gray-300 text-gray-600 hover:bg-gray-100 transition"
      aria-label="Publish Assignment"
    >
      <FaBan aria-hidden="true" />
      <span>Publish</span>
    </button>
    <button
      className="flex items-center space-x-1 px-4 py-2 border rounded-md border-gray-300 text-green-600 hover:bg-gray-100 transition"
      aria-label="Edit Assignment"
    >
      <AiOutlineEdit aria-hidden="true" />
      <span>Edit</span>
    </button>
    <button
      className="flex items-center space-x-1 px-4 py-2 border rounded-full border-gray-300 text-gray-600 hover:bg-gray-100 transition"
      aria-label="More Options"
    >
      <HiOutlineDotsVertical aria-hidden="true" />
    </button>
  </div>
);

export default ButtonsGroup;
