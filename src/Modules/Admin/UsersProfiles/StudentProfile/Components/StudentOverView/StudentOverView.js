import React from "react";
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
    <div className="flex flex-col p-2">
      {/* ─── Subjects Strip ─────────────────────────────────── */}
      <ProtectedSection
        requiredPermission={PERMISSIONS.GET_COURSE_PROGRESS}
        title="Subjects"
      >
        <div className="pl-2 ">
          <AllSubjects student={student} />
        </div>
      </ProtectedSection>

      {/* ─── Attendance ─────────────────────────────────────── */}
      <div className=" w-full h-96 flex flex-col items-center ">
        <ProtectedSection
          requiredPermission={PERMISSIONS.GET_YEARLY_ATTENDEC}
          title="Attendance Graph"
        >
          <div className="w-full h-[95%] flex justify-center items-center">
            <AttendanceGraph cid={student?._id} />
          </div>
        </ProtectedSection>
      </div>

      {/* ─── Grade vs Task Charts (Side-by-Side) ─────────────── */}
      <div className="flex flex-col lg:flex-row w-full border-t-2 gap-4">
        {/* Grades */}
        <div className="flex-1">
          <ProtectedSection
            requiredPermission={PERMISSIONS.GET_COURSE_PROGRESS}
            title="Grades Chart"
          >
            <div className="h-[22rem] flex flex-col items-center mt-4">
              <p className="font-bold text-gray-500 mb-2">
                {t("Student Grade")}
              </p>
              <StudentGradePieChart />
            </div>
          </ProtectedSection>
        </div>

        {/* Tasks */}
        <div className="flex-1">
          <ProtectedSection
            requiredPermission={PERMISSIONS.GET_STUDENT_TASK}
            title="Task Chart"
          >
            <div className="h-[22rem] flex flex-col items-center mt-4">
              <p className="font-bold text-gray-500 mb-2">{t("Task")}</p>
              <TaskChart />
            </div>
          </ProtectedSection>
        </div>
      </div>
    </div>
  );
};

export default StudentOverView;
