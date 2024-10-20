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
import { setShowError } from "../../../../Store/Slices/Common/Alerts/alertsSlice";
import OfflineModal from "../../../../Components/Common/Offline";
import { stdSubjectProgressPercentage } from "../../../../Store/Slices/Student/MyClass/Class/Subjects/subject.action";
import SidebarSlide from "../../../../Components/Common/SidebarSlide";

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
  const { classData, loading, error } = useSelector(
    (store) => store?.student?.studentClass
  );
  const { showError } = useSelector((store) => store?.common?.alertMsg);

  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);
  const { subjectProgress } = useSelector(
    (store) => store?.student?.studentSubject
  );
  const iconData = classData && [
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
            return `${classData?.section?.sectionName} | (${classData?.groups?.length}) Group`;
          } else {
            return `${classData?.section?.sectionName} | 0 Group`;
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
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false); // Hide the modal
  };

  // const handleSubjectClick = ({ subjectId, subjectName }) => {
  //   console.log("Subject Clicked!")
  //   dispatch(setSelectedSubject(subjectId));
  //   dispatch(setSelectedSubjectName(subjectName));
  // };

  const handleDismiss = () => {
    dispatch(setShowError(false));
  };

  useEffect(() => {
    dispatch(stdClass());
    dispatch(stdSubjectProgressPercentage());
  }, [dispatch]);

  console.log("std class data : ", classData);
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
          My Subjects ({classData?.subjects?.length || 0})
        </h1>

        {loading ? (
          <div className="w-full  flex flex-col items-center justify-center py-20">
            <Spinner />
          </div>
        ) : !loading &&
          (Object.keys(classData).length === 0 ||
            classData?.subjects?.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-20">
            <NoDataFound title="Subject" />
          </div>
        ) : (
          <div>
            {classData?.subjects?.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-5 h-full">
                {classData?.subjects?.map((subject, index) => (
                  <SubjectCard
                    key={index}
                    data={subject}
                    classId={classData?.classId}
                    // onSubjectClick={handleSubjectClick}
                    backgroundColor={getColor(index)}
                    currentProgress={subjectProgress?.find(
                      (el) => el?.subjectId === subject?.subjectId
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {!loading && showError && (
        <OfflineModal error={error} onDismiss={handleDismiss} />
      )}

      {/* Modal for Section and group*/}
      {modalData && (
        <SidebarSlide
          isOpen={isModalVisible}
          onClose={handleModalClose}
          title={
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
              Sections & groups
            </span>
          }
          width="30%"
          height="100%"
        >
          <SectionGroupModal modalData={modalData} />
        </SidebarSlide>
      )}
    </>
  );
};
export default MainSection;
