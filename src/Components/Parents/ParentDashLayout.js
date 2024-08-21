import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../Common/Navbar";
import SideMenubar from "./SideMenubar";
import { Toaster } from "react-hot-toast";

const ParentDashLayout = ({
  children,
  hideSearchbar,
  hideAvatarList,
  hideStudentView,
}) => {
  const isSidebarOpen = useSelector((state) => state.sidebar.isOpen);
  return (
    <div className="flex w-full h-full  ">
     <Toaster />
      <SideMenubar />

      <div
        className={`transition-all duration-300 h-auto ${
          isSidebarOpen ? "w-4/5" : "w-full"
        } flex-1`}
      >
        <Navbar
          hideSearchbar={hideSearchbar}
          hideAvatarList={hideAvatarList}
          hideStudentView={hideStudentView}
        />
        <main className="w-full  h-screen overflow-y-scroll no-scrollbar ">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ParentDashLayout;
