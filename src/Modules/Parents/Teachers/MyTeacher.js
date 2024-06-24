import React from "react";
import ChildCard from "../../../Components/Parents/Children/ChildCard";
import {teachers} from "../../../Modules/Parents/Teachers/TeachersData/TeachersData"
import TeacherCards from "../../../Components/Parents/Teachers/TeacherCard";
const MyTeacher = () => {
  return (
    <div className="h-full  w-full">
      <div className=" w-full p-2">
      <div className=" flex-wrap   flex items-start">
            {teachers.map(teacher => (
                <TeacherCards key={teacher.id} teacher={teacher} />
            ))}
        </div>
       
      </div>
    </div>
  );
};
export default MyTeacher;
