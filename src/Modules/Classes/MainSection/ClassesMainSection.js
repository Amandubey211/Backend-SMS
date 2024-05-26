import React, { useState } from "react";
import Sidebar from "../Sidebar";
import ClassCard from "./ClassCard";
import { classes } from "../../Dashboard/DashboardData/ClassesData";

const ClassesMainSection = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen p-4">
      <div className="flex justify-between">
        <h1 className="text-lg ">All Classes</h1>
        <button
          onClick={handleSidebarOpen}
          className="px-4 py-2 text-purple-500 bg-purple-100"
        >
          + Add New Class
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-4">
        {classes.map((cls, index) => (
          <ClassCard key={index} {...cls} />
        ))}
      </div>
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
    </div>
  );
};

export default ClassesMainSection;
