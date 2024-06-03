import React, { useState } from "react";
import AddGroup from "./AddGroup";
import Sidebar from "../../../../Components/Common/Sidebar";

const NavigationBar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);
  return (
    <>
      <div className="flex justify-between items-center p-4">
        <div className="flex space-x-2 px-5">
          <button className="px-4 py-2 rounded-full border border-gray-300">
            Everyone
          </button>
          <button className="px-4 py-2 rounded-full bg-gradient-to-r from-red-400 to-purple-500 text-white">
            Section 1
          </button>
          <button className="px-4 py-2 rounded-full border border-gray-300">
            Section 2
          </button>
          <button className="px-4 py-2 rounded-full border border-gray-300">
            Section 3
          </button>
          <button className="px-4 py-2 rounded-full border border-gray-300">
            Section 4
          </button>
        </div>
        <button
          onClick={handleSidebarOpen}
          className="flex items-center border border-gray-300 ps-5  py-0 rounded-full"
        >
          <span className="mr-2">Group</span>
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-12 h-12 flex items-center justify-center">
            <span className="text-3xl -mt-2">+</span>
          </div>
        </button>
      </div>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        title="Add New Group"
      >
        <AddGroup />
      </Sidebar>
    </>
  );
};

export default NavigationBar;
