import React from "react";

const Header = ({ onSubmit, loading }) => {
  return (
    <div className="flex justify-between px-4 w-full mb-2">
      <button
        className="px-6 py-2 w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md shadow-lg"
        onClick={onSubmit}
      >
        {loading ? "Please wait.." : " Submit Attendance"}
      </button>
    </div>
  );
};

export default Header;
