import React from "react";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import StudentDetail from "./StudentDetails";

const UnVerifiedStudentDetails = () => {
  return (
    <Layout title="Student Verification">
      <DashLayout children={<StudentDetail />} />;
    </Layout>
  );
};

export default UnVerifiedStudentDetails;
