import React, { useState } from "react";
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
  const { cid } = useParams();
  const classDetails = useSelector((store) => store.Class.class);

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
    staticIconData[0].text = `${classDetails?.teachersIds?.length || 0} Teacher Assigned`;
    staticIconData[1].text = `${classDetails?.sections?.length || 0} Section | ${classDetails?.groups?.length || 0} Groups`;
    staticIconData[2].text = `${classDetails?.studentsIds?.length || 0} Students`;
  }

  const handleAddNewSubject = () => {
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <div className="flex flex-wrap justify-center gap-3 p-4 ">
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
        <ButtonGroup onAddNewSubject={handleAddNewSubject} />
        <div className="grid grid-cols-3 gap-4 mb-10">
          {classDetails && classDetails.subjects && classDetails.subjects.length > 0 ? (
            classDetails.subjects.map((subject, index) => (
              <SubjectCard
                key={index}
                data={subject}
                Class={cid}
                backgroundColor={getColor(index)}
              />
            ))
          ) : (
            <p className="col-span-3 text-center text-gray-500">
              No subjects available.
            </p>
          )}
        </div>
      </div>
      <Sidebar
        title="Add New Subject"
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
      >
        <AddNewSubject />
      </Sidebar>
    </>
  );
};

export default MainSection;
