import React from "react";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import MainSection from "../Addmission/MainSection";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";

const Addmission = () => {
  useNavHeading("Admin", "Student Admission");
  return (
    <Layout title="Admission | Student diwan">
      <DashLayout children={<MainSection />} hideAvatarList={true} />
    </Layout>
  );
};

export default Addmission;
