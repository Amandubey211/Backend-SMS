import React, { useState } from "react";
import teachers from "./DummyData/DummyData";
import TeacherCard from "./TeacherCard";
import NavigationBar from "./NavigationBar ";

const MainSection = () => {
  const [selectedSection, setSelectedSection] = useState("Everyone");

  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  const filteredTeachers = selectedSection === "Everyone"
    ? teachers
    : teachers.filter(teacher => teacher.section === selectedSection);

  return (
    <>
      <div>
        <NavigationBar onSectionChange={handleSectionChange} selectedSection={selectedSection} />
      </div>
      <div className="flex flex-wrap justify-start px-4 items-center">
        {filteredTeachers.map((teacher, index) => (
          <TeacherCard
            key={index}
            name={teacher.name}
            role={teacher.role}
            phone={teacher.phone}
            image={teacher.image}
          />
        ))}
      </div>
    </>
  );
};

export default MainSection;
