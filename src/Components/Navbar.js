import React from "react";
import { CiMail } from "react-icons/ci";
import { TbBell } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { FaBars } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useSelector } from "react-redux";

const Navbar = ({ toggleSidebar }) => {
  const isSidebarOpen = useSelector((state) => state.sidebar.isOpen);

  return (
    <div className="flex items-center p-2 bg-white shadow">
      <button onClick={toggleSidebar} className="focus:outline-none mr-4">
        <div className="p-1 rounded-full border">
          {isSidebarOpen ? <IoIosArrowBack /> : <IoIosArrowForward />}
        </div>
      </button>

      <div className="flex-1 text-xl font-semibold text-purple-500">
        Students
      </div>
      <div className="relative flex items-center max-w-xs w-full mr-4">
        <input
          type="text"
          placeholder="Search here"
          className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 w-full"
        />
        <button className="absolute right-3">
          <CiSearch className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      <div className="flex items-center space-x-4">
        <CiMail className="w-6 h-6 text-purple-500" />
        <TbBell className="w-6 h-6 text-purple-500" />
        <IoSettingsOutline className="w-6 h-6 text-purple-500" />
      </div>
    </div>
  );
};

export default Navbar;
