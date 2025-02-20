import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GoAlertFill } from "react-icons/go";
import SubjectCard from "../../Admin/UsersProfiles/StudentProfile/Components/StudentCourseProgress/allSubjects/SubjectCard";
import MainSection from "./MainSection.js";
import Spinner from "../../../Components/Common/Spinner";
import { fetchCourseProgress, fetchStudentSubjectProgress } from "../../../Store/Slices/Admin/Users/Students/student.action.js";
import { useParams } from "react-router-dom";
import { Skeleton } from 'antd';

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
  }, [studentId]);


  useEffect(() => {
    dispatch(fetchCourseProgress({ studentId, subjectId: studentSubjectProgress[0]?.subjectId }))
    if (studentSubjectProgress?.length > 0) {
      setSelectedSubjectId(studentSubjectProgress[0]?.subjectId || null);
    }
  }, [studentSubjectProgress]);
  const fetchModule = async (id) => {
    setSelectedSubjectId(id)
    dispatch(fetchCourseProgress({ studentId, subjectId: id }));
  }

  const SubjectCardSkeleton = ({ subjectCount = 5, chapterCount = 3, moduleCount = 2 }) => {
    return (
      <div className="flex py-2 w-full mt-[24rem]">
        {/* Left Sidebar - Subject List */}
        <div className="flex flex-col gap-3 p-4 pt-4 w-[25%] border-gray-300 border-r">
          {Array(subjectCount)
            .fill("")
            .map((_, index) => (
              <div
                key={index}
                className="w-[260px] bg-white rounded-lg shadow-md p-3"
              >
                {/* Top row: icon + subject/date */}
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton.Avatar
                    active
                    size="large"
                    shape="square"
                    style={{ width: "3rem", height: "3rem" }}
                  />
                  <div className="flex flex-col">
                    {/* Subject name placeholder */}
                    <Skeleton.Input
                      active
                      size="small"
                      style={{ width: "120px", marginBottom: "5px" }}
                    />
                    {/* Started date placeholder */}
                    <Skeleton.Input
                      active
                      size="small"
                      style={{ width: "150px" }}
                    />
                  </div>
                </div>

                {/* Progress bar placeholder */}
                <Skeleton.Input
                  active
                  size="small"
                  style={{
                    width: "100%",
                    height: "8px",
                    borderRadius: "4px",
                    marginBottom: "8px"
                  }}
                />

                {/* Bottom row: modules & percentage */}
                <div className="flex justify-between">
                  <Skeleton.Input
                    active
                    size="small"
                    style={{ width: "50px" }}
                  />
                </div>
              </div>
            ))}
        </div>

        {/* Middle Section - Chapters */}
        <div className="w-[50%] p-2">
          <div className="bg-white p-2 rounded-lg">
            {Array(chapterCount)
              .fill("")
              .map((_, index) => (
                <div
                  key={index}
                  className="w-full h-[70px] bg-white rounded-lg shadow-md p-3 flex items-center gap-3 mb-4"
                >
                  {/* Left: Square image placeholder */}
                  <Skeleton.Avatar active shape="square" size="large" />

                  {/* Middle: Two stacked lines */}
                  <div className="flex flex-col flex-1">
                    <Skeleton.Input
                      active
                      size="small"
                      style={{ width: "50%" }} // first line half width
                    />
                    <Skeleton.Input
                      active
                      size="small"
                      style={{ width: "100%", marginTop: "5px" }} // second line full width
                    />
                  </div>

                  {/* Right: Circle placeholder (dropdown icon) */}
                  <Skeleton.Avatar active shape="circle" size="small" />
                </div>
              ))}
          </div>
        </div>

        {/* Right Sidebar - Modules */}
        <div className="w-[25%] p-2 border-l-2">
          <div className="bg-white p-4 rounded-lg">
            {/* Optional heading skeleton (e.g., "Modules") */}


            {/* Render multiple module cards */}
            <div className="grid grid-cols-1 gap-4">
              {Array(moduleCount)
                .fill("")
                .map((_, index) => (
                  <div
                    key={index}
                    className="w-full bg-white rounded-lg shadow-md"
                  >
                    {/* Top image placeholder with horizontal spacing */}
                    <div className="px-3 pt-3">
                      <Skeleton.Image
                        active
                        className="w-full h-[100px] rounded-lg"
                      />
                    </div>

                    {/* Two thin lines below the image, half the container width */}
                    <div className="flex flex-col gap-2 p-3">
                      <Skeleton.Input
                        active
                        size="small"
                        style={{
                          width: "50%",
                          height: "8px",
                          borderRadius: "4px"
                        }}
                      />
                      <Skeleton.Input
                        active
                        size="default"
                        style={{
                          width: "90%",
                          height: "8px",
                          borderRadius: "4px"
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {loading ? (
        <div className="w-full h-[50vh] flex items-center justify-center">
          <SubjectCardSkeleton />
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
                studentSubjectProgress?.map((subject, index) => (
                  <div
                    key={index}
                    className={`w-[260px] transition-all duration-300 transform ${subject.subjectId === selectedSubjectId
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
