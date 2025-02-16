import React from "react";
import MainSection from "./MainSection.js";
import Layout from "../../../Components/Common/Layout.js";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading .js";
import { useSelector } from "react-redux";
import ParentDashLayout from "../../Parents/ParentDashLayout.js";
import StudentDashLayout from "../../Student/StudentDashLayout.js";
import DashLayout from "../../Admin/AdminDashLayout.js";

const Academic = () => {
  const role = useSelector((store) => store.common.auth.role);
  useNavHeading(role, `Academic`);
  return (
    <Layout title={` Academics  | Student Diwan`}>
      {role == "parent" ? (
        <ParentDashLayout hideAvatarList={true}>
          <MainSection />
        </ParentDashLayout>
      ) : role == "student" ? (
        <StudentDashLayout>
          <MainSection />
        </StudentDashLayout>
      ) : (
        <DashLayout>
          <MainSection />
        </DashLayout>
      )}
    </Layout>
  );
};

export default Academic;
