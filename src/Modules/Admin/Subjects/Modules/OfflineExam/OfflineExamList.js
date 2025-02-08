import React from "react";
import MainSection from "./MainSection";
import Layout from "../../../../../Components/Common/Layout";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";

const OfflineExamList = () => {
  return (
    <Layout title={`Offline Exam List | Student Diwan`}>
      <DashLayout children={<MainSection />} hideSearchbar={true} />
    </Layout>
  );
};

export default OfflineExamList;
