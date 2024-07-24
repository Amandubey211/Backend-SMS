// MainSection.js
import React, { useMemo } from "react";
import NavIconCard from "./Components/NavIconCard";
import SubjectCard from "./SubjectCard";
import { useParams } from "react-router-dom";
import { FaSchool, FaSpinner } from "react-icons/fa";
import { SlEyeglass } from "react-icons/sl";
import { FcGraduationCap, FcCalendar } from "react-icons/fc";
import { useDispatch } from "react-redux";
import useFetchClassData from "../../../../Hooks/AuthHooks/Student/ClassHook/useFetchClassData";
import {
  setSelectedSubject,
  setSelectedSubjectName,
} from "../../../../Redux/Slices/Common/CommonSlice";
import Spinner from "../../../../Components/Common/Spinner";
import Fallback from "../../../../Components/Common/Fallback";

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
  const { cid } = useParams();
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
          url: `/student_class/class/${cid}/teachers`,
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
          url: `/student_class/class/${cid}/classmates`,
        },
        {
          icon: <FcCalendar />,
          text: "My Attendance",
          url: `/student_class/class/${cid}/attendance`,
        },
      ],
    [classData, cid]
  );

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        {/* <Spinner /> */}
        <Fallback/>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl text-red-500">{error}</h1>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap justify-center gap-3 p-4">
        {iconData.map((item, index) => (
          <NavIconCard
            key={index}
            icon={item.icon}
            text={item.text}
            url={item.url}
          />
        ))}
      </div>
      <div className="px-5">
        <div className="grid grid-cols-3 gap-4">
          {classData.subjects.map((subject, index) => (
            <SubjectCard
              key={index}
              data={subject}
              IDs={classData}
              Class={cid}
              onSubjectClick={handleSubjectClick}
              backgroundColor={getColor(index)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default MainSection;
