import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import NavIconCard from "./Components/NavIconCard";
import ButtonGroup from "./Components/ButtonGroup";
import SubjectCard from "./SubjectCard";
import Sidebar from "../../../../Components/Common/Sidebar";
import AddNewSubject from "./AddNewSubject";
import { useParams } from "react-router-dom";
import { FaSchool } from "react-icons/fa";
import { SlEyeglass } from "react-icons/sl";
import { FcGraduationCap, FcCalendar } from "react-icons/fc";
import NoDataFound from "../../../../Components/Common/NoDataFound";
import Spinner from "../../../../Components/Common/Spinner";
import { fetchClassDetails } from "../../../../Store/Slices/Admin/Class/actions/classThunk";
import { useTranslation } from "react-i18next";

const colors = [
  "bg-yellow-300",
  "bg-blue-300",
  "bg-green-300",
  "bg-red-300",
  "bg-purple-300",
  "bg-pink-300",
];

const getColor = (index) => {
  return colors[index % colors.length];
};

const MainSection = () => {
  const { t } = useTranslation("admClass");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(t("Published"));
  const [editSubject, setEditSubject] = useState(null);
  const classDetails = useSelector((store) => store.admin.class.classDetails);
  const role = useSelector((store) => store.common.auth.role);
  const loading = useSelector((store) => store.admin.class.loading);

  const dispatch = useDispatch();
  const { cid } = useParams();

  useEffect(() => {
    dispatch(fetchClassDetails(cid));
  }, [dispatch, cid]);

  const staticIconData = [
    {
      icon: <SlEyeglass className="text-purple-600" />,
      text: "",
      url: `/class/${cid}/teachers`,
    },
    {
      icon: <FaSchool className="text-yellow-600" />,
      text: "",
      url: `/class/${cid}/section_group`,
    },
    { icon: <FcGraduationCap />, text: "", url: `/class/${cid}/students` },
    {
      icon: <FcCalendar />,
      text: t("Attendance"),
      url: `/class/${cid}/attendance`,
    },
  ];

  if (classDetails) {
    staticIconData[0].text = t("Instructor Assigned", {
      count: classDetails?.teachersIds?.length || 0,
    });
    staticIconData[1].text = t("Sections and Groups", {
      sections: classDetails?.sections?.length || 0,
      groups: classDetails?.groups?.length || 0,
    });
    staticIconData[2].text = t("Students", {
      count: classDetails?.studentsIds?.length || 0,
    });
  }

  const handleAddNewSubject = () => {
    setEditSubject(null);
    setIsSidebarOpen(true);
  };

  const handleEditSubject = (subject) => {
    setEditSubject(subject);
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const filteredSubjects =
    classDetails && classDetails.subjects
      ? classDetails.subjects.filter((subject) =>
          selectedTab === t("Published")
            ? subject.isPublished
            : !subject.isPublished
        )
      : [];

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="flex flex-wrap justify-center gap-3 p-4">
            {staticIconData?.map((item, index) => (
              <NavIconCard
                key={index}
                icon={item.icon}
                text={item.text}
                url={item.url}
              />
            ))}
          </div>
          <div className="px-5">
            <ButtonGroup
              role={role}
              onAddNewSubject={handleAddNewSubject}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
            <div className="grid grid-cols-3 gap-4 mb-10">
              {filteredSubjects.length > 0 ? (
                filteredSubjects.map((subject, index) => (
                  <SubjectCard
                    role={role}
                    key={index}
                    data={{
                      ...subject,
                      teacherName: subject.teacherId
                        ? subject.teacherId.fullName
                        : t("No Instructor Assigned"),
                      teacherImage: subject.teacherId?.profile,
                      teacherRole: subject.teacherId?.role || t("Teacher"),
                    }}
                    Class={cid}
                    subjectId={subject._id}
                    backgroundColor={getColor(index)}
                    onEdit={handleEditSubject}
                  />
                ))
              ) : (
                <p className="col-span-3 text-center text-gray-500">
                  <NoDataFound title={t("Subject")} />
                </p>
              )}
            </div>
          </div>
        </>
      )}
      <Sidebar
        title={editSubject ? t("Edit Subject") : t("Add New Subject")}
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
      >
        <AddNewSubject subject={editSubject} onClose={handleCloseSidebar} />
      </Sidebar>
    </>
  );
};

export default MainSection;
