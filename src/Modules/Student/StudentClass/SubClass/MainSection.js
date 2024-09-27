import React, { useEffect, useState } from "react";
import NavIconCard from "./Components/NavIconCard";
import { FaSchool } from "react-icons/fa";
import { SlEyeglass } from "react-icons/sl";
import { FcGraduationCap, FcCalendar } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { GoAlertFill } from "react-icons/go";
import {
  setSelectedSubject,
  setSelectedSubjectName,
} from "../../../../Redux/Slices/Common/CommonSlice";
import Spinner from "../../../../Components/Common/Spinner";
import NoDataFound from "../../../../Components/Common/NoDataFound";
import { stdClass } from "../../../../Store/Slices/Student/MyClass/Class/class.action";
import SubjectCard from "./SubjectCard";
import { Modal } from "antd";
import SectionGroupModal from "./Components/Section/SectionModal";
import { NavLink } from "react-router-dom";


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
  const { classData, loading, error } = useSelector((store) => store?.student?.studentClass);
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);
  const iconData =
    classData && [
      {
        icon: <SlEyeglass className="text-purple-600" />,
        text: `My Class Teacher (${classData?.teachersCount || 0})`,
        url: `/student_class/${classData?.classId}/teachers`,
      },
      {
        icon: <FaSchool className="text-yellow-600" />,
        text: (() => {
          if (classData?.section) {
            if (classData?.groups?.length > 0) {
              return `Section: (${classData?.section?.sectionName}) - Group: (${classData?.groups?.length})`;
            } else {
              return `Section: (${classData?.section?.sectionName}) - Group: (0)`;
            }
          } else {
            return "No Section Provided Yet";
          }
        })(),
        onClick: () => {
          !loading && !error && handleSectionClick(classData); // Handle section click to show modal
        },
      },
      {
        icon: <FcGraduationCap />,
        text: `My Classmates (${classData?.classmatesCount || 0}) `,
        url: `/student_class/${classData?.classId}/classmates`,
      },
      {
        icon: <FcCalendar />,
        text: "My Attendance",
        url: `/student_class/${classData?.classId}/attendance`,
      },
    ];


  const handleSectionClick = (section) => {
    setModalData(classData); // Set section data for the modal
    setIsModalVisible(true); // Show the modal
  };


  const handleModalClose = () => {
    setIsModalVisible(false); // Hide the modal
  };

  // const handleSubjectClick = ({ subjectId, subjectName }) => {
  //   console.log("Subject Clicked!")
  //   dispatch(setSelectedSubject(subjectId));
  //   dispatch(setSelectedSubjectName(subjectName));
  // };



  useEffect(() => {
    dispatch(stdClass());
  }, [dispatch])

  console.log("std class data : ", classData)
  return (
    <>
      <div className="flex flex-wrap justify-center gap-3 p-4">
        {iconData?.map((item, index) => (
          <NavIconCard
            key={index}
            icon={item?.icon}
            text={item?.text}
            url={item?.url}
            onClick={item?.onClick} // Trigger onClick for modal if available
            loading={loading}
            error={error}
          />
        ))}
      </div>

      <div className="px-5">
        <h1 className="text-2xl ml-5 mt-5 font-semibold">
          Your Subjects ({classData?.subjects?.length || 0})
        </h1>

        {loading ? (
          <div className="w-full  flex flex-col items-center justify-center py-20">
            <Spinner />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <GoAlertFill className="inline-block w-12 h-12 mb-3" />
            <p className="text-lg font-semibold">{error}</p>
          </div>
        ) : (
          <div>
            {classData?.subjects?.length > 0 ? (
              <div className="grid grid-cols-3 gap-4 mt-5 h-full">
                {classData?.subjects?.map((subject, index) => (
                  <SubjectCard
                    key={index}
                    data={subject}
                    classId={classData?.classId}
                    // onSubjectClick={handleSubjectClick}
                    backgroundColor={getColor(index)}
                  />
                ))}
              </div>
            ) : (
              <div className="w-full  flex flex-col items-center justify-center py-20">
                <NoDataFound title="Subject" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal for Section and group*/}
      {modalData && (<SectionGroupModal
        isModalVisible={isModalVisible}
        modalData={modalData}
        handleModalClose={handleModalClose}
      />)}
    </>
  );
};
export default MainSection;
