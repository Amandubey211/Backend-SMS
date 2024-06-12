import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../Common/Navbar";
import { toggleSidebar } from "../../Redux/Slices/SidebarSlice";
import SideMenubar from "./SideMenubar";

const DashLayout = ({ children, hideSearchbar, hideAvatarList, hideStudentView }) => {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state) => state.sidebar.isOpen);
  console.log(hideSearchbar);
  
  return (
    <div className="flex w-full h-full">
      <SideMenubar isOpen={isSidebarOpen} />
      
      <div
        className={`transition-all duration-300 h-screen ${
          isSidebarOpen ? "w-4/5" : "w-full"
        } flex-1`}
      >
        <Navbar
          toggleSidebar={() => dispatch(toggleSidebar())}
          hideSearchbar={hideSearchbar}
          hideAvatarList={hideAvatarList}
          hideStudentView={hideStudentView}
        />
        <main className="w-full  h-screen overflow-y-scroll no-scrollbar ">{children}</main>
      </div>
    </div>
  );
};

export default DashLayout;
