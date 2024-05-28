import React from "react";
import DashLayout from "../../Components/DashLayout";
import MainSection from "./MainSection";
import Layout from "../../Components/Layout";

const VerificationPage = () => {
  return (
    <Layout title="Student Verification List">
      <DashLayout children={<MainSection />} />;
    </Layout>
  );
};

export default VerificationPage;
