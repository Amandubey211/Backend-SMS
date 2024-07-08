import React from "react";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import MainSection from "./MainSection";

const TakeAttendance = () => {
  return (
    <Layout>
      <DashLayout children={<MainSection />}hideStudentView={true} />
    </Layout>
  );
};

export default TakeAttendance;
