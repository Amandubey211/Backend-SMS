import React from "react";
import { useSelector } from "react-redux";

const Header = ({ onSubmit }) => {
  const { markingAttendance: loading } = useSelector(
    (state) => state.admin.attendance
  );

  return (
    <div className="flex justify-between px-4 w-full mb-2">
      <button
        className="px-6 py-2 w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md shadow-lg transform transition-all duration-300 ease-in-out  hover:shadow-xl hover:bg-gradient-to-r hover:from-pink-400 hover:to-purple-400"
        onClick={onSubmit}
      >
        {loading ? "Please wait.." : "Submit Attendance"}
      </button>
    </div>
  );
};

export default Header;
