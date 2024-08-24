import React, { useEffect, useState } from "react";
import ClassCard from "./ClassCard";
import Sidebar from "../../../../Components/Common/Sidebar";
import AddNewClass from "./AddNewClass";
import { useSelector } from "react-redux";
import Spinner from "../../../../Components/Common/Spinner";
import useGetAllClasses from "../../../../Hooks/AuthHooks/Staff/Admin/Class/useGetAllClasses";
import NoDataFound from "../../../../Components/Common/NoDataFound"; // Import the NoDataFound component

const ClassesMainSection = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { loading, error, fetchClasses } = useGetAllClasses();
  const classes = useSelector((store) => store.Class.classList);

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);

  useEffect(() => {
    // Fetch classes only if there are no classes loaded yet
    if (classes.length === 0) {
      fetchClasses();
    }
  }, [classes.length, fetchClasses]);

  return (
    <div className="min-h-screen p-4">
      <div className="flex justify-end">
        <button
          onClick={handleSidebarOpen}
          className="px-4 py-2 rounded-md bg-gradient-to-r from-pink-100 to-purple-200"
          aria-label="Add New Class"
        >
          <span className="text-gradient"> + Add New Class</span>
        </button>
      </div>
      {loading ? (
        <Spinner />
      ) : error ? (
        <NoDataFound title="Classes" />
      ) : classes.length === 0 ? (
        <NoDataFound title="Classes" /> // Use NoDataFound when no classes are found
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
