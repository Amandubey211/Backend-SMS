import React from "react";
// import MainSection from "./MainSection";
import Layout from "../../../../../Components/Common/Layout";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
import OfflineExamView from "./Components/OfflineExamView";

const OfflineExamViewList = () => {
  return (
    <Layout title={`Offline Exam Page List | Student Diwan`}>
      <DashLayout children={<OfflineExamView />} hideSearchbar={true} />
    </Layout>
  );
};

export default OfflineExamViewList;
