import React from "react";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";
import MainSection from "./MainSection";
import { useSelector } from "react-redux";
import ProtectedSection from "../../../Routes/ProtectedRoutes/ProtectedSection";

const Group_Section = () => {
  const className = useSelector(
    (store) => store.common.user.classInfo.selectedClassName
  );
  useNavHeading(className, "Sections & Groups");
  return (
    <Layout title={`${className} | Group & Section | Student diwan`}>
          
      <DashLayout children={<MainSection />} hideAvatarList={true} />
     
    </Layout>
  );
};

export default Group_Section;
