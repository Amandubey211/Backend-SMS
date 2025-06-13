import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import SubjectCard from './allSubjects/SubjectCard'
import { AiOutlineFileSearch, AiOutlineEye } from "react-icons/ai";
import { FiLoader } from 'react-icons/fi'
import { GoAlertFill } from 'react-icons/go'
import { motion } from "framer-motion";
import { fetchCourseProgress, fetchStudentSubjectProgress } from '../../../../../../Store/Slices/Admin/Users/Students/student.action'
import MainSection from './Module/MainSection'
import { Modal, Button } from 'antd'
import Spinner from '../../../../../../Components/Common/Spinner'
import ProtectedSection from '../../../../../../Routes/ProtectedRoutes/ProtectedSection'
import { PERMISSIONS } from '../../../../../../config/permission'
import { setSelectedSemester } from "../../../../../../Store/Slices/Common/User/reducers/userSlice";
const StudentCourseProgress = ({ student }) => {
  const { cid } = useParams()
  const { studentSubjectProgress, loading } = useSelector((store) => store.admin.all_students);

  const [semesterModalVisible, setSemesterModalVisible] = useState(false);
  const {
    semesters,
    loading: semesterLoading,
    error: semesterError,
  } = useSelector((state) => state.admin.semesters);
  const { selectedSemester } = useSelector(
    (state) => state.common.user.classInfo
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchStudentSubjectProgress(cid)).then(() => {
      if (studentSubjectProgress?.length > 0) {
        dispatch(
          fetchCourseProgress({ studentId: cid, subjectId: studentSubjectProgress[0]?.subjectId, semesterId: selectedSemester.id })
        )
      }
    });
  }, [selectedSemester]);
  const fetchModules = (subjectId) => {
    dispatch(
      fetchCourseProgress({ studentId: cid, subjectId: subjectId, semesterId: selectedSemester.id })
    )
  }
  const handleSemesterSelect = (semester) => {
    dispatch(setSelectedSemester({ id: semester._id, name: semester.title }));
    setSemesterModalVisible(false);
  };
  return (
    <>
      {loading ? <div className='w-full h-[90vh] flex items-center justify-center text-gray-600'>
        <Spinner />
      </div> :
        <div className='py-2 max-w-[68vw]'>
          <div className='flex flex-col justify-between pb-2'>
            <div className="flex flex-col w-full md:w-[16%] space-y-3 p-3 ml-3">
              {/* Semester Selection Section */}
              <div>
                <Button
                  type="default"
                  onClick={() => setSemesterModalVisible(true)}
                  className="w-full border border-pink-400 bg-white text-black rounded-lg font-semibold text-sm  transition-colors duration-200  hover:bg-pink-400  hover:text-pink-900"
                  aria-label="Select Semester"
                >
                  {selectedSemester && selectedSemester.name ? (
                    <>
                      {/* Show full label on screens ≥ small */}
                      <span className="hidden sm:inline">{selectedSemester.name}</span>
                      {/* Short label on smaller screens (< sm) */}
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
                <div className='flex flex-row gap-2 p-4  overflow-x-auto max-w-full '>
                  {studentSubjectProgress?.length > 0 ?
                    studentSubjectProgress?.map((subject, index) => (
                      <div key={index} className='min-w-max' onClick={() => fetchModules(subject.subjectId)}>
                        <SubjectCard subject={subject} i={index} />
                      </div>
                    )) : <div className="flex w-full h-full text-gray-500  items-center justify-center flex-col text-xl">
                      <AiOutlineFileSearch className="text-[3rem]" />
                      No  Module Found
                    </div>
                  }
                </div>
              </ProtectedSection>
            </div>

          </div>
          <div className='border-t-2'>
            <ProtectedSection requiredPermission={PERMISSIONS.GET_PROGRESS_OF_SUBJECT} title={"Subjects"}>
              <MainSection />
            </ProtectedSection>
          </div>
        </div>
      }
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
  )
}
export default StudentCourseProgress