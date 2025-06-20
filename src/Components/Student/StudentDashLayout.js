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
  const isSidebarOpen = useSelector(
    (state) => state.common.user.sidebar.isOpen
  );
  const sidebarWidth = isSidebarOpen ? "15%" : "7%";

  return (
    <div className="flex w-full h-screen overflow-hidden bg-white">
      {/* Toaster should be at root level */}
      <Toaster position="top-right" />

      {/* Sidebar */}
      <SideMenubar isOpen={isSidebarOpen} />

      {/* Main content area */}
      <div
        className="flex-1 flex flex-col overflow-hidden"
        style={{
          marginLeft: sidebarWidth,
          transition: "margin-left 500ms ease",
        }}
      >
        {/* Sticky navbar */}
        <div className="sticky top-0 z-10">
          <Navbar
            hideSearchbar={hideSearchbar}
            hideAvatarList={hideAvatarList}
            hideStudentView={hideStudentView}
          />
        </div>

        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto smooth-scroll p-2">
          {children}
        </main>
      </div>
    </div>
  );
};

export default StudentDashLayout;
