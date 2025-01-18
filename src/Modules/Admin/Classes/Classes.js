import React from "react";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import ClassesMainSection from "./MainSection/ClassesMainSection";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";
import ProtectedSection from "../../../Routes/ProtectedRoutes/ProtectedSection";

const Classes = () => {
  useNavHeading("Classes");
  return (
    <Layout title="Classes | Student diwan">
      <ProtectedSection requiredPermission="viewClasses">
      <DashLayout children={<ClassesMainSection />} hideAvatarList={true} />;
      </ProtectedSection>
    </Layout>
  );
};

export default Classes;
