import React from "react";

const Header = ({ onSubmit,loading }) => {
  return (
    <div className="flex justify-between px-4">
      <div className="text-xl font-semibold text-gradient">Take Attendance</div>
      {/* <button
        className="px-6 py-2 w-72 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md shadow-lg"
        onClick={onSubmit}
      >
       {loading?"Marking..":" Submit Attendance"}
      </button> */}
    </div>
  );
};

export default Header;
