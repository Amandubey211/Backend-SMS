import React from "react";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import MainSection from "./MainSection";
import { useParams } from "react-router-dom";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";

const Class = () => {
  const { cid } = useParams();
  useNavHeading(cid);

  return (
    <Layout title={`${cid} | Student diwan`}>
      <DashLayout children={<MainSection />} hideAvatarList={true} />;
    </Layout>
  );
};

export default Class;
