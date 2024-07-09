import React from "react";
// import Layout from "../../../../../../Components/Common/Layout";
import DashLayout from "../../../../../../../Components/Admin/AdminDashLayout";
import MainSection from "./MainSection";
import Layout from "../../../../../../../Components/Common/Layout";
import StudentDashLayout from "../../../../../../../Components/Student/StudentDashLayout";
 
const QuizzList = () => {
  console.log("first")
  return (
    <Layout>
      <StudentDashLayout children={<MainSection />} hideSearchbar={true} />
    </Layout>
  );
};

export default QuizzList;
