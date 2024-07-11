import React from "react";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import MainSection from "./MainSection";
import { useSelector } from "react-redux";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";

const Class = () => {
  const className = useSelector((store) => store.Common.selectedClass);
  useNavHeading(className);

  return (
    <Layout title={`${className} | Student diwan`}>
      <DashLayout children={<MainSection />} hideAvatarList={true} />;
    </Layout>
  );
};

export default Class;
