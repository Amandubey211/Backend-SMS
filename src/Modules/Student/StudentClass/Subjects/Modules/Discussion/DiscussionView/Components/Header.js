import React, { useState } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { FaBan } from "react-icons/fa6";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { BsChat } from "react-icons/bs";
// import Sidebar from "../../../../../../../Components/Common/Sidebar";
import DiscussionMessage from "../../DiscussionMessage/DiscussionMessage";
import Sidebar from "../../../../../../../../Components/Common/Sidebar";
// Sidebar
const Header = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);
  return (
    <div className="flex items-end justify-between p-2 px-4 border-b">
      <div className="flex items-center">
        <img
          src="https://avatars.githubusercontent.com/u/109097090?v=4"
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
        <div className="ml-3">
          <h1 className="text-lg font-semibold">Bangladesh topic</h1>
          <p className="text-sm text-green-600">Cameron Williamson</p>
        </div>
      </div>
      <div className="flex flex-col gap-1 items-end justify-center">
        <div  className="flex gap-4 items-center">
            <span className=" font-medium text-gray-500">Possible Point: 50</span>
        <span className="text-sm text-gray-500">Due: 01/02/2024</span>
       
        </div>
       <div className="flex items-center space-x-4">
          {/* <div className="flex justify-center gap-2 items-center w-full p-2 text-gray-700">
            <button
              className="flex items-center space-x-1 px-4 py-1 border rounded-md border-gray-300 text-gray-600 hover:bg-gray-100 transition"
              aria-label="Publish Assignment"
            >
              <FaBan aria-hidden="true" />
              <span>Publish</span>
            </button>
            <button
              className="flex items-center space-x-1 px-4 py-1 border rounded-md border-gray-300 text-green-600 hover:bg-gray-100 transition"
              aria-label="Edit Assignment"
            >
              <AiOutlineEdit aria-hidden="true" />
              <span>Edit</span>
            </button>
            <button
              className="flex items-center space-x-1  border rounded-full w-8 h-8 justify-center border-gray-300 text-gray-600 hover:bg-gray-100 transition"
              aria-label="More Options"
            >
              <HiOutlineDotsVertical aria-hidden="true" className="" />
            </button>
          </div> */}

          <button   onClick={handleSidebarOpen} className="px-4 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white items-center  rounded-md flex gap-2 ">
            <BsChat /> <span>Discussion</span>
          </button>

          {/* // fix this  */}
          <Sidebar
          width="70%"
            title="Discussion"
            isOpen={isSidebarOpen}
            onClose={handleSidebarClose}
          >

<DiscussionMessage/>
          </Sidebar>
        </div>
      </div>
    </div>
  );
};

export default Header;
