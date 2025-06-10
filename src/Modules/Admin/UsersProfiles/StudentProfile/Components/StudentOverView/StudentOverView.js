import React, { useEffect } from "react";
import AttendanceGraph from "./AttendanceGraph";
import StudentGradePieChart from "./StudentGradePieChart";
import TaskChart from "./TaskChart";
import AllSubjects from "../StudentCourseProgress/allSubjects/AllSubjects";
import { fetchAttendanceData } from "../../../../../../Store/Slices/Admin/Users/Students/student.action";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import ProtectedSection from "../../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../../config/permission";

const StudentOverView = ({ student }) => {
  const { t } = useTranslation("admAccounts");
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAttendanceData(student?.classId));
  }, [dispatch]);

  return (
    <>
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
              <AttendanceGraph />
            </div>
          </ProtectedSection>
        </div>
        <div className="flex justify-between w-[100%] border-t-2">
          <p className="w-[25%] font-bold text-gray-500 text-center mt-4">
            {t("Student Grade")}
          </p>
          <p className="font-bold text-gray-500 mt-4 mr-64">
            {t("Task")}
          </p>
        </div>

        <div className="flex flex-row bg-white h-[20rem] w-full">
          <ProtectedSection
            requiredPermission={PERMISSIONS.GET_COURSE_PROGRESS}
            title={"Grades Chart"}
          >
            <div className="w-50% h-[18rem]">
              <StudentGradePieChart />
            </div>
          </ProtectedSection>

          <ProtectedSection
            requiredPermission={PERMISSIONS.GET_STUDENT_TASK}
            title={"Task Chart"}
          >
            <div className="w-50% h-[18rem]">
              <TaskChart />
            </div>
          </ProtectedSection>
        </div>
      </div>
    </>
  );
};

export default StudentOverView;
