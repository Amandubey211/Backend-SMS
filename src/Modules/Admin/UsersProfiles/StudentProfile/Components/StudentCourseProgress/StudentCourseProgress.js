import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SubjectCard from "./allSubjects/SubjectCard";
import { AiOutlineFileSearch, AiOutlineEye } from "react-icons/ai";
import { FiLoader } from "react-icons/fi";
import { GoAlertFill } from "react-icons/go";
import { motion } from "framer-motion";
import { fetchCourseProgress, fetchStudentSubjectProgress } from "../../../../../../Store/Slices/Admin/Users/Students/student.action";
import MainSection from "./Module/MainSection";
import { Modal, Button, Skeleton } from "antd";
import ProtectedSection from "../../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../../config/permission";
import { setSelectedSemester, setSelectedSubjectId } from "../../../../../../Store/Slices/Common/User/reducers/userSlice";
import { fetchSemestersByClass } from "../../../../../../Store/Slices/Admin/Class/Semester/semesterThunks";

// Horizontal Skeleton Component
const SubjectProgressSkeleton = ({ subjectCount = 5 }) => {
  return (
    <div className="w-full min-h-[50vh] flex items-center justify-start overflow-x-auto scrollbar-thin" style={{ scrollbarWidth: 'thin', scrollbarColor: '#888 #f1f1f1', paddingLeft: '0' }}>
      <div className="flex flex-row gap-2 p-2">
        {Array(subjectCount)
          .fill("")
          .map((_, index) => (
            <div
              key={index}
              className="w-[220px] min-w-[220px] h-[160px] bg-white rounded-lg shadow-md p-3 flex-shrink-0 flex flex-col justify-between"
              style={{ boxSizing: 'border-box' }}
            >
              {/* Top row: icon + subject/date */}
              <div className="flex items-center gap-2">
                <Skeleton.Avatar
                  active
                  size={40}
                  shape="square"
                  style={{ backgroundColor: '#f0f0f0', margin: '0' }}
                />
                <div className="flex flex-col">
                  <Skeleton.Input
                    active
                    size="small"
                    style={{ width: "100px", marginBottom: "2px", backgroundColor: '#f0f0f0' }}
                  />
                  <Skeleton.Input
                    active
                    size="small"
                    style={{ width: "120px", backgroundColor: '#f0f0f0' }}
                  />
                </div>
              </div>

              {/* Progress bar placeholder */}
              <Skeleton.Input
                active
                size="small"
                style={{
                  width: "100%",
                  height: "6px",
                  borderRadius: "3px",
                  backgroundColor: '#f0f0f0',
                }}
              />

              {/* Bottom row: modules & percentage */}
              <div className="flex justify-between items-center">
                <Skeleton.Input
                  active
                  size="small"
                  style={{ width: "60px", backgroundColor: '#f0f0f0' }}
                />
                <Skeleton.Input
                  active
                  size="small"
                  style={{ width: "40px", backgroundColor: '#f0f0f0' }}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

const StudentCourseProgress = ({ student }) => {
  const { cid } = useParams();
  const { studentSubjectProgress, error: subjectError } = useSelector((store) => store.admin.all_students);
  const {
    semesters,
    loading: semesterLoading,
    error: semesterError,
  } = useSelector((state) => state.admin.semesters);
  const { selectedSemester } = useSelector((state) => state.common.user.classInfo);
  const dispatch = useDispatch();

  const [subjectsFetched, setSubjectsFetched] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [moduleLoading, setModuleLoading] = useState(false); // Specific loading for module/semester changes

  const [semesterModalVisible, setSemesterModalVisible] = useState(false);

  // Fetch semesters and set default to "Semester 1" only if semesters exist
  useEffect(() => {
    if (student?.classId) {
      dispatch(fetchSemestersByClass(student?.classId)).then((response) => {
        const fetchedSemesters = response.payload;
        if (fetchedSemesters.length > 0) {
          dispatch(setSelectedSemester({ id: fetchedSemesters[0]._id, name: fetchedSemesters[0].title }));
        } else {
          dispatch(setSelectedSemester(null)); // Clear semester if none available
        }
      });
    }
  }, [dispatch, student?.classId]);

  useEffect(() => {
    dispatch(fetchStudentSubjectProgress(cid)).unwrap().then((response) => {
      if (response && response.length > 0 && !selectedSubject) {
        setSelectedSubject(response[0].subjectId);
      }
    }).finally(() => {
      setSubjectsFetched(true);
    });
  }, [dispatch, cid, selectedSubject]);

  useEffect(() => {
    if (selectedSubject && selectedSemester && studentSubjectProgress?.length > 0) {
      setModuleLoading(true);
      dispatch(
        fetchCourseProgress({
          studentId: cid,
          subjectId: selectedSubject,
          semesterId: selectedSemester?.id,
        })
      )
        .unwrap()
        .finally(() => setModuleLoading(false));
    }
  }, [dispatch, selectedSubject, selectedSemester]);

  // Fetch modules for the selected subject and update subject color
  const fetchModules = (subjectId) => {
    setSelectedSubject(subjectId);
  };

  const handleSemesterSelect = (semester) => {
    dispatch(setSelectedSemester({ id: semester._id, name: semester.title }));
    setSemesterModalVisible(false);
  };

  // Show skeleton only during initial subject fetch
  if (!subjectsFetched) {
    return <SubjectProgressSkeleton />;
  }

  if (subjectError) {
    return (
      <div className="flex w-full h-full text-gray-500 items-center justify-center flex-col text-xl">
        <GoAlertFill className="text-[3rem]" />
        {subjectError.message || "Failed to load subjects"}
      </div>
    );
  }

  if (!studentSubjectProgress || studentSubjectProgress.length === 0) {
    return (
      <div className="w-full h-[80vh] flex flex-col items-center justify-center text-gray-500">
        <AiOutlineFileSearch className="text-6xl mb-4" />
        <p className="text-2xl font-bold">No subjects found.</p>
        <p>Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="py-2 max-w-[68vw] mx-auto">
      <div className="flex flex-col justify-between pb-2">
        {/* Show semester selection only if semesters exist */}
        {semesters && semesters.length > 0 && (
          <div className="flex flex-col w-full md:w-[16%] space-y-3 p-3">
            {/* Semester Selection Section */}
            <div>
              <Button
                type="default"
                onClick={() => setSemesterModalVisible(true)}
                className="w-full border border-pink-400 bg-white text-black rounded-lg font-semibold text-sm transition-colors duration-200 hover:bg-pink-400 hover:text-pink-900"
                aria-label="Select Semester"
                disabled={!selectedSemester} // Disable button if no semester
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
        )}
        <div>
          <ProtectedSection requiredPermission={PERMISSIONS.GET_COURSE_PROGRESS} title={"Subjects Progress"}>
            <div className="flex flex-row gap-2 p-2 overflow-x-auto max-w-screen scrollbar-thin" style={{ scrollbarWidth: 'thin', scrollbarColor: '#888 #f1f1f1' }}>
              {studentSubjectProgress?.map((subject, index) => (
                <div
                  key={index}
                  className="min-w-[220px]"
                  onClick={() => fetchModules(subject.subjectId)}
                >
                  <div
                    className={`rounded-lg transition-all duration-200 cursor-pointer`}
                  >
                    <SubjectCard subject={subject} i={index} subjectColor={studentSubjectProgress[index]?.subjectColor} />
                  </div>
                </div>
              ))}
            </div>
          </ProtectedSection>
        </div>
      </div>
      <div className="border-t-2">
        <ProtectedSection requiredPermission={PERMISSIONS.GET_PROGRESS_OF_SUBJECT} title={"Subjects"}>
          <MainSection loading={moduleLoading} selectedSemester={selectedSemester} />
        </ProtectedSection>
      </div>
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
    </div>
  );
};

export default StudentCourseProgress;