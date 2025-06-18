import React, { useEffect, lazy, Suspense, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { fetchSectionsByClass } from "../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import Sidebar from "../../../Components/Common/Sidebar";
import { useParams } from "react-router-dom";
import {
  setSelectedSection,
  filterTeachersBySection,
} from "../../../Store/Slices/Admin/Class/Teachers/teacherSlice";

const AssignTeacher = lazy(() => import("./AssignTeacher"));

const NavigationBar = ({
  isSidebarOpen,
  openSidebarForAdd,
  closeSidebar,
  editingTeacher,
}) => {
  const { t } = useTranslation("admClass");
  const dispatch = useDispatch();
  const { cid } = useParams();

  // ───── Redux selectors ─────
  const sections = useSelector(
    (state) => state.admin.group_section.sectionsList
  );
  const role = useSelector((store) => store.common.auth.role);
  const selectedSection = useSelector(
    (state) => state.admin.teacher.selectedSection
  );
  const totalTeachers = useSelector(
    (state) => state.admin.teacher.assignedTeachers?.length
  );

  // ───── Role check ─────
  const isAdmin = role?.toLowerCase() === "admin"; // NEW

  // ───── Helpers ─────
  const getButtonClass = useCallback(
    (section) =>
      selectedSection === section
        ? "relative px-4 py-2 rounded-full bg-gradient-to-r from-red-400 to-purple-500 text-white"
        : "relative px-4 py-2 rounded-full border border-gray-300",
    [selectedSection]
  );

  // ───── Effects ─────
  useEffect(() => {
    dispatch(fetchSectionsByClass(cid));
  }, [dispatch, cid]);

  const handleSectionChange = (section) => {
    dispatch(setSelectedSection(section));
    dispatch(filterTeachersBySection());
  };

  return (
    <>
      {/* ───────── Header ───────── */}
      <div className="flex justify-between items-center p-4">
        {/* Title + count */}
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-semibold">{t("All Instructors")}</h1>
          <span className="bg-purple-200 text-purple-700 rounded-full w-7 h-7 flex justify-center items-center text-sm">
            {totalTeachers}
          </span>
        </div>

        {/* Assign / Edit button – ADMIN ONLY */}
        {isAdmin /* NEW */ && (
          <button
            onClick={openSidebarForAdd}
            className="flex items-center border border-gray-300 ps-5 py-0 rounded-full"
          >
            <span className="mr-2">
              {editingTeacher ? t("Edit Instructor") : t("Assign Instructor")}
            </span>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-12 h-12 flex items-center justify-center">
              <span className="text-3xl -mt-2">
                {editingTeacher ? "✎" : "+"}
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Sidebar for Assign/Edit Instructor (opens only if admin triggered) */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        title={
          editingTeacher ? t("Edit Instructor") : t("Assign new Instructor")
        }
      >
        <Suspense fallback={<div>{t("Loading...")}</div>}>
          <AssignTeacher
            editingTeacher={editingTeacher}
            closeSidebar={closeSidebar}
          />
        </Suspense>
      </Sidebar>

      {/* ───────── Section filter buttons ───────── */}
      <div className="flex space-x-2 px-5">
        <button
          className={getButtonClass("Everyone")}
          onClick={() => handleSectionChange("Everyone")}
        >
          {t("Everyone")}
        </button>
        {sections?.map((item) => (
          <button
            key={item.sectionName}
            className={getButtonClass(item.sectionName)}
            onClick={() => handleSectionChange(item.sectionName)}
          >
            {item.sectionName}
          </button>
        ))}
      </div>
    </>
  );
};

export default NavigationBar;
