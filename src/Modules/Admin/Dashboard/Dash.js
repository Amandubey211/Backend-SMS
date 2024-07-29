import React from "react";
import MainSection from "./MainSection.js";
import Layout from "../../../Components/Common/Layout.js";
import DashLayout from "../../../Components/Admin/AdminDashLayout.js";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading .js";
import { useSelector } from "react-redux";

const Dash = () => {
  const role = useSelector((store) => store.Auth.role);


  const formattedRole =
    role?.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
    useNavHeading(formattedRole);

  return (
    <Layout title={`${formattedRole} Dash | Student Diwan`}>
      <DashLayout children={<MainSection />} hideAvatarList={true} />
    </Layout>
  );
};

export default Dash;
