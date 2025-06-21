import React, { useEffect, useState } from "react";
import GradeAccordionItem from "./GradeAccordionItem";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentGrades } from "../../../../../../Store/Slices/Admin/Users/Students/student.action";
import { useTranslation } from "react-i18next";
import ProtectedSection from "../../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../../config/permission";
import { setSelectedSemester } from "../../../../../../Store/Slices/Common/User/reducers/userSlice";
import { fetchSemestersByClass } from "../../../../../../Store/Slices/Admin/Class/Semester/semesterThunks";
import { Button, Modal, Empty, Alert, Segmented } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { FiFilter, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { BsStars } from "react-icons/bs";

const StudentGradesAccordion = ({ student }) => {
  const { t } = useTranslation("admAccounts");
  const { grades, loading, error } = useSelector(
    (store) => store.admin.all_students
  );
  const dispatch = useDispatch();
  const { selectedSemester } = useSelector(
    (state) => state.common.user.classInfo
  );
  const [selectedMode, setSelectedMode] = useState("online");
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedSubjectName, setSelectedSubjectName] = useState(null);
  const [semesterModalVisible, setSemesterModalVisible] = useState(false);
  const [initialSubjectsLoaded, setInitialSubjectsLoaded] = useState(false);

  const {
    semesters,
    loading: semesterLoading,
    error: semesterError,
  } = useSelector((state) => state.admin.semesters);

  const getStudentGrades = async (subjectId) => {
    try {
      const params = {
        mode: selectedMode,
        semesterId: selectedSemester?.id,
        subjectId: subjectId,
      };

      await dispatch(
        fetchStudentGrades({
          params,
          studentId: student?._id,
          studentClassId: student?.presentClassId,
        })
      );
    } catch (err) {
      console.error("Failed to fetch grades:", err);
    }
  };

  useEffect(() => {
    if (selectedSubjectId) {
      getStudentGrades(selectedSubjectId);
    }
  }, [dispatch, selectedSemester, selectedMode, selectedSubjectId]);

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        await dispatch(fetchSemestersByClass(student?.classId));
      } catch (err) {
        console.error("Failed to fetch semesters:", err);
      }
    };
    fetchSemesters();
  }, [dispatch, student?.classId]);

  useEffect(() => {
    if (grades?.subjects?.length > 0 && !initialSubjectsLoaded) {
      const firstSubject = grades.subjects[0];
      if (firstSubject) {
        setSelectedSubjectId(firstSubject.subjectId);
        setSelectedSubjectName(firstSubject.subjectName);
        setInitialSubjectsLoaded(true);
      }
    }
  }, [grades?.subjects, initialSubjectsLoaded]);

  const handleSemesterSelect = (semester) => {
    dispatch(setSelectedSemester({ id: semester._id, name: semester.title }));
    setSemesterModalVisible(false);
  };

  const handleModeChange = (value) => {
    setSelectedMode(value);
  };

  const handleSubjectSelect = (subjectId, subjectName) => {
    setSelectedSubjectId(subjectId);
    setSelectedSubjectName(subjectName);
  };

  return (
    <ProtectedSection
      requiredPermission={PERMISSIONS.GET_STUDENT_GRADES}
      title={
        <div className="flex items-center gap-2">
          <BsStars className="text-purple-500" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C83B62] to-[#7F35CD]">
            Student Performance
          </span>
        </div>
      }
    >
      <div className="flex flex-col h-full">
        <motion.div
          className="sticky top-0 z-10 bg-white border-b border-gray-200 py-3 px-4 shadow-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-200">
                <FiFilter className="text-pink-500" />
                <span className="text-sm font-medium text-gray-700">
                  Filters
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Segmented
                  size="middle"
                  options={[
                    { label: "Online Mode", value: "online" },
                    { label: "Offline Mode", value: "offline" },
                  ]}
                  value={selectedMode}
                  onChange={handleModeChange}
                  className="!text-sm"
                />
              </div>

              <div className="h-5 w-px bg-gray-200 hidden sm:block"></div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setSemesterModalVisible(true)}
                  className="bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white px-4 py-1.5 rounded-md text-sm font-medium shadow"
                >
                  {selectedSemester?.name || "Select Semester"}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex-1 overflow-y-auto p-4">
          {error ? (
            <Alert
              message="Error Loading Grades"
              description={error.message || "Failed to load student grades."}
              type="error"
              showIcon
              className="mb-4 text-sm"
            />
          ) : (
            <GradeAccordionItem
              getData={handleSubjectSelect}
              selectedMode={selectedMode}
              loading={loading}
              selectedSubjectId={selectedSubjectId}
            />
          )}
        </div>
      </div>

      <Modal
        visible={semesterModalVisible}
        onCancel={() => setSemesterModalVisible(false)}
        footer={null}
        title={
          <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#C83B62] to-[#7F35CD]">
            Select Semester
          </div>
        }
        bodyStyle={{ padding: "1rem" }}
        destroyOnClose
        centered
        className="rounded-lg"
      >
        <AnimatePresence>
          {semesterLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-40"
            >
              <div className="space-y-2 w-full">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-10 bg-gray-100 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
            </motion.div>
          ) : semesterError ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Alert
                message="Error Loading Semesters"
                description={
                  semesterError.message || "Failed to load semesters."
                }
                type="error"
                showIcon
                className="rounded-lg text-sm"
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {semesters && semesters.length > 0 ? (
                semesters.map((sem) => (
                  <motion.div
                    key={sem._id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Button
                      onClick={() => handleSemesterSelect(sem)}
                      className={`w-full h-10 flex items-center justify-between text-left rounded-lg text-sm ${
                        selectedSemester?.id === sem._id
                          ? "bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white"
                          : "bg-white hover:bg-gray-50 border border-gray-200"
                      }`}
                    >
                      {sem.title}
                      {selectedSemester?.id === sem._id && (
                        <FiChevronUp className="ml-2" />
                      )}
                    </Button>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-6"
                >
                  <Empty
                    description="No semesters available"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    className="text-sm"
                  />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>
    </ProtectedSection>
  );
};

export default StudentGradesAccordion;
