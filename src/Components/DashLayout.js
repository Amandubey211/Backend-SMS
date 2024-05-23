import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { toggleSidebar } from "../Redux/Slices/SidebarSlice";

const DashLayout = ({ children }) => {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state) => state.sidebar.isOpen);

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={isSidebarOpen} />
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "w-4/5" : "w-[96%]" // 80% or 96% width when sidebar is toggled
        } flex-1`}
      >
        <Navbar toggleSidebar={() => dispatch(toggleSidebar())} />
        <main className="p-2 min-h-screen">{children}</main>
      </div>
    </div>
  );
};

export default DashLayout;
