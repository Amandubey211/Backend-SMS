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
import { Button, Modal } from "antd";
import { fetchSemestersByClass } from "../../../Store/Slices/Parent/Semesters/parentSemester.action";
import { setSelectedSemester } from "../../../Store/Slices/Parent/Semesters/parentSemesterSlice.js";
import Layout from "../../../Components/Common/Layout.js";
import { FaChevronDown, FaRegSadTear } from "react-icons/fa";
import { BsFillJournalBookmarkFill } from "react-icons/bs";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading .js";

const AllSubject = () => {
  const { cid, studentId } = useParams();

  const dispatch = useDispatch();
  useNavHeading("My Child", "Courses & Progress");
  const [subjectsFetched, setSubjectsFetched] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [moduleLoading, setModuleLoading] = useState(false);

  // Semester modal state
  const [semesterModalVisible, setSemesterModalVisible] = useState(false);

  // Redux store data (admin side for subject progress)
  const { studentSubjectProgress, error } = useSelector(
    (store) => store?.admin?.all_students
  );

  // Redux store data (parent side for semesters)
  const { semesters, selectedSemester, loadingSemesters, errorSemesters } =
    useSelector((store) => store?.Parent?.semesters);
  // console.log("semesters iiii: ", selectedSemester);

  const semesterId = selectedSemester?._id;
  // Get selected child from Redux
  const selectedChild = useSelector(
    (state) => state.Parent.children.selectedChild
  );


  // 2. Fetch semesters when selected child is available
  useEffect(() => {
    // const classId = selectedChild?.classId || null;
    // console.log("class id is :->", classId);
    dispatch(fetchSemestersByClass({ classId: cid }));
  }, [dispatch]);

  // 1. Fetch the student's subjects
  useEffect(() => {
    dispatch(
      fetchStudentSubjectProgress(studentId)
    ).unwrap()
      .finally(() => {
        setSubjectsFetched(true);
      });
  }, [dispatch, studentId]);

  // 3. Auto-fetch modules for the first subject (if available)
  useEffect(() => {
    if (studentSubjectProgress && studentSubjectProgress.length > 0) {
      const firstSubjectId = studentSubjectProgress[0].subjectId;
      setSelectedSubjectId(firstSubjectId);

      setModuleLoading(true);
      dispatch(
        fetchCourseProgress({
          studentId,
          subjectId: firstSubjectId,
          semesterId,
        })
      ).unwrap()
        .finally(() => setModuleLoading(false));
    }
  }, [dispatch, studentSubjectProgress, studentId, selectedSemester]);

  // 4. Handler when user selects a subject
  const handleSubjectClick = (subjectId) => {
    setSelectedSubjectId(subjectId);
    setModuleLoading(true);
    dispatch(fetchCourseProgress({ studentId, subjectId, semesterId }))
      .unwrap()
      .finally(() => setModuleLoading(false));
  };

  // 5. Handler for selecting a semester from the modal
  const handleSemesterSelect = (sem) => {
    dispatch(setSelectedSemester({ _id: sem._id, title: sem?.title }));
    setSemesterModalVisible(false);
  };

  // ========== RENDER LOGIC ==========

  // While fetching subjects, show skeleton
  if (!subjectsFetched) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center">
        <SubjectCardSkeleton />
      </div>
    );
  }

  // If there was an error fetching subjects, show error message
  if (error) {
    const errorMessage =
      typeof error === "object"
        ? error.message || JSON.stringify(error)
        : error;
    return (
      <div className="flex w-full h-full text-gray-500 items-center justify-center flex-col text-xl">
        <GoAlertFill className="text-[3rem]" />
        {errorMessage}
      </div>
    );
  }

  // If no subjects exist, show full-panel "No Subjects Found" view
  if (!studentSubjectProgress || studentSubjectProgress.length === 0) {
    return (
      <Layout title="Parents | Child Courses & Progress">
        <div className="w-full h-[80vh] flex flex-col items-center justify-center text-gray-500">
          <BsFillJournalBookmarkFill className="text-6xl mb-4" />
          <p className="text-2xl font-bold">No subjects found.</p>
          <p>Please check back later.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Parents | Child Courses & Progress">
      <div className="w-full">
        <div className="flex w-full flex-row">
          {/* LEFT: Subject Cards */}
          <div className="flex flex-col gap-2 p-2 w-[25%] border-r border-gray-300 min-h-[100vh]">
            {/* Semester Button */}
            <Button
              type="default"
              onClick={() => setSemesterModalVisible(true)}
              className="w-full border border-pink-400 bg-white text-black rounded-md font-semibold text-sm mt-2 mb-1
                         hover:bg-pink-400 hover:text-pink-900 transition-colors duration-200 flex items-center justify-between"
            >
              <span>
                {selectedSemester?.title
                  ? selectedSemester?.title
                  : "Select Semester"}
              </span>
              <FaChevronDown className="ml-2" />
            </Button>

            {/* Subject Cards */}
            {studentSubjectProgress?.map((subject) => (
              <div
                key={subject.subjectId}
                onClick={() => handleSubjectClick(subject.subjectId)}
                className={`
                    bg-white
                    rounded-lg
                    cursor-pointer
                    duration-200
                    ${subject.subjectId === selectedSubjectId
                    ? "border-2 border-red-500"
                    : "border border-gray-200 hover:shadow-sm"
                  }
                  `}
              >
                <SubjectCard subject={subject} />
              </div>
            ))}
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
                semesters?.map((sem) => (
                  <Button
                    key={sem._id}
                    onClick={() => handleSemesterSelect(sem)}
                    className={`w-full text-left border rounded-md transition-colors duration-200 ${selectedSemester._id == sem._id
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
