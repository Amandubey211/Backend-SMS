import React from "react";
import teachers from "./DummyData/DummyData";
import TeacherCard from "./TeacherCard";
import NavigationBar from "./NavigationBar ";

const MainSection = () => {
  return (
    <>
      <div>
        <NavigationBar />
      </div>
      <div className="flex flex-wrap justify-center">
        {teachers.map((teacher, index) => (
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
