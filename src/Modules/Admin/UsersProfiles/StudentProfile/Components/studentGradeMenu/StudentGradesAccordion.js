import React, { useEffect, useState } from "react";
import GradeAccordionItem from "./GradeAccordionItem";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentGrades } from "../../../../../../Store/Slices/Admin/Users/Students/student.action";
import { useTranslation } from "react-i18next";
import ProtectedSection from "../../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../../config/permission";
import { setSelectedSemester } from "../../../../../../Store/Slices/Common/User/reducers/userSlice";
import { fetchSemestersByClass } from "../../../../../../Store/Slices/Admin/Class/Semester/semesterThunks";
import { Button, Modal, Select } from "antd";
import { motion } from "framer-motion";

const { Option } = Select;

const StudentGradesAccordion = ({ student }) => {
  const { t } = useTranslation("admAccounts");
  const { grades, loading } = useSelector((store) => store.admin.all_students);
  const dispatch = useDispatch();
  const { selectedSemester } = useSelector(
    (state) => state.common.user.classInfo
  );
  const [selectedMode, setSelectedMode] = useState("online"); // Default mode is "online"
  const [selectedSubjectId, setSelectedSubjectId] = useState(null); // Track selected subject

  const getStudentGrades = async (
    subjectId,
    moduleId,
    chapterId,
    arrangeBy
  ) => {
    const params = { mode: selectedMode, semesterId: selectedSemester?.id };
    if (subjectId) params.subjectId = subjectId;
    if (moduleId) params.moduleId = moduleId;
    if (chapterId) params.chapterId = chapterId;
    if (arrangeBy) params.arrangeBy = arrangeBy;
    dispatch(
      fetchStudentGrades({
        params,
        studentId: student?._id,
        studentClassId: student?.presentClassId,
      })
    );
  };

  // Update grades when mode, semester, or selected subject changes
  useEffect(() => {
    if (selectedSubjectId) {
      getStudentGrades(selectedSubjectId);
    } else {
      getStudentGrades(); // Fetch without subjectId if none is selected
    }
  }, [dispatch, selectedSemester, selectedMode, selectedSubjectId]);

  useEffect(() => {
    dispatch(fetchSemestersByClass(student?.classId));
  }, [dispatch, student?.classId]);

  const [semesterModalVisible, setSemesterModalVisible] = useState(false);
  const {
    semesters,
    loading: semesterLoading,
    error: semesterError,
  } = useSelector((state) => state.admin.semesters);

  const handleSemesterSelect = (semester) => {
    dispatch(setSelectedSemester({ id: semester._id, name: semester.title }));
    setSemesterModalVisible(false);
  };

  const handleModeChange = (value) => {
    setSelectedMode(value);
  };

  // Function to handle subject selection from GradeAccordionItem
  const handleSubjectSelect = (subjectId) => {
    setSelectedSubjectId(subjectId);
    getStudentGrades(subjectId);
  };

  return (
    <>
      <ProtectedSection
        requiredPermission={PERMISSIONS.GET_STUDENT_GRADES}
        title={"Grades"}
      >
        <div className="flex flex-row w-[100%]">
          <div className="w-[75%]">
            <GradeAccordionItem
              getData={handleSubjectSelect} // Pass the subject selection handler
              selectedMode={selectedMode}
            />
          </div>
          <div className="mt-4 p-3 w-[25%] border-l-2">
            <div className="flex flex-col w-full mb-2">
              {/* Mode Selection Dropdown */}
              <div className="mb-2">
                <Select
                  defaultValue="online"
                  onChange={handleModeChange}
                  className="w-full"
                  aria-label="Select Mode"
                >
                  <Option value="online">Online</Option>
                  <Option value="offline">Offline</Option>
                </Select>
              </div>

              {/* Semester Selection Section */}
              <div>
                <Button
                  type="default"
                  onClick={() => setSemesterModalVisible(true)}
                  className="w-full border border-pink-400 bg-white text-black rounded-lg font-semibold text-sm transition-colors duration-200 hover:bg-pink-400 hover:text-pink-900"
                  aria-label="Select Semester"
                >
                  {selectedSemester && selectedSemester.name ? (
                    <>
                      <span className="hidden sm:inline">{selectedSemester.name}</span>
                      <span className="inline sm:hidden">{selectedSemester.name}</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Select Semester</span>
                      <span className="inline sm:hidden">Sem</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
            <h3 className="text-md font-semibold mb-4">{t("Grade Summary")}</h3>
            <div className="flex justify-between mb-2">
              <p className="text-sm">{t("Assignment")}</p>
              <p className="text-sm">
                {grades?.totalScoreOfSubmitAssignments} /{" "}
                {grades?.totalScoreOfAllAssignments}
              </p>
            </div>
            <div className="flex justify-between mb-2">
              <p className="text-sm">{t("Quiz")}</p>
              <p className="text-sm">
                {grades?.totalQuizCompletedScore} /{" "}
                {grades?.totalScoreOfAllQuizzes}
              </p>
            </div>
            <div className="flex justify-between mb-2">
              <p className="text-sm">{t("Attendance")}</p>
              <p className="text-sm">
                {grades?.attendance} {t("DAY")}
              </p>
            </div>
            <div className="border-t mt-4 flex p-3 justify-between px-4 gap-1">
              <p className="text-lg font-semibold">{t("Total Score")}:</p>
              <p className="text-pink-500 text-xl font-semibold">
                {grades?.total}
              </p>
            </div>
          </div>
        </div>
      </ProtectedSection>
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
              <span>{"Loading semesters..."}</span>
            </div>
          ) : semesterError ? (
            <div className="text-red-500 text-center">
              {"Failed to load semesters. Please try again."}
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
                <p className="text-center">{"No semesters available."}</p>
              )}
            </div>
          )}
        </motion.div>
      </Modal>
    </>
  );
};

export default StudentGradesAccordion;            