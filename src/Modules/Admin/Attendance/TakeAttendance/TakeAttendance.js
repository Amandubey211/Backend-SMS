import React from "react";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import MainSection from "./MainSection";
import { useSelector } from "react-redux";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";

const TakeAttendance = () => {
  const className = useSelector((store) => store.Common.selectedClass);

  useNavHeading(className, "Attendance");
  return (
    <Layout title={`Take Attendance | Student Diwan`}>
      <DashLayout children={<MainSection />} hideStudentView={true} />
    </Layout>
  );
};

export default TakeAttendance;
