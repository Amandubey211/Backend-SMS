import React from "react";
// import Layout from "../../../Components/Common/Layout";

import DashLayout from "../../../Components/Admin/AdminDashLayout";
import ClassesMainSection from "./MainSection/ClassesMainSection";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";
import Layout from "../../../Components/Common/Layout";
import StudentDashLayout from "../../../Components/Student/StudentDashLayout";

const Classes = () => {
  useNavHeading("Classes");
  return (
    <Layout title="Classes | Student diwan">
      <StudentDashLayout children={<ClassesMainSection />} hideAvatarList={true} />;
    </Layout>
  );
};

export default Classes;
