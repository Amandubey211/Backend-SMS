

import React from "react";
import InformationSection from "./subComponents/InformationSection";
import ParentInformation from "./subComponents/ParentInformation";
import StudentProfile from "./subComponents/StudentProfile";

const StudentInformationMenu = ({ student }) => (
  <>
    <div className="flex flex-col w-full">
      <div className="border-b border-gray-300 p-3">
        <InformationSection student={student} />
      </div>

      <div className="flex ">
        <ParentInformation parents={student.information.parents} />
        <div className="w-[70%] bg-sky-300">
          <StudentProfile student={student} />
        </div>
      </div>
    </div>
  </>
);

export default StudentInformationMenu;
