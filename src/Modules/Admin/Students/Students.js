import React from "react";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import MainSection from "./MainSection";
import { useParams } from "react-router-dom";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";

const Students = () => {
  const { cid } = useParams();

  useNavHeading(cid, "Students");
  return (
    <Layout title={`${cid} | Students | Student Diwan`}>
      <DashLayout children={<MainSection />} hideAvatarList={true} />
    </Layout>
  );
};

export default Students;
