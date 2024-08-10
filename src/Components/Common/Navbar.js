import React, { useState, useEffect, useRef } from "react";
import { CiMail, CiSearch } from "react-icons/ci";
import { TbBell } from "react-icons/tb";
import { IoLanguage, IoSettingsOutline } from "react-icons/io5";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LogoutConfirmationModal from "./LogoutConfirmationModal";
import useStaffLogout from "../../Hooks/AuthHooks/Staff/useStaffLogOut";
import { RiTimeZoneLine } from "react-icons/ri";
import { IoIosLogOut } from "react-icons/io";

const IconButton = ({ icon: Icon, label, onClick }) => (
  <button onClick={onClick} aria-label={label}>
    <Icon className="w-8 h-8 text-purple-500 p-1 border rounded-full" />
  </button>
);

const LeftHeading = ({ leftHeading, navigate }) => (
  <div className="flex-1 text-md font-semibold ps-4 capitalize">
    {leftHeading[1] === undefined ? (
      <span className="text-gradient capitalize">{leftHeading[0]}</span>
    ) : (
      <div className="flex items-center gap-1">
        <span className="opacity-55 font-bold flex items-center text-gray-500">
          <button
            onClick={() => navigate(-1)}
            className="mr-1 capitalize"
            title="Back"
            aria-label="Go back"
          >
            {leftHeading[0]}
          </button>
          <MdOutlineKeyboardDoubleArrowRight
            className="text-2xl"
            aria-hidden="true"
          />
        </span>
        <h1 className="text-gradient text-md font-bold">{leftHeading[1]}</h1>
      </div>
    )}
  </div>
);

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

const Navbar = ({ hideSearchbar, hideAvatarList, hideStudentView }) => {
  const leftHeading = useSelector(
    (store) => store.Common.NavbarData.leftHeading
  );
  const navigate = useNavigate();
  const [showSetting, setShowSetting] = useState(false);
  const dropdownRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const { staffLogout } = useStaffLogout();
  const logout = async () => {
    await staffLogout();
    setIsModalOpen(false);
  };
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowSetting(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="sticky top-0 left-0 right-0 z-20 bg-white border-b shadow-sm">
      <div className="flex items-center p-2 bg-white">
        <LeftHeading leftHeading={leftHeading} navigate={navigate} />

        <div className="flex items-center space-x-2 border-l ml-3 pl-3 relative">
          <IconButton icon={CiMail} label="Mail" />
          <IconButton icon={TbBell} label="Notifications" />
          <IconButton
            icon={IoSettingsOutline}
            label="Settings"
            onClick={() => setShowSetting(!showSetting)}
          />

          {showSetting && (
            <div
              ref={dropdownRef}
              className="absolute top-9 right-0 bg-white rounded-lg shadow-lg border px-4 py-3 flex flex-col gap-2 z-50 w-56"
            >
              <button
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-purple-500 transition-transform duration-200 hover:bg-gray-100 px-3 py-2 rounded-md transform hover:translate-x-2"
                onClick={() => navigate("/users/admin")}
              >
                <FaUser className="text-lg" />
                Profile
              </button>

              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-purple-500 transition-transform duration-200 hover:bg-gray-100 px-3 py-2 rounded-md transform hover:translate-x-2">
                <IoLanguage className="text-lg" />
                <select className="border-none outline-none bg-transparent text-gray-700 cursor-pointer">
                  <option value="english">English</option>
                  <option value="arabic">Arabic</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>

              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md">
                <RiTimeZoneLine className="text-lg" />
                <span>{timeZone}</span>
              </div>

              <button
                className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-800 transition-transform duration-200 hover:bg-gray-100 px-3 py-2 rounded-md transform hover:translate-x-2"
                onClick={openModal}
              >
                <IoIosLogOut className="text-lg" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      <LogoutConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={logout}
      />
    </div>
  );
};

export default Navbar;
