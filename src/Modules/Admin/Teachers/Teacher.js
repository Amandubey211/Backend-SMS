import React from "react";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import MainSection from "./MainSection";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";
import { useParams } from "react-router-dom";

const Teacher = () => {
  const { cid } = useParams();
  useNavHeading(cid, "Teachers");
  return (
    <Layout title={`${cid} | Teachers | Student Diwan`}>
     <DashLayout children={<MainSection />}  hideAvatarList={true}/>
    </Layout>
  );
};

export default Teacher;
