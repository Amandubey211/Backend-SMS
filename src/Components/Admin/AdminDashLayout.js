import React from "react";
import { useSelector } from "react-redux";
import Navbar from "../Common/Navbar";
import SideMenubar from "./SideMenubar";

const DashLayout = ({
  children,
  hideSearchbar,
  hideAvatarList,
  hideStudentView,
}) => {
  const isSidebarOpen = useSelector((state) => state.sidebar.isOpen);
  const sidebarWidth = isSidebarOpen ? "15%" : "7%"; // Adjust the width based on sidebar state

  return (
    <div className="flex w-full min-h-screen overflow-x-hidden  ">
      <SideMenubar />
      <div
        className={`transition-all duration-500 flex-1 h-full ml-${sidebarWidth}`}
        style={{
          marginLeft: sidebarWidth,
        }}
      >
        <Navbar
          hideSearchbar={hideSearchbar}
          hideAvatarList={hideAvatarList}
          hideStudentView={hideStudentView}
        />
        <main className="w-full min-h-screen h-screen overflow-y-scroll no-scrollbar ">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashLayout;
