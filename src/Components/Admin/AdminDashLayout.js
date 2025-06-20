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
  const isSidebarOpen = useSelector(
    (state) => state.common.user.sidebar.isOpen
  );
  const sidebarWidth = isSidebarOpen ? "15%" : "7%";

  return (
    <div className="flex w-full h-screen overflow-hidden ">
      {/* Sidebar - fixed width */}
      <SideMenubar />

      {/* Main content area */}
      <div
        className="flex flex-col flex-1 overflow-hidden"
        style={{
          marginLeft: sidebarWidth,
          transition: "margin-left 500ms ease",
        }}
      >
        {/* Navbar - fixed height */}
        <Navbar
          hideSearchbar={hideSearchbar}
          hideAvatarList={hideAvatarList}
          hideStudentView={hideStudentView}
        />

        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden smooth-scroll">
          <div className="">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashLayout;
