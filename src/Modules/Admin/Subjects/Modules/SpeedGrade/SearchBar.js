import React from "react";

function SearchBar() {
  return (
    <div className="flex items-center gap-2 mb-4">
      <input
        type="text"
        placeholder="Search Student"
        className="flex-1 p-2 border border-gray-300 rounded"
      />
      <button className="p-2 bg-gray-200 rounded">🔍</button>
    </div>
  );
}

export default SearchBar;
