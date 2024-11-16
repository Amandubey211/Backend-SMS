import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GoAlertFill } from "react-icons/go";
import SubjectCard from "../../Admin/UsersProfiles/StudentProfile/Components/StudentCourseProgress/allSubjects/SubjectCard";
import MainSection from "./MainSection.js";
import Spinner from "../../../Components/Common/Spinner";
import { fetchCourseProgress, fetchStudentSubjectProgress } from "../../../Store/Slices/Admin/Users/Students/student.action.js";
import { useParams } from "react-router-dom";

const AllSubject = () => {
  const { studentId } = useParams();
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const { studentSubjectProgress } = useSelector(
    (store) => store.admin.all_students
  );
  const { courseProgress, loading, error } = useSelector(
    (store) => store.admin.all_students
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchStudentSubjectProgress(studentId))
  }, [ studentId]);

 
  useEffect(() => {
    dispatch(fetchCourseProgress({ studentId, subjectId:studentSubjectProgress[0]?.subjectId }))
    if (studentSubjectProgress?.length > 0) {
      setSelectedSubjectId(studentSubjectProgress[0]?.subjectId || null);
    }
  }, [studentSubjectProgress]);
  const fetchModule = async(id)=>{
    setSelectedSubjectId(id)
    dispatch(fetchCourseProgress({ studentId, subjectId:id }));
  }

  return (
    <>
      {loading ? (
        <div className="w-full h-[50vh] flex items-center justify-center">
          <Spinner />
        </div>
      ) : error ? (
        <div className="flex w-full h-full text-gray-500 items-center justify-center flex-col text-xl">
          <GoAlertFill className="text-[3rem]" />
          {error}
        </div>
      ) : (
        <div className="py-2 w-full">
          <div className="pb-2 flex w-full flex-row">
            <div className="flex flex-col gap-2 p-4 w-[25%] border-gray-300 border-r">
              {/* Safeguard against null/undefined and map subjects */}
              {studentSubjectProgress?.length > 0 ? (
                studentSubjectProgress.map((subject, index) => (
                  <div
                    key={index}
                    className={`w-[260px] transition-all duration-300 transform ${
                      subject.subjectId === selectedSubjectId
                        ? "scale-105"
                        : "bg-white shadow-md rounded-lg"
                    }`}
                    onClick={() => fetchModule(subject.subjectId)}
                  >
                    <SubjectCard subject={subject} i={index} />
                  </div>
                ))
              ) : (
                <div className="flex w-full h-full text-gray-500 items-center justify-center flex-col text-xl">
                  <GoAlertFill className="text-[3rem]" />
                  No Data Found
                </div>
              )}
            </div>
            <div className="border-t-2 w-[75%]">
              <MainSection
                selectedSubjectId={selectedSubjectId}
                studentId={studentId}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AllSubject;
