import { Button, Divider, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { setSelectedSemester } from "../../../../../Store/Slices/Common/User/reducers/userSlice";
import { useTranslation } from "react-i18next";
import { fetchSemestersByClass } from "../../../../../Store/Slices/Student/MyClass/Class/semester/semesterThunks";

const SubjectSideBar = () => {
  const location = useLocation();
  const { cid, sid } = useParams();
  // const { classId } = useSelector((store) => store?.student?.studentClass?.classData);
  // const { subjectId } = useSelector((store) => store?.student?.studentSubject?.subject);
  const {
    semesters,
    loading: semesterLoading,
    error: semesterError,
  } = useSelector((state) => state.student.semesters);
  const { selectedSemester } = useSelector(
    (state) => state.common.user.classInfo
  );
  const dispatch = useDispatch();

  // Local state to control the semester selection modal visibility
  const [semesterModalVisible, setSemesterModalVisible] = useState(false);
  const { t } = useTranslation("admModule");
  // const formattedSid = sid?.toLowerCase().replace(/ /g, "_");

  const menuItems = [
    { name: "Module", path: "module" },
    { name: "Assignments", path: "assignments" },
    { name: "Quizzes", path: "quizzes" },
    // { name: "Offline Exam", path: "offline_exam" },
    { name: "Discussions", path: "discussions" },
    { name: "Page", path: "page" },
    { name: "Grades", path: "grades" },
    { name: "Announcements", path: "announcements" },
    { name: "Syllabus", path: "syllabus" },
    { name: "Rubric", path: "rubric" },
  ];

  const getBasePath = (item) => `/student_class/${cid}/${sid}/${item?.path}`;

  useEffect(() => {
    dispatch(fetchSemestersByClass(cid));
  }, []);
  // Handler for selecting a semester from the modal
  const handleSemesterSelect = (semester) => {
    dispatch(setSelectedSemester({ id: semester._id, name: semester.title }));
    setSemesterModalVisible(false);
  };

  return (
    <div className="flex flex-col min-h-screen h-full w-[18%] space-y-4 p-4">
      {/* Semester Selection Section */}
      <div>
        <Button
          type="default"
          onClick={() => setSemesterModalVisible(true)}
          className="
    w-full
    border border-pink-400
    bg-white
    text-black
    rounded-lg
    font-semibold
    text-sm           /* smaller text */
    whitespace-normal /* allow wrapping */
    break-words       /* break long words */
    text-center       /* optionally center-align text */
    transition-colors
    duration-200
    hover:bg-pink-400
    hover:text-pink-900
  "
          aria-label="Select Semester"
        >
          {selectedSemester && selectedSemester.name ? (
            <>
              {/* Show full label on screens ≥ small */}
              <span className="hidden sm:inline">
                Sem: {selectedSemester.name}
              </span>
              {/* Short label on smaller screens (< sm) */}
              <span className="inline sm:hidden">
                Sem: {selectedSemester.name}
              </span>
            </>
          ) : (
            <>
              <span className="hidden sm:inline">Select Semester</span>
              <span className="inline sm:hidden">Sem</span>
            </>
          )}
        </Button>
      </div>

      <Divider className="border-purple-300" />
      <div className="flex flex-col space-y-2">
        {menuItems?.map((item, index) => {
          const basePath = getBasePath(item);
          const isActive = location.pathname.includes(
            `/student_class/${cid}/${sid}/${item.path}`
          );

          return (
            <NavLink
              key={index}
              to={basePath}
              className={
                isActive
                  ? "text-purple-600 font-semibold bg-purple-100 rounded-full py-1 px-4"
                  : "text-gray-800 px-4 py-1"
              }
            >
              {item.name}
            </NavLink>
          );
        })}
      </div>
      {/* Semester Selection Modal with Framer Motion Animations */}
      <Modal
        visible={semesterModalVisible}
        onCancel={() => setSemesterModalVisible(false)}
        footer={null}
        title="Select Semester"
        bodyStyle={{ padding: "1rem" }}
        destroyOnClose
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          {semesterLoading ? (
            <div className="flex justify-center items-center">
              <span>{t("Loading semesters...")}</span>
            </div>
          ) : semesterError ? (
            <div className="text-red-500 text-center">
              {t("Failed to load semesters. Please try again.")}
            </div>
          ) : (
            <div className="space-y-2">
              {semesters && semesters.length > 0 ? (
                semesters.map((sem) => (
                  <Button
                    key={sem._id}
                    onClick={() => handleSemesterSelect(sem)}
                    className={`w-full text-left border rounded-md transition-colors duration-200 ${
                      selectedSemester && selectedSemester.id === sem._id
                        ? "bg-purple-100 border-purple-400"
                        : "bg-white hover:bg-purple-50"
                    }`}
                    aria-label={`Select semester ${sem.title}`}
                  >
                    {sem.title}
                  </Button>
                ))
              ) : (
                <p className="text-center">{t("No semesters available.")}</p>
              )}
            </div>
          )}
        </motion.div>
      </Modal>
    </div>
  );
};

export default SubjectSideBar;
