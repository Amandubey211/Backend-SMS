import React, { useState, useEffect, lazy, Suspense, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSectionsByClass } from "../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import Sidebar from "../../../Components/Common/Sidebar";
import { useParams } from "react-router-dom";
import {
  setSelectedSection,
  filterTeachersBySection,
} from "../../../Store/Slices/Admin/Class/Teachers/teacherSlice";

const AssignTeacher = lazy(() => import("./AssignTeacher"));

const NavigationBar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const { cid } = useParams();
  const sections = useSelector(
    (state) => state.admin.group_section.sectionsList
  );
  const selectedSection = useSelector(
    (state) => state.admin.teacher.selectedSection
  );
  const totalTeachers = useSelector(
    (state) => state.admin.teacher.assignedTeachers.length
  );

  const getButtonClass = useCallback(
    (section) => {
      return selectedSection === section
        ? "relative px-4 py-2 rounded-full bg-gradient-to-r from-red-400 to-purple-500 text-white"
        : "relative px-4 py-2 rounded-full border border-gray-300";
    },
    [selectedSection]
  );

  useEffect(() => {
    dispatch(fetchSectionsByClass(cid));
  }, [dispatch, cid]);

  const handleSidebarOpen = () => setIsSidebarOpen(true);
  const handleSidebarClose = () => setIsSidebarOpen(false);

  const handleSectionChange = (section) => {
    dispatch(setSelectedSection(section)); // Set the selected section
    dispatch(filterTeachersBySection()); // Trigger filtering based on the section
  };

  return (
    <>
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-semibold">All Instructors</h1>
          <span className="bg-purple-200 text-purple-700 rounded-full w-7 h-7 flex justify-center items-center text-sm">
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
          onClick={() => handleSectionChange("Everyone")}
        >
          Everyone {selectedSection === "Everyone"}
        </button>
        {sections?.map((item) => (
          <button
            key={item.sectionName}
            className={getButtonClass(item.sectionName)}
            onClick={() => handleSectionChange(item.sectionName)}
          >
            {item.sectionName}{" "}
          </button>
        ))}
      </div>
    </>
  );
};

export default NavigationBar;
