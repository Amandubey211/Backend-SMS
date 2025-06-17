import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SubjectCard from './allSubjects/SubjectCard';
import { AiOutlineFileSearch, AiOutlineEye } from "react-icons/ai";
import { FiLoader } from 'react-icons/fi';
import { GoAlertFill } from 'react-icons/go';
import { motion } from "framer-motion";
import { fetchCourseProgress, fetchStudentSubjectProgress } from '../../../../../../Store/Slices/Admin/Users/Students/student.action';
import MainSection from './Module/MainSection';
import { Modal, Button } from 'antd';
import Spinner from '../../../../../../Components/Common/Spinner';
import ProtectedSection from '../../../../../../Routes/ProtectedRoutes/ProtectedSection';
import { PERMISSIONS } from '../../../../../../config/permission';
import { setSelectedSemester, setSelectedSubjectId } from "../../../../../../Store/Slices/Common/User/reducers/userSlice";
import { fetchSemestersByClass } from '../../../../../../Store/Slices/Admin/Class/Semester/semesterThunks';

const StudentCourseProgress = ({ student }) => {
  const { cid } = useParams();
  const { studentSubjectProgress, loading } = useSelector((store) => store.admin.all_students);

  const [semesterModalVisible, setSemesterModalVisible] = useState(false);
  const {
    semesters,
    loading: semesterLoading,
    error: semesterError,
  } = useSelector((state) => state.admin.semesters);
  const [selectedSubject, setSelectedSubject] = useState(studentSubjectProgress[0]?.subjectId);
  const [subjectColor, setSubjectColor] = useState("#808080"); // Default to gray
  const { selectedSemester } = useSelector(
    (state) => state.common.user.classInfo
  );
  const dispatch = useDispatch();

  // Fetch subjects and initial course progress
  useEffect(() => {
    dispatch(fetchStudentSubjectProgress(cid)).then(() => {
      if (studentSubjectProgress?.length > 0 && selectedSemester?.id) {
        dispatch(
          fetchCourseProgress({
            studentId: cid,
            subjectId: selectedSubject,
            semesterId: selectedSemester.id,
          })
        ).unwrap().then((response) => {
          setSubjectColor(response.subjectColor || "#808080"); // Set the subject color from response
        });
      }
    });
  }, [dispatch, selectedSemester]);

  // Fetch semesters
  useEffect(() => {
    dispatch(fetchSemestersByClass(student?.classId));
  }, [dispatch, student?.classId]);

  // Fetch modules for the selected subject and update subject color
  const fetchModules = (subjectId) => {
    if (selectedSemester?.id) {
      setSelectedSubject(subjectId);
      dispatch(
        fetchCourseProgress({
          studentId: cid,
          subjectId: subjectId,
          semesterId: selectedSemester.id,
        })
      ).unwrap().then((response) => {
        setSubjectColor(response.subjectColor || "#808080"); // Update subject color from response
      });
    }
  };

  const handleSemesterSelect = (semester) => {
    dispatch(setSelectedSemester({ id: semester._id, name: semester.title }));
    setSemesterModalVisible(false);
  };

  return (
    <>
      {loading ? (
        <div className="w-full h-[90vh] flex items-center justify-center text-gray-600">
          <Spinner />
        </div>
      ) : (
        <div className="py-2 max-w-[68vw]">
          <div className="flex flex-col justify-between pb-2">
            <div className="flex flex-col w-full md:w-[16%] space-y-3 p-3 ml-3">
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
            <div>
              <ProtectedSection requiredPermission={PERMISSIONS.GET_COURSE_PROGRESS} title={"Subjects Progress"}>
                <div className="flex flex-row gap-2 p-4 overflow-x-auto max-w-full">
                  {studentSubjectProgress?.length > 0 ? (
                    studentSubjectProgress?.map((subject, index) => (
                      <div
                        key={index}
                        className="min-w-max"
                        onClick={() => fetchModules(subject.subjectId)}
                      >
                        <div
                          className={`rounded-lg border-2 transition-all duration-200 ${subject.subjectId === selectedSubject
                            ? "shadow-md"
                            : "border-gray-200 hover:shadow-sm"
                            }`}
                          style={{
                            borderColor:
                              subject.subjectId === selectedSubject
                                ? subjectColor
                                : undefined,
                          }}
                        >
                          <SubjectCard subject={subject} i={index} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex w-full h-full text-gray-500 items-center justify-center flex-col text-xl">
                      <AiOutlineFileSearch className="text-[3rem]" />
                      No Module Found
                    </div>
                  )}
                </div>
              </ProtectedSection>
            </div>
          </div>
          <div className="border-t-2">
            <ProtectedSection requiredPermission={PERMISSIONS.GET_PROGRESS_OF_SUBJECT} title={"Subjects"}>
              <MainSection />
            </ProtectedSection>
          </div>
        </div>
      )}
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

export default StudentCourseProgress;