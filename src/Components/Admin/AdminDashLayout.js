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
  return (
    <div className="flex w-full h-screen fixed  ">
      <SideMenubar />
      <div
        className={`transition-all duration-500 ${
          isSidebarOpen ? "w-4/5" : "w-full"
        } flex-1 h-full`}
      >
        <Navbar
          hideSearchbar={hideSearchbar}
          hideAvatarList={hideAvatarList}
          hideStudentView={hideStudentView}
        />
        <main className="w-full min-h-screen h-screen overflow-y-scroll no-scrollbar pb-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashLayout;
