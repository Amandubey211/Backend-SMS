import React, { useEffect, useState, lazy, Suspense } from "react";
import Sidebar from "../../../Components/Common/Sidebar";
import useFetchSection from "../../../Hooks/AuthHooks/Staff/Admin/Sections/useFetchSection";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import useFetchTeachersByClass from "../../../Hooks/AuthHooks/Staff/Admin/Teacher/useFetchTeachersByClass";

const AssignTeacher = lazy(() => import("./AssignTeacher"));

const NavigationBar = ({ onSectionChange, selectedSection, totalTeachers }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const Sections = useSelector((store) => store.Class.sectionsList);
  const { fetchTeachersByClass } = useFetchTeachersByClass();
  const { fetchSection } = useFetchSection();
  const { cid } = useParams();
  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);
  useEffect(() => {
    if (cid) {
      fetchSection(cid);
    }
  }, [cid, fetchSection]);


  const getButtonClass = (section) => {
    return selectedSection === section
      ? "relative px-4 py-2 rounded-full bg-gradient-to-r from-red-400 to-purple-500 text-white"
      : "relative px-4 py-2 rounded-full border border-gray-300";
  };

  const handleSectionChange = (section, id) => {
    onSectionChange(section);
    fetchTeachersByClass(id);
  };

  return (
    <>
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">All Instructors</h1>
          <span className="bg-purple-200 text-purple-700 rounded-full px-2 py-1 text-sm">
            {totalTeachers}
          </span>
        </div>

        <button
          onClick={handleSidebarOpen}
          className="flex items-center border border-gray-300 ps-5 py-0 rounded-full"
        >
          <span className="mr-2">Assign Instructor</span>
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-12 h-12 flex items-center justify-center">
            <span className="text-3xl -mt-2">+</span>
          </div>
        </button>
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        title="Assign new Instructor"
      >
        <Suspense fallback={<div>Loading...</div>}>
          <AssignTeacher />
        </Suspense>
      </Sidebar>

      <div className="flex space-x-2 px-5">
        <button
          className={getButtonClass("Everyone")}
          onClick={() => handleSectionChange("Everyone", cid)}
        >
          Everyone
        </button>

        {Sections?.map((item) => (
          <button
            key={item.sectionName}
            className={getButtonClass(item.sectionName)}
            onClick={() => handleSectionChange(item.sectionName, item._id)}
          >
            {item.sectionName}
          </button>
        ))}
      </div>
    </>
  );
};

export default NavigationBar;
