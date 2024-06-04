// src/components/MainSection.js
import React, { useState } from "react";
import NavIconCard from "./Components/NavIconCard";
import ButtonGroup from "./Components/ButtonGroup";
import dummyData from "./DummyData/dummyData";
import SubjectCard from "./SubjectCard";
import Sidebar from "../../../../Components/Common/Sidebar";
import AddNewSubject from "./AddNewSubject";
import { useParams } from "react-router-dom";

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
  const iconData = [
    { icon: "👓", text: "20 Teacher Assigned", url: `/class/${cid}/teachers` },
    {
      icon: "🏫",
      text: "3 Section | 11 Groups",
      url: `/class/${cid}/section_group`,
    },
    { icon: "🎓", text: "250 Students", url: `/class/${cid}/students` },
    { icon: "📅", text: "Attendance", url: `/class/${cid}/attendance` },
  ];

  const handleAddNewSubject = () => {
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <div className="flex justify-around p-2 py-4">
        {iconData.map((item, index) => (
          <NavIconCard
            key={index}
            icon={item.icon}
            text={item.text}
            url={item.url}
          />
        ))}
      </div>
      <div className=" px-5">
        <ButtonGroup onAddNewSubject={handleAddNewSubject} />
        <div className="grid grid-cols-3 gap-4">
          {dummyData.map((data, index) => (
            <SubjectCard
              key={index}
              data={data}
              Class={cid}
              backgroundColor={getColor(index)}
            />
          ))}
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
