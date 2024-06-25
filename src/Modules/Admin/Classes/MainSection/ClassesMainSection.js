// Components/ClassesMainSection.js
import React, { useEffect, useState } from "react";
import ClassCard from "./ClassCard";
import Sidebar from "../../../../Components/Common/Sidebar";
import AddNewClass from "./AddNewClass";
import { useSelector } from "react-redux";
import Fallback from "../../../../Components/Common/Fallback";
import useGetAllClasses from "../../../../Hooks/AuthHooks/Staff/Admin/Class/useGetAllClasses";

const ClassesMainSection = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { loading, error, fetchClasses } = useGetAllClasses();
  const classes = useSelector((store) => store.Class.classList);

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);
  useEffect(() => {
    fetchClasses();
  }, []);
  return (
    <div className="min-h-screen p-4">
      <div className="flex justify-between">
        <h1 className="text-lg opacity-50">All Classes</h1>
        <button
          onClick={handleSidebarOpen}
          className="px-4 py-2 rounded-md bg-gradient-to-r from-pink-100 to-purple-200"
          aria-label="Add New Class"
        >
          <span className="text-gradient"> + Add New Class</span>
        </button>
      </div>
      {loading ? (
        <Fallback />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-4">
          {classes?.map((cls) => (
            <ClassCard
              key={cls._id}
              teachersCount={cls.teachersCount}
              groups={cls.groupsCount}
              sections={cls.sectionsCount}
              students={cls.studentsCount}
              className={cls.className}
              classId={cls._id}
            />
          ))}
        </div>
      )}
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
