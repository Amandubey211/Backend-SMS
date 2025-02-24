import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GoAlertFill } from "react-icons/go";
import SubjectCard from "../../Admin/UsersProfiles/StudentProfile/Components/StudentCourseProgress/allSubjects/SubjectCard";
import MainSection from "./MainSection.js";
import { SubjectCardSkeleton } from "../Skeletons.js";
import {
  fetchCourseProgress,
  fetchStudentSubjectProgress,
} from "../../../Store/Slices/Admin/Users/Students/student.action.js";
import { useParams } from "react-router-dom";
import { Button, Modal, Divider } from "antd";
import {
  fetchSemestersByClass,
} from "../../../Store/Slices/Parent/Semesters/parentSemester.action";
import { setSelectedSemester } from "../../../Store/Slices/Parent/Semesters/parentSemesterSlice.js";
import Layout from "../../../Components/Common/Layout.js";


const AllSubject = () => {
  const { studentId } = useParams();
  const dispatch = useDispatch();

  // Local states
  const [subjectsFetched, setSubjectsFetched] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [moduleLoading, setModuleLoading] = useState(false);

  // Semester modal state
  const [semesterModalVisible, setSemesterModalVisible] = useState(false);

  // Redux store data (admin side for subject progress)
  const {
    studentSubjectProgress,
    loading,
    error,
  } = useSelector((store) => store.admin.all_students);

  // Redux store data (parent side for semesters)
  const {
    semesters,
    selectedSemester,
    loadingSemesters,
    errorSemesters,
  } = useSelector((store) => store.Parent.semesters);

  // Get selected child from Redux
  const selectedChild = useSelector((state) => state.Parent.children.selectedChild);

  // 1. Fetch the student's subjects
  useEffect(() => {
    dispatch(fetchStudentSubjectProgress(studentId))
      .unwrap()
      .finally(() => {
        setSubjectsFetched(true);
      });
  }, [studentId, dispatch]);

  // 2. Fetch semesters when selected child is available
  useEffect(() => {
    const classId = selectedChild?.classId;

    if (classId) {
      dispatch(fetchSemestersByClass({ classId }));
    }
  }, [dispatch, selectedChild]);

  // 3. Auto-fetch modules for the first subject
  useEffect(() => {
    if (studentSubjectProgress && studentSubjectProgress.length > 0) {
      const firstSubjectId = studentSubjectProgress[0].subjectId;
      setSelectedSubjectId(firstSubjectId);

      setModuleLoading(true);
      dispatch(fetchCourseProgress({ studentId, subjectId: firstSubjectId }))
        .unwrap()
        .finally(() => setModuleLoading(false));
    }
  }, [studentSubjectProgress, studentId, dispatch]);

  // 4. Handler when user selects a subject
  const handleSubjectClick = (subjectId) => {
    setSelectedSubjectId(subjectId);
    setModuleLoading(true);
    dispatch(fetchCourseProgress({ studentId, subjectId }))
      .unwrap()
      .finally(() => setModuleLoading(false));
  };

  // 5. Handler for selecting a semester from the modal
  const handleSemesterSelect = (sem) => {
    dispatch(setSelectedSemester({ id: sem._id, title: sem.title }));
    setSemesterModalVisible(false);
  };

  // ========== RENDER LOGIC ==========
  if (!subjectsFetched) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center">
        <SubjectCardSkeleton />
      </div>
    );
  }

  if (error) {
    const errorMessage =
      typeof error === "object" ? error.message || JSON.stringify(error) : error;
    return (
      <div className="flex w-full h-full text-gray-500 items-center justify-center flex-col text-xl">
        <GoAlertFill className="text-[3rem]" />
        {errorMessage}
      </div>
    );
  }

  return (
    <Layout title="Subject Progress | Parent">
      <div className="w-full">
        <div className="pb-2 flex w-full flex-row">
          {/* LEFT: Subject Cards */}
          <div className="flex flex-col gap-2 p-4 w-[25%] border-gray-300 border-r">
            {/* Semester Button */}
            <Button
              type="default"
              onClick={() => setSemesterModalVisible(true)}
              className="w-full mb-3 border border-pink-400 bg-white text-black rounded-lg font-semibold text-sm 
                       hover:bg-pink-400 hover:text-pink-900 transition-colors duration-200"
            >
              {selectedSemester?.title ? selectedSemester.title : "Select Semester"}
            </Button>

            {/* Subject Cards */}
            {studentSubjectProgress?.length > 0 ? (
              studentSubjectProgress.map((subject) => (
                <div
                  key={subject.subjectId}
                  className={`w-[260px] transition-all duration-300 transform ${subject.subjectId === selectedSubjectId
                    ? "scale-105"
                    : "bg-white shadow-md rounded-lg"
                    }`}
                  onClick={() => handleSubjectClick(subject.subjectId)}
                >
                  <SubjectCard subject={subject} />
                </div>
              ))
            ) : (
              <div className="flex w-full h-full text-gray-500 items-center justify-center flex-col text-xl">
                <GoAlertFill className="text-[3rem]" />
                No Data Found
              </div>
            )}
          </div>

          {/* RIGHT: Modules & Chapters */}
          <div className="w-[75%]">
            <MainSection
              selectedSubjectId={selectedSubjectId}
              studentId={studentId}
              moduleLoading={moduleLoading}
            />
          </div>
        </div>

        {/* SEMESTER SELECTION MODAL */}
        <Modal
          visible={semesterModalVisible}
          onCancel={() => setSemesterModalVisible(false)}
          footer={null}
          title="Select Semester"
          bodyStyle={{ padding: "1rem" }}
          destroyOnClose
        >
          {loadingSemesters ? (
            <div className="flex justify-center items-center">
              <span>Loading semesters...</span>
            </div>
          ) : errorSemesters ? (
            <div className="text-red-500 text-center">
              Failed to load semesters. Please try again.
            </div>
          ) : (
            <div className="space-y-2">
              {semesters && semesters.length > 0 ? (
                semesters.map((sem) => (
                  <Button
                    key={sem._id}
                    onClick={() => handleSemesterSelect(sem)}
                    className={`w-full text-left border rounded-md transition-colors duration-200 ${selectedSemester?.id === sem._id
                      ? "bg-purple-100 border-purple-400"
                      : "bg-white hover:bg-purple-50"
                      }`}
                  >
                    {sem.title}
                  </Button>
                ))
              ) : (
                <p className="text-center">No semesters available.</p>
              )}
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
};

export default AllSubject;
