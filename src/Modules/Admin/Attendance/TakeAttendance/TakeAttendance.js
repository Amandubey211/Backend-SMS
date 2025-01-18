import React from "react";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import MainSection from "./MainSection";
import { useSelector } from "react-redux";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";

const TakeAttendance = () => {
  const className = useSelector(
    (store) => store.common.user.classInfo.selectedClassName
  );

  useNavHeading(className, "Take Attendance");
  return (
    <Layout title={`Take Attendance | Student Diwan`}>
      <ProtectedSection requiredPermission="takeAttendence">
      <DashLayout children={<MainSection />} hideStudentView={true} />
      </ProtectedSection>
    </Layout>
  );
};

export default TakeAttendance;
