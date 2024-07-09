import React, { useState } from "react";
import ClassCard from "./ClassCard";
import { classes } from "../../Dashboard/DashboardData/ClassesData";
import Sidebar from "../../../../Components/Common/Sidebar";
import AddNewClass from "./AddNewClass";

const ClassesMainSection = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen p-4">
      <div className="flex justify-between">
        <h1 className="text-lg opacity-50 ">All Classes</h1>
        <button
          onClick={handleSidebarOpen}
          className="px-4 py-2 rounded-md  bg-gradient-to-r from-pink-100 to-purple-200"
        >
          <span className="text-gradient">     + Add New Class</span>
     
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-4">
        {classes.map((cls, index) => (
          <ClassCard key={index} {...cls} />
        ))}
      </div>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        title="Add New Class"
      >
        <AddNewClass />
      </Sidebar>
    </div>
  );
};

export default ClassesMainSection;
