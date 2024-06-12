import React from "react";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import Layout from "../../../Components/Common/Layout";
import MainSection from "../Verification/MainSection";

const VerificationPage = () => {
  return (
    <Layout title="Student Verification List">
      <DashLayout children={<MainSection /> } hideAvatarList={true} hideStudentView={true} hideSearchbar={true} />;
    </Layout>
  );
};

export default VerificationPage;
