import React from "react";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Student/StudentDashLayout";

import StudentMainSection from "./StudentMainSection";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";
const StudentDash = () => {
  useNavHeading("Students");
  return (
    <Layout title="Student Dashboard">
      <DashLayout children={<StudentMainSection />} />
    </Layout>
  );
};

export default StudentDash;
