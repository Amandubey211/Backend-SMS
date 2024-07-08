import React, { useState } from 'react';
import { CiSearch } from 'react-icons/ci';

const DiscussionHeader = ({ onSearch }) => {
  const [filter, setFilter] = useState('all');

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleSearchChange = (event) => {
    onSearch(event.target.value);
  };

  return (
    <div className="p-3">
      <h2 className="text-xl font-semibold mb-4">Discussion</h2>
      <div className="flex items-center justify-between space-x-4">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Search here"
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300 w-72"
            onChange={handleSearchChange}
          />
          <button className="absolute right-3">
            <CiSearch className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="filter"
              value="all"
              checked={filter === 'all'}
              onChange={handleFilterChange}
              className="custom-radio"
            />
            <span className="ml-2">All</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="filter"
              value="unread"
              checked={filter === 'unread'}
              onChange={handleFilterChange}
              className="custom-radio"
            />
            <span className="ml-2">Unread</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="filter"
              value="read"
              checked={filter === 'read'}
              onChange={handleFilterChange}
              className="custom-radio"
            />
            <span className="ml-2">Read</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default DiscussionHeader;
