import React from "react";
import { CiMail } from "react-icons/ci";
import { TbBell } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { useSelector } from "react-redux";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import AvatarsList from "./AvataList";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
const Navbar = ({ hideSearchbar, hideAvatarList, hideStudentView }) => {
  const LeftNavHeading = useSelector(
    (store) => store.Common.NavbarData.leftHeading
  );
  console.log(hideSearchbar);
  const navigate = useNavigate();
  return (
    <div className="relative z-0">
      <div className="flex items-center p-2  bg-white border-b ">
        <div className="flex-1 text-md font-semibold">
          {LeftNavHeading[1] === undefined ? (
            <span className=" text-gradient"> {LeftNavHeading[0]}</span>
          ) : (
            <div className="flex items-center gap-1 ">
              <span className="opacity-55 font-bold flex   items-center text-gray-500">
                <button
                  onClick={() => navigate(-1)}
                  className="mr-1"
                  title="back"
                >
                  {LeftNavHeading[0]}
                </button>
                <MdOutlineKeyboardDoubleArrowRight className="text-2xl" />
              </span>

              <h1 className="text-gradient text-md font-bold">
                {LeftNavHeading[1]}
              </h1>
            </div>
          )}
        </div>
        {hideAvatarList ? (
          ""
        ) : (
          <>
            <div className="flex-1 ">
              <AvatarsList />
            </div>
            {hideStudentView ? (
              ""
            ) : (
              <button className="flex  mr-3 items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 text-white py-1 px-3  rounded-full ">
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <FaArrowRightArrowLeft />
                </div>
                <span className="text-sm text-gradient font-medium">
                  Student View
                </span>
              </button>
            )}
          </>
        )}

        {hideSearchbar ? (
          ""
        ) : (
          <div className="relative flex items-center max-w-xs w-full mr-2">
            <input
              type="text"
              placeholder="Search here"
              className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 w-full"
            />
            <button className="absolute right-3">
              <CiSearch className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        )}

        <div className="flex items-center space-x-2 border-l ml-3 pl-3">
          <CiMail className="w-8 h-8 text-purple-500 p-1 border rounded-full" />
          <TbBell className="w-8 h-8 text-purple-500  p-1 border rounded-full" />
          <IoSettingsOutline className="w-8 h-8 text-purple-500 p-1  border rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
