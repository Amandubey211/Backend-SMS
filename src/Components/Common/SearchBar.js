import React from "react";
import { CiSearch } from "react-icons/ci";

const SearchBar = () => (
  <div className="relative flex items-center max-w-xs w-full mr-2">
    <label htmlFor="search" className="sr-only">
      Search
    </label>
    <input
      id="search"
      type="text"
      placeholder="Search here"
      className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 w-full"
      aria-label="Search here"
    />
    <button className="absolute right-3" aria-label="Search">
      <CiSearch className="w-5 h-5 text-gray-500" />
    </button>
  </div>
);

export default SearchBar;
