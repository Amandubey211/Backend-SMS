import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GoAlertFill } from "react-icons/go";
import SubjectCard from "../../Admin/UsersProfiles/StudentProfile/Components/StudentCourseProgress/allSubjects/SubjectCard";
import MainSection from "./MainSection.js";
import { SubjectCardSkeleton } from "../Skeletons.js";
import { fetchCourseProgress, fetchStudentSubjectProgress } from "../../../Store/Slices/Admin/Users/Students/student.action.js";
import { useParams } from "react-router-dom";

const AllSubject = () => {
  const { studentId } = useParams();
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [subjectsFetched, setSubjectsFetched] = useState(false);

  var { studentSubjectProgress, courseProgress, loading, error } = useSelector(
    (store) => store.admin.all_students
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchStudentSubjectProgress(studentId))
      .unwrap()
      .finally(() => {
        setSubjectsFetched(true);
      });
  }, [studentId, dispatch]);

  useEffect(() => {
    if (studentSubjectProgress && studentSubjectProgress.length > 0) {
      const firstSubjectId = studentSubjectProgress[0].subjectId;
      setSelectedSubjectId(firstSubjectId);
      dispatch(fetchCourseProgress({ studentId, subjectId: firstSubjectId }));
    }
  }, [studentSubjectProgress, studentId, dispatch]);

  const fetchModule = (id) => {
    setSelectedSubjectId(id);
    dispatch(fetchCourseProgress({ studentId, subjectId: id }));
  };

  if (!subjectsFetched || loading) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center">
        <SubjectCardSkeleton />
      </div>
    );
  }

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

  loading = true;
  return (
    <div className="w-full">
      <div className="pb-2 flex w-full flex-row">
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
                onClick={() => fetchModule(subject.subjectId)}
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
        <div className="w-[75%]">
          <MainSection
            selectedSubjectId={selectedSubjectId}
            studentId={studentId}
          />
        </div>
      </div>
    </div>
  );
};

export default AllSubject;
