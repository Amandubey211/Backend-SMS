import React from "react";
import Layout from "../../../../Components/Common/Layout";
// import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import MainSection from "./MainSection";
import { useParams } from "react-router-dom";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import StudentDashLayout from "../../../../Components/Student/StudentDashLayout";

const StudentClass = () => {
  const { cid } = useParams();
  useNavHeading(cid);

  return (
    <Layout title={`${cid} | Student diwan`}>
      <StudentDashLayout children={<MainSection />} hideAvatarList={true} />;
    </Layout>
  );
};

export default StudentClass;
