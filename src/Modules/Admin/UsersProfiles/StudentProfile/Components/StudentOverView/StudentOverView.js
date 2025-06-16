import React, { useEffect } from "react";
import AttendanceGraph from "./AttendanceGraph";
import StudentGradePieChart from "./StudentGradePieChart";
import TaskChart from "./TaskChart";
import AllSubjects from "../StudentCourseProgress/allSubjects/AllSubjects";
import { useTranslation } from "react-i18next";
import ProtectedSection from "../../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../../config/permission";

const StudentOverView = ({ student }) => {
  const { t } = useTranslation("admAccounts");
  return (
    <div className="flex flex-col">
      <ProtectedSection
        requiredPermission={PERMISSIONS.GET_COURSE_PROGRESS}
        title={"Subjects"}
      >
        <div className="pl-2">
          <AllSubjects student={student} />
        </div>
      </ProtectedSection>

      <div className="mt-4 w-full h-96 flex flex-col justify-center items-center border-t-2">
        <h1 className="mb-4 mt-4 font-bold">{t("Attendance")}</h1>
        <ProtectedSection
          requiredPermission={PERMISSIONS.GET_YEARLY_ATTENDEC}
          title={"Attendance Graph"}
        >
          <div className="w-full h-[95%] flex justify-center items-center">
            <AttendanceGraph cid={student?._id} />
          </div>
        </ProtectedSection>
      </div>

      <div className="flex w-full border-t-2 justify-between">
        <ProtectedSection
          requiredPermission={PERMISSIONS.GET_COURSE_PROGRESS}
          title={"Grades Chart"}
        >
          <div className="w-[full] h-[20rem] flex flex-col items-center mt-4">
            <p className="font-bold text-gray-500">{t("Student Grade")}</p>
            <div className="w-full h-[18rem]">
              <StudentGradePieChart />
            </div>
          </div>
        </ProtectedSection>

        <ProtectedSection
          requiredPermission={PERMISSIONS.GET_STUDENT_TASK}
          title={"Task Chart"}
        >
          <div className="w-[full] h-[20rem] flex flex-col items-center mt-4">
            <p className="font-bold text-gray-500">{t("Task")}</p>
            <div className="w-full h-[18rem]">
              <TaskChart />
            </div>
          </div>
        </ProtectedSection>
      </div>
    </div>
  );
};

export default StudentOverView;