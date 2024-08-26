import React, { useState, useEffect } from "react";
import NavIconCard from "./Components/NavIconCard";
import ButtonGroup from "./Components/ButtonGroup";
import SubjectCard from "./SubjectCard";
import Sidebar from "../../../../Components/Common/Sidebar";
import AddNewSubject from "./AddNewSubject";
import { useParams } from "react-router-dom";
import { FaSchool } from "react-icons/fa";
import { SlEyeglass } from "react-icons/sl";
import { FcGraduationCap, FcCalendar } from "react-icons/fc";
import { useSelector } from "react-redux";
import useGetClassDetails from "../../../../Hooks/AuthHooks/Staff/Admin/Class/usegetClassDetails";
import NoDataFound from "../../../../Components/Common/NoDataFound";
import Spinner from "../../../../Components/Common/Spinner";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Published");
  const [editSubject, setEditSubject] = useState(null); // New state for editing
  const classDetails = useSelector((store) => store.Class.class);
  const role = useSelector((store) => store.Auth.role);

  const { fetchClassDetails, loading } = useGetClassDetails();
  const { cid } = useParams();

  useEffect(() => {
    fetchClassDetails(cid);
  }, [fetchClassDetails, cid]);

  // Static icon data
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
      text: "Attendance",
      url: `/class/${cid}/attendance`,
    },
  ];

  // Update static icon data with dynamic details if classDetails is available
  if (classDetails) {
    staticIconData[0].text = `${
      classDetails?.teachersIds?.length || 0
    } Instructor Assigned`;
    staticIconData[1].text = `${
      classDetails?.sections?.length || 0
    } Section | ${classDetails?.groups?.length || 0} Groups`;
    staticIconData[2].text = `${
      classDetails?.studentsIds?.length || 0
    } Students`;
  }

  const handleAddNewSubject = () => {
    setEditSubject(null); // Reset edit state when adding a new subject
    setIsSidebarOpen(true);
  };

  const handleEditSubject = (subject) => {
    setEditSubject(subject); // Set the subject to be edited
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const filteredSubjects =
    classDetails && classDetails.subjects
      ? classDetails.subjects.filter((subject) =>
          selectedTab === "Published"
            ? subject.isPublished
            : !subject.isPublished
        )
      : [];

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner /> {/* Display Spinner while loading */}
        </div>
      ) : (
        <>
          <div className="flex flex-wrap justify-center gap-3 p-4">
            {staticIconData.map((item, index) => (
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
                        : "No Instructor Assigned",
                      teacherImage: subject.teacherId?.profile,
                      teacherRole: subject.teacherId?.role || "Teacher",
                    }}
                    Class={cid}
                    subjectId={subject._id}
                    backgroundColor={getColor(index)}
                    onEdit={handleEditSubject}
                  />
                ))
              ) : (
                <p className="col-span-3 text-center text-gray-500">
                  <NoDataFound title="Subject" />
                </p>
              )}
            </div>
          </div>
        </>
      )}
      <Sidebar
        title={editSubject ? "Edit Subject" : "Add New Subject"}
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
      >
        <AddNewSubject subject={editSubject} onClose={handleCloseSidebar} />
      </Sidebar>
    </>
  );
};

export default MainSection;
