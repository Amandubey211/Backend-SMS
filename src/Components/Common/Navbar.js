import React, { useEffect } from "react";
import { CiMail, CiSearch } from "react-icons/ci";
import { TbBell } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AvatarsList from "./AvataList";
// import useGetUserDetail from "../../Hooks/AuthHooks/Staff/useGetUserDetail";

const IconButton = ({ icon: Icon, label }) => (
  <button aria-label={label}>
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

// const StudentViewButton = () => (
//   <button
//     className="flex mr-3 items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 text-white py-1 px-3 rounded-full"
//     aria-label="Switch to Student View"
//   >
//     <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
//       <FaArrowRightArrowLeft aria-hidden="true" />
//     </div>
//     <span className="text-sm text-gradient font-medium">Student View</span>
//   </button>
// );

const Navbar = ({ hideSearchbar, hideAvatarList, hideStudentView }) => {
  const leftHeading = useSelector(
    (store) => store.Common.NavbarData.leftHeading
  );
  const navigate = useNavigate();
  return (
    <div className="relative">
      <div className="flex items-center p-2 bg-white border-b">
        <LeftHeading leftHeading={leftHeading} navigate={navigate} />
        {!hideAvatarList && (
          <>
            <div className="flex-1 w-full flex justify-center ">
              <AvatarsList />
            </div>
            {/* {!hideStudentView && <StudentViewButton />} */}
          </>
        )}
        {!hideSearchbar && <SearchBar />}
        <div className="flex items-center space-x-2 border-l ml-3 pl-3">
          <IconButton icon={CiMail} label="Mail" />
          <IconButton icon={TbBell} label="Notifications" />
          <IconButton icon={IoSettingsOutline} label="Settings" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
