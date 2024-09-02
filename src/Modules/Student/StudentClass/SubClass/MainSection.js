import React, { useMemo } from "react";
import NavIconCard from "./Components/NavIconCard";
import SubjectCard from "./SubjectCard";
import { FaSchool } from "react-icons/fa";
import { SlEyeglass } from "react-icons/sl";
import { FcGraduationCap, FcCalendar } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import useFetchClassData from "../../../../Hooks/AuthHooks/Student/ClassHook/useFetchClassData";
import {
  setSelectedSubject,
  setSelectedSubjectName,
} from "../../../../Redux/Slices/Common/CommonSlice";
import Spinner from "../../../../Components/Common/Spinner";
import NoDataFound from "../../../../Components/Common/NoDataFound";
import { FaExclamationTriangle } from "react-icons/fa";
const colors = [
  "bg-yellow-300",
  "bg-blue-300",
  "bg-green-300",
  "bg-red-300",
  "bg-purple-300",
  "bg-pink-300",
];

const getColor = (index) => colors[index % colors.length];

const MainSection = () => {
  const { classData, loading, error } = useFetchClassData();
  const dispatch = useDispatch();

  const handleSubjectClick = ({ subjectId, subjectName }) => {
    dispatch(setSelectedSubject(subjectId));
    dispatch(setSelectedSubjectName(subjectName));
  };

  const iconData = useMemo(
    () =>
      classData && [
        {
          icon: <SlEyeglass className="text-purple-600" />,
          text: `My Class Teacher (${classData.teachersCount})`,
          url: `/student_class/${classData.classId}/teachers`,
        },
        {
          icon: <FaSchool className="text-yellow-600" />,
          text: `${classData.section?.sectionName || "No Section"} - ${
            classData.groups[0].groupName
          }`,
        },
        {
          icon: <FcGraduationCap />,
          text: `My Classmates (${classData.classmatesCount}) `,
          url: `/student_class/${classData.classId}/classmates`,
        },
        {
          icon: <FcCalendar />,
          text: "My Attendance",
          url: `/student_class/${classData.classId}/attendance`,
        },
      ],
    [classData]
  );

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      // <div className="flex flex-col items-center justify-center h-screen">
      //   <h1 className="text-3xl text-red-500">{error}</h1>
      // </div>

      <div className="flex flex-col items-center justify-center h-screen ">
      <div className="flex flex-col items-center bg-white shadow-lg p-10 rounded-lg">
        <FaExclamationTriangle className="text-red-500 text-6xl mb-4" />
        {/* <h1 className="text-2xl font-semibold text-red-600 mb-2">
          Oops! Something Went Wrong
        </h1> */}
        <p className="text-lg text-gray-700 text-center">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition duration-300"
        >
          Try Again
        </button>
      </div>
    </div>


    );
  }

  return (
    <>
      <div className="flex flex-wrap justify-center gap-3 p-4">
        {iconData?.map((item, index) => (
          <NavIconCard
            key={index}
            icon={item.icon}
            text={item.text}
            url={item.url}
          />
        ))}
      </div>
      <div className="px-5">
        {classData.subjects.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {classData.subjects.map((subject, index) => (
              <SubjectCard
                key={index}
                data={subject}
                classId={classData.classId}
                onSubjectClick={handleSubjectClick}
                backgroundColor={getColor(index)}
              />
            ))}
          </div>
        ) : (
          <NoDataFound title="Subjects" />
        )}
      </div>
    </>
  );
};

export default MainSection;
