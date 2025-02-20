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

const AllSubject = () => {
  const { studentId } = useParams();
  const dispatch = useDispatch();

  // Local state to track if subjects are loaded
  const [subjectsFetched, setSubjectsFetched] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);

  // Separate local state for module loading
  const [moduleLoading, setModuleLoading] = useState(false);

  // Redux store data
  const {
    studentSubjectProgress, // array of subjects
    // courseProgress, // not needed here if only used in MainSection
    loading, // this is the global loading - we won't rely on it for subject cards
    error,
  } = useSelector((store) => store.admin.all_students);

  // Fetch all subjects once
  useEffect(() => {
    dispatch(fetchStudentSubjectProgress(studentId))
      .unwrap()
      .finally(() => {
        setSubjectsFetched(true);
      });
  }, [studentId, dispatch]);

  // Automatically fetch modules for the first subject
  useEffect(() => {
    if (studentSubjectProgress && studentSubjectProgress.length > 0) {
      const firstSubjectId = studentSubjectProgress[0].subjectId;
      setSelectedSubjectId(firstSubjectId);

      // fetch modules for the first subject
      setModuleLoading(true);
      dispatch(fetchCourseProgress({ studentId, subjectId: firstSubjectId }))
        .unwrap()
        .finally(() => setModuleLoading(false));
    }
  }, [studentSubjectProgress, studentId, dispatch]);

  // Handler when user selects a subject card
  const handleSubjectClick = (subjectId) => {
    setSelectedSubjectId(subjectId);
    setModuleLoading(true);

    // fetch modules for the selected subject
    dispatch(fetchCourseProgress({ studentId, subjectId }))
      .unwrap()
      .finally(() => setModuleLoading(false));
  };

  // Show skeleton only while subjects are being fetched
  if (!subjectsFetched) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center">
        <SubjectCardSkeleton />
      </div>
    );
  }

  // Show error if subject fetch failed
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

  // Render the layout
  return (
    <div className="w-full">
      <div className="pb-2 flex w-full flex-row">
        {/* Left side: subject cards */}
        <div className="flex flex-col gap-2 p-4 w-[25%] border-gray-300 border-r">
          {studentSubjectProgress?.length > 0 ? (
            studentSubjectProgress.map((subject) => (
              <div
                key={subject.subjectId}
                className={`w-[260px] transition-all duration-300 transform ${
                  subject.subjectId === selectedSubjectId
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

        {/* Right side: modules and chapters */}
        <div className="w-[75%]">
          <MainSection
            selectedSubjectId={selectedSubjectId}
            studentId={studentId}
            moduleLoading={moduleLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default AllSubject;
