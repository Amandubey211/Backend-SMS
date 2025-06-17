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
  const [selectedMode, setSelectedMode] = useState("online");
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);

  const getStudentGrades = async (subjectId, moduleId, chapterId, arrangeBy) => {
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

  useEffect(() => {
    if (selectedSubjectId) {
      getStudentGrades(selectedSubjectId);
    } else {
      getStudentGrades();
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
          {/* Left Side: GradeAccordionItem */}
          <div className="w-[75%]">
            <GradeAccordionItem
              getData={handleSubjectSelect}
              selectedMode={selectedMode}
            />
          </div>

          {/* Right Side: Filters and Grade Summary */}
          <div className="mt-4 p-4 w-[25%] border-l-2 flex flex-col gap-6">
            {/* Filter Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Filters</h3>
              <div className="flex flex-col gap-4">
                {/* Mode Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mode
                  </label>
                  <Select
                    value={selectedMode}
                    onChange={handleModeChange}
                    className="w-full"
                    aria-label="Select Mode"
                  >
                    <Option value="online">Online</Option>
                    <Option value="offline">Offline</Option>
                  </Select>
                </div>

                {/* Semester Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Semester
                  </label>
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

                {/* Placeholder for Future Filters */}
                {/* Add more filter inputs here as needed */}
              </div>
            </div>

            {/* Grade Summary Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{t("Grade Summary")}</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-700">{t("Assignment")}</p>
                  <p className="text-sm text-gray-600">
                    {grades?.totalScoreOfSubmitAssignments ?? 0} /{" "}
                    {grades?.totalScoreOfAllAssignments ?? 0}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-700">{t("Quiz")}</p>
                  <p className="text-sm text-gray-600">
                    {grades?.totalQuizCompletedScore ?? 0} /{" "}
                    {grades?.totalScoreOfAllQuizzes ?? 0}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-700">{t("Attendance")}</p>
                  <p className="text-sm text-gray-600">
                    {grades?.attendance ?? 0} {t("DAY")}
                  </p>
                </div>
                <div className="border-t pt-3 mt-3 flex justify-between items-center">
                  <p className="text-lg font-semibold text-gray-800">{t("Total Score")}:</p>
                  <p className="text-pink-500 text-xl font-semibold">
                    {grades?.total ?? 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedSection>

      {/* Semester Selection Modal */}
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
                    className={`w-full text-left border rounded-md transition-colors duration-200 ${selectedSemester && selectedSemester.id === sem._id
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