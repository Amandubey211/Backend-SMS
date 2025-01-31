

import React from "react";
import InformationSection from "./subComponents/InformationSection";
import ParentInformation from "./subComponents/ParentInformation";
import StudentProfile from "./subComponents/StudentProfile";
import ProtectedSection from "../../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../../config/permission";

const StudentInformationMenu = ({ student }) => (
  <>
  
    <div className="flex flex-col w-full">
    
      <div className="border-b border-gray-300 p-3">
        <InformationSection student={student} />
      </div>

      <div className="flex ">
        <ParentInformation parents={student} />
        <div className="w-[50%] ">
          <StudentProfile student={student} />
        </div>
      </div>   
     
    </div>
 
  </>
);

export default StudentInformationMenu;
