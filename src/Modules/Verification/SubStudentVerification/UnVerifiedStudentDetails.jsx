import React from "react";
import DashLayout from "../../../Components/DashLayout";
import StudentDetail from "./StudentDetails";
import Layout from "../../../Components/Layout";

const UnVerifiedStudentDetails = () => {
  return (
    <Layout title="Student Verification">
      <DashLayout children={<StudentDetail />} />;
    </Layout>
  );
};

export default UnVerifiedStudentDetails;
