import React from "react";
import { useSelector } from "react-redux";
import Navbar from "../Common/Navbar";
import SideMenubar from "./SideMenubar";
import { Toaster } from "react-hot-toast";

const StudentDashLayout = ({
  children,
  hideSearchbar,
  hideAvatarList,
  hideStudentView,
}) => {
  const isSidebarOpen = useSelector((state) => state.sidebar.isOpen);
  const sidebarWidth = isSidebarOpen ? "15%" : "7%"; // Adjust the width based on sidebar state

  return (
    <div className="flex w-full h-full">
      <SideMenubar isOpen={isSidebarOpen} />

      <div
        className={`ml-${sidebarWidth} transition-all duration-500 flex-1 h-full`}
        style={{
          marginLeft: sidebarWidth,
        }}
      >
        {/* Navbar is sticky and stays at the top */}
        <Navbar
          hideSearchbar={hideSearchbar}
          hideAvatarList={hideAvatarList}
          hideStudentView={hideStudentView}
        />
        {/* Main content area */}
        <main className="w-full h-[90%] overflow-y-scroll no-scrollbar  ">
          {children}
        </main>
      </div>
    </div>
  );
};

export default StudentDashLayout;
