import React from "react";
import Layout from "../../../../../../Components/Common/Layout";
import DashLayout from "../../../../../../Components/Admin/AdminDashLayout";
import MainSection from "./MainSection";

const CreateSyllabus = () => {
  return (
    <div>
      <Layout title={`Create Syllabus | Student Diwan`}>
       <MainSection/>
      </Layout>
    </div>
  );
};

export default CreateSyllabus;
