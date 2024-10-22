import React from "react";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import MainSection from "./MainSection";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";
import { useSelector } from "react-redux";

const Students = () => {
  const className = useSelector(
    (store) => store.common.user.classInfo.selectedClassName
  );

  useNavHeading(className, "Students");
  return (
    <Layout title={`${className} | Students | Student Diwan`}>
      <DashLayout children={<MainSection />} hideAvatarList={true} />
    </Layout>
  );
};

export default Students;
