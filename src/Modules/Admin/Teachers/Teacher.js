import React from "react";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import MainSection from "./MainSection";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";
import { useSelector } from "react-redux";

const Teacher = () => {
  const className = useSelector((store) => store.Common.selectedClass);

  useNavHeading(className, "Teachers");
  return (
    <Layout title={`${className} | Teachers | Student Diwan`}>
      <DashLayout children={<MainSection />} hideAvatarList={true} />
    </Layout>
  );
};

export default Teacher;
